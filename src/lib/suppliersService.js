import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db } from './firebase'

// ── In-memory cache ──────────────────────────────────────────────────────────
const cache = new Map()

const TTL = {
  vendors:  5  * 60 * 1000, // 5 minutes
  packages: 10 * 60 * 1000, // 10 minutes
  products: 10 * 60 * 1000, // 10 minutes
}

function getCached(key) {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.timestamp > TTL[key.split('_')[0]]) {
    cache.delete(key)
    return null
  }
  return entry.data
}

function setCached(key, data) {
  cache.set(key, { data, timestamp: Date.now() })
}

export function clearCache() {
  cache.clear()
}

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
  const cacheKey = `vendors_${categoryId}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  const firestoreCat = toFirestoreCategory(categoryId)
  const ref = collection(db, 'vendors')

  // Fetch all vendors and filter in JS — avoids composite index issues
  const snap = await getDocs(ref)
  const allVendors = snap.docs.map(d => normaliseVendor(d.id, d.data()))

  const inCategory = allVendors.filter(v => v.category === firestoreCat)
  const active = inCategory.filter(v => v.isActive)
  const result = active.length > 0 ? active : inCategory
  setCached(cacheKey, result)
  return result
}

/**
 * Fetch packages sub-collection for a vendor.
 */
export async function getVendorPackages(vendorId) {
  const cacheKey = `packages_${vendorId}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  const snap = await getDocs(collection(db, 'vendors', vendorId, 'packages'))
  const result = snap.docs
    .map(d => normalisePackage(d.id, d.data()))
    .filter(p => p.label && p.price >= 0)
    .sort((a, b) => a.price - b.price)
  setCached(cacheKey, result)
  return result
}

/**
 * Fetch products sub-collection for a vendor.
 */
export async function getVendorProducts(vendorId) {
  const cacheKey = `products_${vendorId}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  const snap = await getDocs(collection(db, 'vendors', vendorId, 'products'))
  const result = snap.docs
    .map(d => normaliseProduct(d.id, d.data()))
    .filter(p => p.isAvailable)
    .sort((a, b) => (a.price || 0) - (b.price || 0))
  setCached(cacheKey, result)
  return result
}

/**
 * Fetch all active vendors across all categories.
 */
export async function getAllVendors() {
  const cacheKey = 'vendors_all'
  const cached = getCached(cacheKey)
  if (cached) return cached

  const ref = collection(db, 'vendors')
  let q = query(ref, where('is_active', '==', true))
  let snap = await getDocs(q)
  if (snap.empty) {
    snap = await getDocs(ref)
  }
  const result = snap.docs.map(d => normaliseVendor(d.id, d.data()))
  setCached(cacheKey, result)
  return result
}

/**
 * Fetch a single vendor by UID (direct doc lookup).
 */
export async function getVendorById(uid) {
  const { getDoc, doc: fsDoc } = await import('firebase/firestore')
  const d = await getDoc(fsDoc(db, 'vendors', uid))
  if (d.exists()) return normaliseVendor(d.id, d.data())
  return null
}

/**
 * Find a vendor by slug (derived as: normalized-name-LAST4UID)
 * Extracts the last 4 chars of the slug (after final '-') as uid suffix,
 * then fetches all vendors and matches.
 */
export async function getVendorBySlug(slug) {
  if (!slug) return null
  // Try stored slug field first
  const { query: fsQuery, where: fsWhere } = await import('firebase/firestore')
  try {
    const q = fsQuery(collection(db, 'vendors'), fsWhere('slug', '==', slug))
    const snap = await getDocs(q)
    if (!snap.empty) return normaliseVendor(snap.docs[0].id, snap.docs[0].data())
  } catch (_) {}
  // Fallback: match by last 4 chars of UID embedded in slug
  const parts = slug.split('-')
  const uidSuffix = parts[parts.length - 1]
  if (uidSuffix?.length === 4) {
    const allSnap = await getDocs(collection(db, 'vendors'))
    const match = allSnap.docs.find(d => d.id.endsWith(uidSuffix))
    if (match) return normaliseVendor(match.id, match.data())
  }
  return null
}
