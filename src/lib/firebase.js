import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            'AIzaSyAo3BJW3qky1evqwWw1_jt-lsNamxkRjkQ',
  authDomain:        'evo-supplier.firebaseapp.com',
  projectId:         'evo-supplier',
  storageBucket:     'evo-supplier.firebasestorage.app',
  messagingSenderId: '440413409193',
  appId:             '1:440413409193:web:b37bc250087811d053feb8',
  measurementId:     'G-KD4ETCC0CJ',
}

const app      = initializeApp(firebaseConfig)
export const auth     = getAuth(app)
export const db       = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
