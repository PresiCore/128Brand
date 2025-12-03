import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDaZpr6FyiBoy5jAuoO8J341yo6GGztdsU",
  authDomain: "brand-176eb.firebaseapp.com",
  projectId: "brand-176eb",
  storageBucket: "brand-176eb.firebasestorage.app",
  messagingSenderId: "101111014400",
  appId: "1:101111014400:web:055b6ea2384fe306a5a4e5",
  measurementId: "G-YD20MNX3CC"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();