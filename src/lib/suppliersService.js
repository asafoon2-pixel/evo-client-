import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from './firebase'

// Maps client category IDs (lowercase) → Firestore category value (capitalized)
function toFirestoreCategory(categoryId) {
  return categoryId.charAt(0).toUpperCase() + categoryId.slice(1)
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
 * Fetch all active + approved vendors for a given category.
 * Falls back to returning all vendors in the category if none are approved/active yet.
 */
export async function getVendorsByCategory(categoryId) {
  const firestoreCat = toFirestoreCategory(categoryId)
  const ref = collection(db, 'vendors')

  // First try: active + approved
  let q = query(ref, where('category', '==', firestoreCat), where('is_active', '==', true))
  let snap = await getDocs(q)

  // Fallback: any vendor in this category (e.g., during dev before vendors are approved)
  if (snap.empty) {
    q = query(ref, where('category', '==', firestoreCat))
    snap = await getDocs(q)
  }

  return snap.docs.map(d => normaliseVendor(d.id, d.data()))
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
