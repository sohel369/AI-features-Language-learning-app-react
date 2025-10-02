// Firebase Configuration for Demo App
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration for demo project
const firebaseConfig = {
  apiKey: "AIzaSyCycwpCYKj3KNvqezPGWLs9VUbtroUacDw",
  authDomain: "reactlanguageapp.firebaseapp.com",
  projectId: "reactlanguageapp",
  storageBucket: "reactlanguageapp.appspot.com",
  messagingSenderId: "49661302046",
  appId: "1:49661302046:web:b50c4f1aca2baafa23e50f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
