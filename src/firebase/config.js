// Firebase configuration
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCycwpCYKj3KNvqezPGWLs9VUbtroUacDw",
  authDomain: "reactlanguageapp.firebaseapp.com",
  projectId: "reactlanguageapp",
  storageBucket: "reactlanguageapp.appspot.com",
  messagingSenderId: "49661302046",
  appId: "1:49661302046:web:b50c4f1aca2baafa23e50f"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
