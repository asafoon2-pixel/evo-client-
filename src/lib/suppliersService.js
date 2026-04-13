import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from './firebase'

// Returns the set of category strings a vendor doc may have been stored with
function categoryVariants(categoryId) {
  const pascal = categoryId.charAt(0).toUpperCase() + categoryId.slice(1)
  // Include lowercase in case any doc was stored that way
  const lower = categoryId.toLowerCase()
  return pascal === lower ? [pascal] : [pascal, lower]
}

// Normalises a Firestore vendor doc → shape the UI components expect
function normaliseVendor(id, data) {
  const minPkg = data._minPrice || null
  const maxPkg = data._maxPrice || null
  const priceRange = minPkg && maxPkg
    ? `₪${Number(minPkg).toLocaleString()}–₪${Number(maxPkg).toLocaleString()}`
    : minPkg
    ? `מ-₪${Number(minPkg).toLocaleString()}`
    : null

  return {
    id,
    name:             data.business_name || data.owner_full_name || 'ספק',
    shortDescription: data.bio || '',
    image:            data.cover_photo_url || data.profile_photo_url || null,
    rating:           data.avg_rating     || 0,
    reviewCount:      data.total_reviews  || 0,
    priceRange:       priceRange,
    city:             data.city           || '',
    instagram:        data.instagram_handle || '',
    phone:            data.phone          || '',
    whatsapp:         data.whatsapp_number || data.phone || '',
    preferredContact: data.preferred_contact || 'whatsapp',
    category:         data.category       || '',
    isApproved:       data.is_approved    || false,
    isActive:         data.is_active      || false,
    _raw:             data,
  }
}

function normalisePackage(id, data) {
  return {
    id,
    label:       data.name        || 'חבילה',
    description: data.description || '',
    price:       data.price       || 0,
    priceType:   data.price_type  || 'fixed',
    image:       data.image_url   || null,
    badge:       data.badge       || null,
  }
}

/**
 * Fetch all active vendors for a given category.
 * Queries both PascalCase and lowercase category variants to handle docs that were stored
 * with either casing. Falls back to fetching all vendors in the category (ignoring is_active)
 * when none are found — useful in dev before vendors have been activated.
 * The composite-index query (category + is_active) is wrapped in try/catch so a missing
 * Firestore index degrades gracefully to the fallback instead of throwing.
 */
export async function getVendorsByCategory(categoryId) {
  const ref = collection(db, 'vendors')
  const variants = categoryVariants(categoryId)

  // Helper: fetch docs matching one category string, with optional is_active filter
  async function fetchByVariant(catValue, requireActive) {
    const conditions = [where('category', '==', catValue)]
    if (requireActive) conditions.push(where('is_active', '==', true))
    const q = query(ref, ...conditions)
    return getDocs(q)
  }

  // Collect results across all category variants, de-duplicated by document id
  const seen = new Map()

  // First pass: active vendors only (may require a composite index; degrade gracefully)
  for (const variant of variants) {
    try {
      const snap = await fetchByVariant(variant, true)
      snap.docs.forEach(d => { if (!seen.has(d.id)) seen.set(d.id, d) })
    } catch (_) {
      // Composite index may not exist yet — fall through to the fallback pass
    }
  }

  // Fallback pass: all vendors in category, regardless of is_active
  // (covers dev environments, missing index, or vendors with is_active not yet set)
  if (seen.size === 0) {
    for (const variant of variants) {
      try {
        const snap = await fetchByVariant(variant, false)
        snap.docs.forEach(d => { if (!seen.has(d.id)) seen.set(d.id, d) })
      } catch (_) {}
    }
  }

  return Array.from(seen.values()).map(d => normaliseVendor(d.id, d.data()))
}

/**
 * Fetch packages sub-collection for a vendor.
 */
export async function getVendorPackages(vendorId) {
  const snap = await getDocs(collection(db, 'vendors', vendorId, 'packages'))
  return snap.docs
    .map(d => normalisePackage(d.id, d.data()))
    .sort((a, b) => a.price - b.price)
}
