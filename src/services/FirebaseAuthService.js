import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile as firebaseUpdateProfile } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, onSnapshot, collection, query, orderBy, limit, getDocs } from "firebase/firestore";

const firebaseAuthService = {
  register: async (email, password, displayName = '') => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      if (displayName) {
        await firebaseUpdateProfile(userCredential.user, { displayName });
      }
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: userCredential.user.email,
        displayName: displayName || userCredential.user.displayName || '',
        createdAt: new Date(),
        settings: {
          language: 'english',
          fontSize: 'medium',
          sound: true,
          notifications: true,
          theme: 'system'
        },
        learningLanguages: ['arabic'],
        baseLanguage: 'english',
        xp: 0,
        level: 1,
        streak: 0,
        wordsLearned: 0
      });
      
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
  },

  // Get user data from Firestore
  getUserData: async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return { success: true, data: userDoc.data() };
      } else {
        return { success: false, error: 'User document not found' };
      }
    } catch (error) {
      console.error("Get user data error:", error);
      return { success: false, error: error.message };
    }
  },

  // Update user profile
  updateProfile: async (uid, profileData) => {
    try {
      await updateDoc(doc(db, 'users', uid), {
        displayName: profileData.displayName,
        email: profileData.email,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error("Update profile error:", error);
      return { success: false, error: error.message };
    }
  },

  // Update user settings
  updateSettings: async (uid, settings) => {
    try {
      await updateDoc(doc(db, 'users', uid), {
        settings: settings,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error("Update settings error:", error);
      return { success: false, error: error.message };
    }
  },

  // Update learning languages
  updateLearningLanguages: async (uid, languages) => {
    try {
      await updateDoc(doc(db, 'users', uid), {
        learningLanguages: languages,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error("Update learning languages error:", error);
      return { success: false, error: error.message };
    }
  },

  // Update base language
  updateBaseLanguage: async (uid, language) => {
    try {
      await updateDoc(doc(db, 'users', uid), {
        baseLanguage: language,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error("Update base language error:", error);
      return { success: false, error: error.message };
    }
  },

  // Listen to user data changes
  onUserDataChange: (uid, callback) => {
    return onSnapshot(doc(db, 'users', uid), (doc) => {
      if (doc.exists()) {
        callback(doc.data());
      } else {
        callback(null);
      }
    });
  },

  // Get leaderboard data
  getLeaderboard: async () => {
    try {
      const leaderboardQuery = query(
        collection(db, 'users'),
        orderBy('xp', 'desc'),
        limit(10)
      );
      
      const snapshot = await getDocs(leaderboardQuery);
      const leaderboard = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return { success: true, data: leaderboard };
    } catch (error) {
      console.error("Get leaderboard error:", error);
      return { success: false, error: error.message };
    }
  },

  // Listen to leaderboard changes
  onLeaderboardChange: (callback) => {
    const leaderboardQuery = query(
      collection(db, 'users'),
      orderBy('xp', 'desc'),
      limit(10)
    );
    
    return onSnapshot(leaderboardQuery, (snapshot) => {
      const leaderboard = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(leaderboard);
    });
  }
};

export default firebaseAuthService;
