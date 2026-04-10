import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from './firebase'

// Create or update user doc in Firestore (full Users schema)
async function upsertUser(firebaseUser) {
  const ref  = doc(db, 'users', firebaseUser.uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, {
      id:                 firebaseUser.uid,
      email:              firebaseUser.email        || '',
      full_name:          firebaseUser.displayName  || '',
      profile_photo_url:  firebaseUser.photoURL     || '',
      phone:              '',
      age:                null,
      gender:             '',
      city:               '',
      instagram_handle:   '',
      preferred_language: 'he',
      preferred_contact:  '',
      whatsapp_number:    '',
      alternate_phone:    '',
      vibe_tags:          [],
      preferred_colors:   [],
      preferred_styles:   [],
      energy_level:       null,
      swipe_history:      [],
      taste_last_updated: null,
      created_at:         serverTimestamp(),
      last_active_at:     serverTimestamp(),
    })
  } else {
    await updateDoc(ref, { last_active_at: serverTimestamp() })
  }
}

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider)
  await upsertUser(result.user)
  return result.user
}

export async function loginWithEmail(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password)
  return result.user
}

export async function registerWithEmail(email, password) {
  const result = await createUserWithEmailAndPassword(auth, email, password)
  await upsertUser(result.user)
  return result.user
}

export async function logout() {
  await signOut(auth)
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback)
}
