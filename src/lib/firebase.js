import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  projectId:         'evo-app---clinet',
  appId:             '1:803193642856:web:f2503eea27549e583040dd',
  storageBucket:     'evo-app---clinet.firebasestorage.app',
  apiKey:            'AIzaSyBH0xmTCjqNhWoJ7DKzDL4VbeDnH_wHqF8',
  authDomain:        'evo-app---clinet.firebaseapp.com',
  messagingSenderId: '803193642856',
}

const app      = initializeApp(firebaseConfig)
export const auth     = getAuth(app)
export const db       = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
