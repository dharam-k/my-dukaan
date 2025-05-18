

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyBYOmEdfh5pR7kBvgIRL9Ee9EFeA75V1m4",
  authDomain: "my-shop-5c682.firebaseapp.com",
  projectId: "my-shop-5c682",
  storageBucket: "my-shop-5c682.firebasestorage.app",
  messagingSenderId: "790756821247",
  appId: "1:790756821247:web:b8085808c0dc906d3124ca",
  measurementId: "G-LEP6ZWTV8L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const functions = getFunctions(app);

export const auth = getAuth(app);
export const db = getFirestore(app);