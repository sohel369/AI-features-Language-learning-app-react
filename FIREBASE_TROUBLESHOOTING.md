# Firebase Registration Troubleshooting Guide

## 🚨 "Registration Failed" Error - Common Solutions

### 1. **Check Firebase Console Configuration**

#### Enable Authentication:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `reactlanguageapp`
3. Go to **Authentication** → **Sign-in method**
4. Enable **Email/Password** provider
5. Click **Save**

#### Enable Firestore Database:
1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location (choose closest to your users)

### 2. **Check Firestore Security Rules**

Go to **Firestore Database** → **Rules** and set:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read quiz scores
    match /quizScores/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Allow test writes for diagnostics
    match /test/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 3. **Test Firebase Connection**

1. Navigate to `http://localhost:3000/diagnostic` in your browser
2. Click **"Run Firebase Diagnostics"**
3. Check the results to identify the issue

### 4. **Common Error Codes & Solutions**

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `auth/email-already-in-use` | Email already registered | Use a different email or try logging in |
| `auth/weak-password` | Password too weak | Use at least 6 characters |
| `auth/invalid-email` | Invalid email format | Check email format |
| `auth/network-request-failed` | Network error | Check internet connection |
| `auth/too-many-requests` | Rate limited | Wait a few minutes |
| `permission-denied` | Firestore rules blocking | Update security rules |
| `unavailable` | Firebase service down | Try again later |

### 5. **Check Browser Console**

1. Open browser Developer Tools (F12)
2. Go to **Console** tab
3. Try to register an account
4. Look for error messages
5. Check **Network** tab for failed requests

### 6. **Verify Firebase Project Settings**

1. Go to **Project Settings** in Firebase Console
2. Check **General** tab
3. Verify the project ID matches: `reactlanguageapp`
4. Check that the API key is correct in `src/firebase/config.js`

### 7. **Test with Firebase Emulator (Development)**

If you want to test locally without affecting production:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize emulators
firebase init emulators

# Start emulators
firebase emulators:start
```

Then update `src/firebase/config.js` to use emulators:

```javascript
import { connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';

// Add after initialization
if (process.env.NODE_ENV === 'development') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
}
```

### 8. **Quick Fixes to Try**

1. **Clear browser cache and cookies**
2. **Try in incognito/private mode**
3. **Check if ad blockers are interfering**
4. **Try a different browser**
5. **Restart the development server**

### 9. **Check Network Issues**

- Ensure you have internet connection
- Check if corporate firewall is blocking Firebase
- Try from a different network

### 10. **Debug Steps**

1. **Run the diagnostic tool**: Go to `/diagnostic`
2. **Check console errors**: Look for specific error messages
3. **Verify Firebase setup**: Ensure all services are enabled
4. **Test with a simple email**: Try `test@example.com`
5. **Check password requirements**: Use at least 6 characters

## 🔧 Manual Testing

### Test Registration Manually:

```javascript
// Open browser console and run:
import { auth } from './src/firebase/config.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';

createUserWithEmailAndPassword(auth, 'test@example.com', 'password123')
  .then(user => console.log('Success:', user))
  .catch(error => console.error('Error:', error));
```

### Test Firestore Write:

```javascript
import { db } from './src/firebase/config.js';
import { doc, setDoc } from 'firebase/firestore';

setDoc(doc(db, 'test', 'manual-test'), { message: 'Hello Firebase!' })
  .then(() => console.log('Firestore write successful'))
  .catch(error => console.error('Firestore error:', error));
```

## 📞 Still Having Issues?

If the problem persists:

1. **Check Firebase Console logs**: Go to **Functions** → **Logs**
2. **Verify billing**: Some features require a paid plan
3. **Contact Firebase support**: For project-specific issues
4. **Check Firebase status**: https://status.firebase.google.com

## 🎯 Expected Behavior

When working correctly:
1. User enters email/password
2. Firebase creates user account
3. User document is created in Firestore
4. User is redirected to home page
5. Profile shows real user data

The diagnostic tool at `/diagnostic` will help identify exactly where the process is failing.
