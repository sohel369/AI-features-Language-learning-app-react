// Firebase Authentication Service
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from './firebase.js';

class FirebaseAuthService {
  constructor() {
    this.auth = auth;
  }

  // Register a new user with email and password
  async register(email, password) {
    try {
      console.log('Attempting to register user with email:', email);
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      console.log('Registration successful for user:', userCredential.user.email);
      return {
        success: true,
        user: userCredential.user,
        message: 'Registration successful!'
      };
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Full error:', error);
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  // Sign in with email and password
  async signIn(email, password) {
    try {
      console.log('Attempting to sign in user with email:', email);
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('Sign in successful for user:', userCredential.user.email);
      return {
        success: true,
        user: userCredential.user,
        message: 'Sign in successful!'
      };
    } catch (error) {
      console.error('Sign in error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Full error:', error);
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  // Sign out the current user
  async signOut() {
    try {
      await signOut(this.auth);
      return {
        success: true,
        message: 'Sign out successful!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get the current user
  getCurrentUser() {
    return this.auth.currentUser;
  }

  // Listen to authentication state changes
  onAuthStateChanged(callback) {
    return onAuthStateChanged(this.auth, callback);
  }

  // Get user-friendly error messages
  getErrorMessage(errorCode) {
    const errorMessages = {
      'auth/email-already-in-use': 'This email is already registered.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/operation-not-allowed': 'Email/password accounts are not enabled.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your connection.'
    };
    
    return errorMessages[errorCode] || 'An error occurred. Please try again.';
  }
}

// Create and export a singleton instance
const firebaseAuthService = new FirebaseAuthService();
export default firebaseAuthService;
