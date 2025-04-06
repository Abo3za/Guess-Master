import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCMk2LQFhMsnjpTTzMtElKMCcJkF2mXSxk",
  authDomain: "guessgame-f965b.firebaseapp.com",
  projectId: "guessgame-f965b",
  storageBucket: "guessgame-f965b.firebasestorage.app",
  messagingSenderId: "625949732251",
  appId: "1:625949732251:web:ad28ed69939bfab7a6853e",
  measurementId: "G-Z4YQ2D2VWJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export const db = getFirestore(app); 