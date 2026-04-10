import {
  doc, getDoc, updateDoc, serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

// ── Users ───────────────────────────────────────────────────────────────────

export async function getUser(uid) {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function updateUser(uid, data) {
  await updateDoc(doc(db, 'users', uid), {
    ...data,
    last_active_at: serverTimestamp(),
  })
}

export async function updateTasteProfile(uid, tasteData) {
  await updateDoc(doc(db, 'users', uid), {
    ...tasteData,
    taste_last_updated: serverTimestamp(),
    last_active_at:     serverTimestamp(),
  })
}
