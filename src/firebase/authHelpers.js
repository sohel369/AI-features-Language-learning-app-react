// Simple Firebase Authentication Helpers
import { auth, db } from "./config";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";

// Register a new user
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User registered:", userCredential.user);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("Registration error:", error.message);
    return { success: false, error: error.message };
  }
};

// Login an existing user
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in:", userCredential.user);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("Login error:", error.message);
    return { success: false, error: error.message };
  }
};

// Sign out current user
export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log("User signed out successfully");
    return { success: true };
  } catch (error) {
    console.error("Sign out error:", error.message);
    return { success: false, error: error.message };
  }
};
