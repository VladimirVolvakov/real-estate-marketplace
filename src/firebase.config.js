// Import the functions you need from the SDKs you need
import { getFirestore } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'

// Your web app Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKccDIIscnbaTWwF-o00BblgbhOH0wNsk",
  authDomain: "real-estate-marketplace-d133f.firebaseapp.com",
  projectId: "real-estate-marketplace-d133f",
  storageBucket: "real-estate-marketplace-d133f.appspot.com",
  messagingSenderId: "372887739968",
  appId: "1:372887739968:web:a645e145b29ad7e85609a5"
}

// Initialize Firebase
initializeApp(firebaseConfig)
export const db = getFirestore()