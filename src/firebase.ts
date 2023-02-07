import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore, collection } from 'firebase/firestore';

// Provide Firebase config data
const firebaseConfig = {
  apiKey: 'AIzaSyBtplJk1j64AkNmmqH0u5kBPJlyl2K-tGk',
  authDomain: 'fb-project-2d3e6.firebaseapp.com',
  projectId: 'fb-project-2d3e6',
  storageBucket: 'fb-project-2d3e6.appspot.com',
  messagingSenderId: '962181277014',
  appId: '1:962181277014:web:99b841e0a88c606ead62f7',
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize firestore service
export const db = getFirestore(app);

// Make a collection reference
export const collRef = collection(db, 'tracks');

// Initialize Cloud Storage
export const storage = getStorage(app);
