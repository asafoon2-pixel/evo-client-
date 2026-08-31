import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY?.trim(),
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.trim(),
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim(),
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET?.trim(),
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID?.trim(),
  appId:             import.meta.env.VITE_FIREBASE_APP_ID?.trim(),
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID?.trim(),
}

const app      = initializeApp(firebaseConfig)
export const auth     = getAuth(app)
export const db       = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()

if (import.meta.env.VITE_USE_EMULATOR === 'true') {
  connectFirestoreEmulator(db, 'localhost', 8080)
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
}
