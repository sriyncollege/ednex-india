import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCHjAm0Zw9MhdTd5DhquaLdzYHb5tmmmkQ",
  authDomain: "education-nexus-of-india.firebaseapp.com",
  projectId: "education-nexus-of-india",
  storageBucket: "education-nexus-of-india.firebasestorage.app",
  messagingSenderId: "1079227729828",
  appId: "1:1079227729828:web:8aefd7ffacfad2326ae331"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// ✅ THIS LINE FIXES LOGIN ACROSS DOMAINS
setPersistence(auth, browserLocalPersistence);

export const db = getFirestore(app);
