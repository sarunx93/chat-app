// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: 'chat-app-6177e.firebaseapp.com',
  projectId: 'chat-app-6177e',
  storageBucket: 'chat-app-6177e.firebasestorage.app',
  messagingSenderId: '17755761534',
  appId: '1:17755761534:web:61d8010587d2fc8ed6e12f',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()
