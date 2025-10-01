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

class DemoAuthService {
	constructor() {
		this._listeners = new Set();
		this._initStorage();
		// Emit initial state
		this._emit(this.getCurrentUser(), this._getCurrentUserData());
	}

	_initStorage() {
		if (!localStorage.getItem('demo_users')) {
			localStorage.setItem('demo_users', JSON.stringify({}));
		}
		if (!localStorage.getItem('demo_current_user')) {
			localStorage.setItem('demo_current_user', '');
		}
	}

	_readUsers() {
		try { return JSON.parse(localStorage.getItem('demo_users') || '{}'); } catch { return {}; }
	}

	_writeUsers(users) {
		localStorage.setItem('demo_users', JSON.stringify(users));
	}

	_getCurrentUserId() {
		return localStorage.getItem('demo_current_user') || '';
	}

	_setCurrentUserId(uid) {
		localStorage.setItem('demo_current_user', uid || '');
	}

	_getCurrentUserData() {
		const uid = this._getCurrentUserId();
		if (!uid) return null;
		const users = this._readUsers();
		return users[uid] || null;
	}

	_emit(user, userData) {
		for (const cb of this._listeners) {
			try { cb(user, userData); } catch {}
		}
	}

	getCurrentUser() {
		const userData = this._getCurrentUserData();
		if (!userData) return null;
		return { uid: userData.uid, email: userData.email, displayName: userData.displayName };
	}

	onAuthStateChanged(callback) {
		this._listeners.add(callback);
		callback(this.getCurrentUser(), this._getCurrentUserData());
		return () => this._listeners.delete(callback);
	}

	_registerUserObject(email, displayName) {
		const uid = `demo_${Math.random().toString(36).slice(2, 10)}`;
		return {
			uid,
			email,
			displayName: displayName || (email ? email.split('@')[0] : 'User'),
			baseLanguage: 'english',
			learningLanguages: [],
			settings: { darkMode: false, notifications: true, sound: true, fontSize: 'medium' },
			xp: 0,
			level: 1,
			streak: 0,
			badges: [],
			lessonProgress: {},
			// store hashed-ish password for demo only (NOT secure)
			_password: btoa(email + '|' + (Date.now()))
		};
	}

	async register(email, password, displayName) {
		if (!email || !password) {
			return { success: false, error: 'Email and password are required' };
		}
		const users = this._readUsers();
		const exists = Object.values(users).find(u => u.email === email);
		if (exists) return { success: false, error: 'Email already registered' };
		const user = this._registerUserObject(email, displayName);
		// simple demo password storage
		user._password = btoa(password);
		users[user.uid] = user;
		this._writeUsers(users);
		this._setCurrentUserId(user.uid);
		this._emit(this.getCurrentUser(), user);
		return { success: true, user: { uid: user.uid, email: user.email, displayName: user.displayName } };
	}

	async signIn(email, password) {
		const users = this._readUsers();
		const found = Object.values(users).find(u => u.email === email);
		if (!found) return { success: false, error: 'Invalid email or password' };
		if (found._password !== btoa(password)) return { success: false, error: 'Invalid email or password' };
		this._setCurrentUserId(found.uid);
		this._emit(this.getCurrentUser(), found);
		return { success: true, user: { uid: found.uid, email: found.email, displayName: found.displayName } };
	}

	async signOut() {
		this._setCurrentUserId('');
		this._emit(null, null);
		return { success: true };
	}

	async updateSettings(partialSettings) {
		const uid = this._getCurrentUserId();
		if (!uid) throw new Error('Not authenticated');
		const users = this._readUsers();
		const current = users[uid] || {};
		current.settings = { ...(current.settings || {}), ...(partialSettings || {}) };
		users[uid] = current;
		this._writeUsers(users);
		this._emit(this.getCurrentUser(), current);
		return { success: true };
	}

	async updateLearningLanguages(langs) {
		const uid = this._getCurrentUserId();
		if (!uid) throw new Error('Not authenticated');
		const users = this._readUsers();
		const current = users[uid] || {};
		current.learningLanguages = Array.isArray(langs) ? langs : [];
		users[uid] = current;
		this._writeUsers(users);
		this._emit(this.getCurrentUser(), current);
		return { success: true };
	}

	async updateBaseLanguage(lang) {
		const uid = this._getCurrentUserId();
		if (!uid) throw new Error('Not authenticated');
		const users = this._readUsers();
		const current = users[uid] || {};
		current.baseLanguage = lang;
		users[uid] = current;
		this._writeUsers(users);
		this._emit(this.getCurrentUser(), current);
		return { success: true };
	}

	async updateProfile(profileData) {
		const uid = this._getCurrentUserId();
		if (!uid) throw new Error('Not authenticated');
		const users = this._readUsers();
		const current = users[uid] || {};
		// Update profile fields
		Object.keys(profileData).forEach(key => {
			if (profileData[key] !== undefined) {
				current[key] = profileData[key];
			}
		});
		users[uid] = current;
		this._writeUsers(users);
		this._emit(this.getCurrentUser(), current);
		return { success: true };
	}

	// Settings management methods
	async updateUserSettings(settings) {
		const uid = this._getCurrentUserId();
		if (!uid) throw new Error('No user logged in');

		const users = this._readUsers();
		if (users[uid]) {
			users[uid].settings = {
				...users[uid].settings,
				...settings,
				lastUpdated: new Date().toISOString()
			};
			this._writeUsers(users);
			this._emit(this.getCurrentUser(), this._getCurrentUserData());
		}
	}

	async getUserSettings() {
		const uid = this._getCurrentUserId();
		if (!uid) return null;

		const users = this._readUsers();
		return users[uid]?.settings || {
			theme: 'system',
			fontSize: 'medium',
			notifications: true,
			soundEffects: true
		};
	}

	// Initialize user settings if they don't exist
	async initializeUserSettings() {
		const uid = this._getCurrentUserId();
		if (!uid) return;

		const users = this._readUsers();
		if (users[uid] && !users[uid].settings) {
			users[uid].settings = {
				theme: 'system',
				fontSize: 'medium',
				notifications: true,
				soundEffects: true,
				lastUpdated: new Date().toISOString()
			};
			this._writeUsers(users);
		}
	}
}

const authService = new DemoAuthService();
export default authService;
