import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  reload,
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
      email_verified:     false,
      created_at:         serverTimestamp(),
      last_active_at:     serverTimestamp(),
    })
  } else {
    await updateDoc(ref, {
      last_active_at:  serverTimestamp(),
      email_verified:  firebaseUser.emailVerified,
    })
  }
}

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider)
  await upsertUser(result.user)
  return result.user
}

export async function loginWithEmail(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password)
  // Refresh to get latest emailVerified status
  await reload(result.user)
  if (!result.user.emailVerified) {
    throw Object.assign(new Error('email-not-verified'), { code: 'auth/email-not-verified' })
  }
  await upsertUser(result.user)
  return result.user
}

export async function registerWithEmail(email, password) {
  const result = await createUserWithEmailAndPassword(auth, email, password)
  // Send verification email immediately
  await sendEmailVerification(result.user, {
    url: 'https://evo-client-main.vercel.app', // redirect after verification
    handleCodeInApp: false,
  })
  await upsertUser(result.user)
  // Sign out immediately — must verify email before using app
  await signOut(auth)
  return result.user
}

export async function resendVerificationEmail(email, password) {
  // Re-sign-in to get fresh user object, then resend
  const result = await signInWithEmailAndPassword(auth, email, password)
  await sendEmailVerification(result.user)
  await signOut(auth)
}

export async function logout() {
  await signOut(auth)
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback)
}
