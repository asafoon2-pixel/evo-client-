import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db } from './firebase'

// Returns the set of category strings a vendor doc may have been stored with
function categoryVariants(categoryId) {
  const pascal = categoryId.charAt(0).toUpperCase() + categoryId.slice(1)
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
    fullDescription:  data.bio || '',
    image:            data.cover_photo_url || data.profile_photo_url || null,
    gallery:          data.gallery || [],
    rating:           data.avg_rating     || 0,
    reviewCount:      data.total_reviews  || 0,
    eventsCount:      data.total_events   || 0,
    responseTime:     data.avg_response_time_hours
                        ? `תוך ${data.avg_response_time_hours} שע׳`
                        : null,
    priceRange:       priceRange,
    city:             data.city           || '',
    instagram:        data.instagram_handle || '',
    website:          data.website_url    || '',
    phone:            data.phone          || '',
    whatsapp:         data.whatsapp_number || data.phone || '',
    preferredContact: data.preferred_contact || 'whatsapp',
    category:         data.category       || '',
    yearsExperience:  data.years_experience || 0,
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
    badge:       data.badge       || (data.is_popular ? 'most_popular' : null),
    minGuests:   data.min_guests  || 0,
    maxGuests:   data.max_guests  || 0,
    minHours:    data.min_hours   || 0,
    addOns:      data.add_ons     || [],
  }
}

function normaliseProduct(id, data) {
  return {
    id,
    label:       data.name        || 'מוצר',
    description: data.description || '',
    price:       data.price       || 0,
    priceType:   data.price_type  || 'fixed',
    image:       data.image_url   || null,
    category:    data.category    || '',
    maxGuests:   data.max_guests  || 0,
    isAvailable: data.is_available !== false,
  }
}

/**
 * Fetch all active vendors for a given category.
 */
export async function getVendorsByCategory(categoryId) {
  const ref = collection(db, 'vendors')
  const variants = categoryVariants(categoryId)

  async function fetchByVariant(catValue, requireActive) {
    const conditions = [where('category', '==', catValue)]
    if (requireActive) conditions.push(where('is_active', '==', true))
    const q = query(ref, ...conditions)
    return getDocs(q)
  }

  const seen = new Map()

  // First pass: active vendors only
  for (const variant of variants) {
    try {
      const snap = await fetchByVariant(variant, true)
      snap.docs.forEach(d => { if (!seen.has(d.id)) seen.set(d.id, d) })
    } catch (_) {}
  }

  // Fallback: all vendors in category
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
    .filter(p => p.label && p.price >= 0)
    .sort((a, b) => a.price - b.price)
}

/**
 * Fetch products sub-collection for a vendor.
 */
export async function getVendorProducts(vendorId) {
  const snap = await getDocs(collection(db, 'vendors', vendorId, 'products'))
  return snap.docs
    .map(d => normaliseProduct(d.id, d.data()))
    .filter(p => p.isAvailable)
    .sort((a, b) => (a.price || 0) - (b.price || 0))
}
