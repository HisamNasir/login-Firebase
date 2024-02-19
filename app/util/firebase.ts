import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCbhQhFNUBSccgcthZX8wUD0MNwzeKW02Y",
  authDomain: "revenue-fae76.firebaseapp.com",
  projectId: "revenue-fae76",
  storageBucket: "revenue-fae76.appspot.com",
  messagingSenderId: "381610979071",
  appId: "1:381610979071:web:6d4112e83ecd8d9e6e66ca",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const firestore = getFirestore(app);
const auth = getAuth(app);

export { app, auth, firestore };
