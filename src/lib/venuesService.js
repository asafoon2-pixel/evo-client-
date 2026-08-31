import {
  collection, doc, getDoc, getDocs, query, where,
  addDoc, updateDoc, onSnapshot, setDoc, Timestamp, orderBy, limit,
} from 'firebase/firestore'
import { db } from './firebase'

// ── Cache ────────────────────────────────────────────────────────────────────
const cache = new Map()
const TTL   = 5 * 60 * 1000 // 5 minutes

function getCached(key) {
  const e = cache.get(key)
  if (!e || Date.now() - e.ts > TTL) { cache.delete(key); return null }
  return e.data
}
function setCached(key, data) { cache.set(key, { data, ts: Date.now() }) }
export function clearVenueCache() { cache.clear() }

// ── Normalise ────────────────────────────────────────────────────────────────
function normaliseVenue(id, data) {
  return {
    id,
    name:             data.name             || 'חלל אירועים',
    description:      data.description      || '',
    city:             data.city             || '',
    full_address:     data.full_address     || '',
    coordinates:      data.coordinates      || null,   // { lat, lng }

    type:             data.type             || 'hall', // hall|garden|loft|rooftop|beach|private_estate
    indoor_outdoor:   data.indoor_outdoor   || 'indoor',

    capacity_min:     data.capacity_min     || 0,
    capacity_max:     data.capacity_max     || 999,

    price_per_event:  data.price_per_event  || 0,
    price_type:       data.price_type       || 'fixed', // fixed|per_guest|hourly

    features:         data.features         || [],   // ['חניה','נגישות','מטבח','מיזוג','גן']
    event_types:      data.event_types      || [],   // ['חתונה','בר מצווה','אירוע חברה']

    cover_photo_url:  data.cover_photo_url  || null,
    gallery:          data.gallery          || [],

    avg_rating:       data.avg_rating       || 0,
    total_reviews:    data.total_reviews    || 0,

    is_active:        data.is_active        !== false,
    is_approved:      data.is_approved      !== false,
    owner_uid:        data.owner_uid        || null,

    _raw: data,
  }
}

// ── Type labels ──────────────────────────────────────────────────────────────
export const VENUE_TYPES = {
  hall:            'אולם אירועים',
  garden:          'גן אירועים',
  loft:            'לופט',
  rooftop:         'גג / טרסה',
  beach:           'חוף / ים',
  private_estate:  'אחוזה פרטית',
  restaurant:      'מסעדה / מקום אכילה',
  studio:          'סטודיו / חלל יצירתי',
}

export const VENUE_FEATURES = [
  'חניה', 'נגישות לנכים', 'מטבח', 'מיזוג', 'גן', 'בריכה',
  'לינה', 'ציוד AV', 'Wi-Fi', 'חדר כלה', 'אזור עישון',
]

export const EVENT_TYPES = [
  'חתונה', 'בר/בת מצווה', 'אירוע חברה', 'יום הולדת',
  'מסיבת סיום', 'כנס', 'ימי גיבוש', 'הוקרה', 'אחר',
]

// ── Queries ──────────────────────────────────────────────────────────────────

/**
 * Get all active approved venues, with optional filters.
 */
export async function getVenues({ city, guestCount, eventType, budget } = {}) {
  const cacheKey = `venues_${city}_${guestCount}_${eventType}_${budget}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  const snap = await getDocs(collection(db, 'venues'))
  let venues = snap.docs
    .map(d => normaliseVenue(d.id, d.data()))
    .filter(v => v.is_active && v.is_approved)

  if (city)       venues = venues.filter(v => v.city === city || !city)
  if (guestCount) venues = venues.filter(v => v.capacity_min <= guestCount && v.capacity_max >= guestCount)
  if (eventType)  venues = venues.filter(v => !v.event_types.length || v.event_types.includes(eventType))
  if (budget)     venues = venues.filter(v => v.price_per_event <= budget)

  venues.sort((a, b) => b.avg_rating - a.avg_rating)
  setCached(cacheKey, venues)
  return venues
}

/** Fetch a single venue by ID */
export async function getVenueById(id) {
  const d = await getDoc(doc(db, 'venues', id))
  return d.exists() ? normaliseVenue(d.id, d.data()) : null
}

/** Get all venues owned by a supplier UID */
export async function getVenuesByOwner(ownerUid) {
  const q = query(collection(db, 'venues'), where('owner_uid', '==', ownerUid))
  const snap = await getDocs(q)
  return snap.docs.map(d => normaliseVenue(d.id, d.data()))
}

// ── Availability ─────────────────────────────────────────────────────────────

/**
 * Subscribe to real-time availability for a venue in a given month.
 * Returns unsubscribe fn.
 */
export function subscribeVenueAvailability(venueId, year, month, onData) {
  const ref = collection(db, 'venues', venueId, 'availability')
  return onSnapshot(ref, snap => {
    const map = {}
    const prefix = `${year}-${String(month).padStart(2, '0')}-`
    snap.docs.forEach(d => {
      if (d.id.startsWith(prefix)) map[d.id] = d.data().is_available !== false
    })
    onData(map)
  })
}

/** Set availability for a date. dateStr = 'YYYY-MM-DD' */
export async function setVenueAvailability(venueId, dateStr, isAvailable) {
  const [y, m, day] = dateStr.split('-').map(Number)
  await setDoc(doc(db, 'venues', venueId, 'availability', dateStr), {
    date: Timestamp.fromDate(new Date(y, m - 1, day)),
    is_available: isAvailable,
  })
}

// ── Booking / Inquiry ────────────────────────────────────────────────────────

/**
 * Create a venue booking inquiry.
 * Stored in venues/{venueId}/leads and also in global leads collection.
 */
export async function submitVenueInquiry({
  venueId, venueName, clientUid, clientName, clientEmail, clientPhone,
  eventDate, guestCount, eventType, message, budget,
}) {
  const payload = {
    venue_id:    venueId,
    venue_name:  venueName,
    client_uid:  clientUid,
    client_name: clientName,
    client_email: clientEmail,
    client_phone: clientPhone,
    event_date:  eventDate  ? Timestamp.fromDate(new Date(eventDate)) : null,
    guest_count: guestCount || 0,
    event_type:  eventType  || '',
    message:     message    || '',
    budget:      budget     || 0,
    status:      'new',     // new | viewed | replied | booked | rejected
    created_at:  Timestamp.now(),
    type:        'venue_inquiry',
  }
  // Write to venues sub-collection (supplier sees it)
  await addDoc(collection(db, 'venues', venueId, 'leads'), payload)
  // Write to global venue_inquiries (admin/client sees it)
  return addDoc(collection(db, 'venue_inquiries'), payload)
}

// ── Supplier CRUD ─────────────────────────────────────────────────────────────

/** Create a new venue document (called during supplier onboarding) */
export async function createVenue(ownerUid, data) {
  const payload = {
    ...data,
    owner_uid:   ownerUid,
    is_active:   true,
    is_approved: false, // admin approves
    avg_rating:  0,
    total_reviews: 0,
    created_at:  Timestamp.now(),
    updated_at:  Timestamp.now(),
  }
  return addDoc(collection(db, 'venues'), payload)
}

/** Update an existing venue document */
export async function updateVenue(venueId, data) {
  return updateDoc(doc(db, 'venues', venueId), {
    ...data,
    updated_at: Timestamp.now(),
  })
}
