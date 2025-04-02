// firebase.js (Firebase Configuration)
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyArCjGBKPp8pO_s32OHAajj25krg0Hq6bU",
  authDomain: "campus-cartel-28b9c.firebaseapp.com",
  projectId: "campus-cartel-28b9c",
  storageBucket: "campus-cartel-28b9c.firebasestorage.app",
  messagingSenderId: "556108901205",
  appId: "1:556108901205:web:8b08e84302820cfbe31ddc",
  measurementId: "G-63MERHVJPV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export {
  auth,
  db,
  createUserWithEmailAndPassword,
  setDoc,
  doc,
  storage,
  getAuth,
};
