// ═══════════════════════════════════════════════════════
//  Firebase Configuration — Smart Stadium
// ═══════════════════════════════════════════════════════
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAD06TZ9BbXuW67fo2iuE30BsgVregsNGs",
  authDomain: "smart-web-stadium.firebaseapp.com",
  projectId: "smart-web-stadium",
  storageBucket: "smart-web-stadium.firebasestorage.app",
  messagingSenderId: "731791825163",
  appId: "1:731791825163:web:c0e058e02211d1891b2a0e",
  measurementId: "G-ZPB0ZYN6W1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Force account selection on every sign-in
googleProvider.setCustomParameters({ prompt: 'select_account' });

export {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
};
