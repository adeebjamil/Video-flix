// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCqPG60tIJOOTy90m0olbsPkTbMK8F1p28",
  authDomain: "vitecontact-43b10.firebaseapp.com",
  projectId: "vitecontact-43b10",
  storageBucket: "vitecontact-43b10.firebasestorage.app",
  messagingSenderId: "35605605323",
  appId: "1:35605605323:web:823cd16be007499dea244e"
  };

// Initialize Firebase (Singleton pattern)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { auth };
