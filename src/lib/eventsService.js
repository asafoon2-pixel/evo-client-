import {
  collection, doc, addDoc, updateDoc, getDoc, getDocs,
  query, where, orderBy, serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

// ── Events ─────────────────────────────────────────────────────────────────

export async function createEvent(userId, eventData) {
  const ref = await addDoc(collection(db, 'events'), {
    userId,
    ...eventData,
    status:    'draft',
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
  const q = query(
    collection(db, 'events'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
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
