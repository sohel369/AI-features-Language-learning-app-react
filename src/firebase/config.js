// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPpye3BGwgApCTfCenOX0RtTtVBJiXg3M",
  authDomain: "myreactmvp.firebaseapp.com",
  projectId: "myreactmvp",
  storageBucket: "myreactmvp.appspot.com",
  messagingSenderId: "1043282254579",
  appId: "1:1043282254579:web:xxxxxxxxxxxxxxxxxx" // Console থেকে copy করুন
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth & db
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
