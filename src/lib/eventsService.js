import {
  collection, doc, addDoc, updateDoc, getDoc, getDocs,
  query, where, orderBy, serverTimestamp, onSnapshot,
} from 'firebase/firestore'
import { db, auth } from './firebase'

// ── Events ─────────────────────────────────────────────────────────────────

export async function createEvent(userId, eventData) {
  const ref = await addDoc(collection(db, 'events'), {
    userId,
    status:    'draft',
    ...eventData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateEvent(eventId, data) {
  await updateDoc(doc(db, 'events', eventId), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function getEvent(eventId) {
  const snap = await getDoc(doc(db, 'events', eventId))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function getUserEvents(userId) {
  try {
    // Try with orderBy (requires composite index)
    const q = query(
      collection(db, 'events'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch {
    // Fallback: query without orderBy, sort client-side
    const q = query(collection(db, 'events'), where('userId', '==', userId))
    const snap = await getDocs(q)
    return snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0))
  }
}

export function listenToUserEvents(userId, callback) {
  const q = query(collection(db, 'events'), where('userId', '==', userId))
  return onSnapshot(q, snap => {
    const events = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0))
    callback(events)
  }, err => console.error('listenToUserEvents error:', err))
}

// Auth-aware convenience wrappers (userId derived from auth.currentUser)

// Create a new event for the currently signed-in user
export async function createEventForCurrentUser(eventData) {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('User not authenticated')
  return createEvent(uid, eventData)
}

// Get all events for the currently signed-in user
export async function getMyEvents() {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('User not authenticated')
  return getUserEvents(uid)
}

// ── Orders ──────────────────────────────────────────────────────────────────

export async function createOrder(userId, eventId, orderData) {
  const ref = await addDoc(collection(db, 'orders'), {
    userId,
    eventId,
    ...orderData,
    status:    'pending',
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function getUserOrders(userId) {
  const q = query(
    collection(db, 'orders'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}
