// Firebase-based Auth Service
import { auth } from '../firebase/config';
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut as firebaseSignOut,
	onAuthStateChanged as firebaseOnAuthStateChanged,
	updateProfile,
	setPersistence,
	browserLocalPersistence
} from 'firebase/auth';
import { db } from '../firebase/config';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

class AuthService {
	constructor() {
		this._listeners = new Set();
		// Persist session across reloads
		setPersistence(auth, browserLocalPersistence).catch(() => {});
		// Bridge Firebase auth state to app listeners
		firebaseOnAuthStateChanged(auth, async (firebaseUser) => {
			if (!firebaseUser) {
				this._emit(null, null);
				return;
			}
			const user = { uid: firebaseUser.uid, email: firebaseUser.email, displayName: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : '') };
			const userDocRef = doc(db, 'users', firebaseUser.uid);
			const snap = await getDoc(userDocRef);
			let userData;
			if (snap.exists()) {
				userData = snap.data();
			} else {
				userData = {
					uid: user.uid,
					email: user.email,
					displayName: user.displayName,
					baseLanguage: 'english',
					learningLanguages: [],
					settings: { darkMode: false, notifications: true, sound: true, fontSize: 'medium' },
					xp: 0,
					level: 1,
					streak: 0,
					badges: [],
					lessonProgress: {}
				};
				await setDoc(userDocRef, userData);
			}
			this._emit(user, userData);
		});
	}

	_mapAuthError(error) {
		const code = error?.code || '';
		switch (code) {
			case 'auth/invalid-credential':
			case 'auth/wrong-password':
			case 'auth/user-not-found':
				return 'Invalid email or password';
			case 'auth/too-many-requests':
				return 'Too many attempts. Please try again later';
			case 'auth/network-request-failed':
				return 'Network error. Check your connection';
			case 'auth/email-already-in-use':
				return 'Email already registered';
			case 'auth/weak-password':
				return 'Password must be at least 6 characters';
			case 'auth/operation-not-allowed':
				return 'Email/password sign-in is disabled in Firebase Console';
			default:
				return error?.message || 'Authentication error';
		}
	}

	_emit(user, userData) {
		for (const cb of this._listeners) {
			try { cb(user, userData); } catch {}
		}
	}

	getCurrentUser() {
		const u = auth.currentUser;
		return u ? { uid: u.uid, email: u.email, displayName: u.displayName } : null;
	}

	onAuthStateChanged(callback) {
		this._listeners.add(callback);
		// Immediately invoke with current state including userData to avoid nulls
		const u = auth.currentUser;
		if (!u) {
			callback(null, null);
		} else {
			(async () => {
				try {
					const user = { uid: u.uid, email: u.email, displayName: u.displayName };
					const snap = await getDoc(doc(db, 'users', u.uid));
					const data = snap.exists() ? snap.data() : null;
					callback(user, data);
				} catch {
					callback({ uid: u.uid, email: u.email, displayName: u.displayName }, null);
				}
			})();
		}
		return () => this._listeners.delete(callback);
	}

	async register(email, password, displayName, learningLanguages = []) {
		try {
			const cred = await createUserWithEmailAndPassword(auth, email, password);
			if (displayName) {
				await updateProfile(cred.user, { displayName });
			}
			const userDocRef = doc(db, 'users', cred.user.uid);
			const userData = {
				uid: cred.user.uid,
				email: cred.user.email,
				displayName: displayName || (email ? email.split('@')[0] : ''),
				baseLanguage: 'english',
				learningLanguages: Array.isArray(learningLanguages) ? learningLanguages : [],
				settings: { darkMode: false, notifications: true, sound: true, fontSize: 'medium' },
				xp: 0,
				level: 1,
				streak: 0,
				badges: [],
				lessonProgress: {}
			};
			await setDoc(userDocRef, userData);
			return { success: true, user: { uid: cred.user.uid, email: cred.user.email, displayName: userData.displayName } };
		} catch (error) {
			return { success: false, error: this._mapAuthError(error) };
		}
	}

	async signIn(email, password) {
		try {
			const cred = await signInWithEmailAndPassword(auth, email, password);
			return { success: true, user: { uid: cred.user.uid, email: cred.user.email, displayName: cred.user.displayName } };
		} catch (error) {
			return { success: false, error: this._mapAuthError(error) };
		}
	}

	async signOut() {
		await firebaseSignOut(auth);
		return { success: true };
	}

	async updateLearningLanguages(langs) {
		const u = auth.currentUser;
		if (!u) throw new Error('Not authenticated');
		const userDocRef = doc(db, 'users', u.uid);
		await updateDoc(userDocRef, { learningLanguages: Array.isArray(langs) ? langs : [] });
		const snap = await getDoc(userDocRef);
		this._emit(this.getCurrentUser(), snap.data());
		return { success: true };
	}

	async updateBaseLanguage(lang) {
		const u = auth.currentUser;
		if (!u) throw new Error('Not authenticated');
		const userDocRef = doc(db, 'users', u.uid);
		await updateDoc(userDocRef, { baseLanguage: lang });
		const snap = await getDoc(userDocRef);
		this._emit(this.getCurrentUser(), snap.data());
		return { success: true };
	}

	async updateSettings(partialSettings) {
		const u = auth.currentUser;
		if (!u) throw new Error('Not authenticated');
		const userDocRef = doc(db, 'users', u.uid);
		// Merge settings safely
		await setDoc(userDocRef, { settings: partialSettings }, { merge: true });
		const snap = await getDoc(userDocRef);
		this._emit(this.getCurrentUser(), snap.data());
		return { success: true };
	}
}

const authService = new AuthService();
export default authService;
