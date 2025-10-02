import { auth } from '../firebase/config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

const firebaseAuthService = {
  register: async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error("Registration error:", error);
      console.error("Error code:", error.code);
      
      let errorMessage = error.message;
      
      // Handle specific Firebase Auth errors
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered. Please try signing in instead.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters long.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/Password authentication is not enabled. Please enable it in Firebase Console.';
          break;
        case 'auth/configuration-not-found':
          errorMessage = 'Firebase Authentication is not enabled. Please enable it in Firebase Console.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many requests. Please try again later.';
          break;
        default:
          errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage };
    }
  },
  signIn: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error("Sign in error:", error);
      console.error("Error code:", error.code);
      
      let errorMessage = error.message;
      
      // Handle specific Firebase Auth errors
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email. Please register first.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/Password authentication is not enabled. Please enable it in Firebase Console.';
          break;
        case 'auth/configuration-not-found':
          errorMessage = 'Firebase Authentication is not enabled. Please enable it in Firebase Console.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection.';
          break;
        default:
          errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage };
    }
  },
  signOut: async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error("Sign out error:", error);
      return { success: false, error: error.message };
    }
  },
  
  // Listen to authentication state changes
  onAuthStateChanged: (callback) => {
    return onAuthStateChanged(auth, callback);
  }
};

export default firebaseAuthService;
