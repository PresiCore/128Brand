import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyDaZpr6FyiBoy5jAuoO8J341yo6GGztdsU",
  authDomain: "128brand.com",
  projectId: "brand-176eb",
  storageBucket: "brand-176eb.firebasestorage.app",
  messagingSenderId: "101111014400",
  appId: "1:101111014400:web:055b6ea2384fe306a5a4e5",
  measurementId: "G-YD20MNX3CC"
};

// Initialize Firebase (Singleton pattern to prevent re-initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);
export const googleProvider = new GoogleAuthProvider();