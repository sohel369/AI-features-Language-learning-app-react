# 🔥 Complete Firebase Setup Guide - FREE Spark Plan

## 🚨 **CRITICAL: Enable Authentication in Firebase Console**

The `auth/configuration-not-found` error means **Firebase Authentication is not enabled** in your Firebase project. Follow these steps to fix it:

### **Step 1: Access Firebase Console**
1. Go to: https://console.firebase.google.com
2. Sign in with your Google account
3. Select your project: **`reactlanguageapp`**

### **Step 2: Enable Authentication**
1. In the left sidebar, click **"Authentication"**
2. If you don't see "Authentication":
   - Click **"Get started"** or **"Add product"**
   - Select **"Authentication"**
   - Click **"Get started"**

### **Step 3: Enable Email/Password Sign-in**
1. Click on the **"Sign-in method"** tab
2. Find **"Email/Password"** in the list
3. Click on **"Email/Password"**
4. Toggle **"Enable"** to **ON**
5. Click **"Save"**

### **Step 4: Enable Firestore Database**
1. In the left sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a location (choose closest to your users)
5. Click **"Done"**

### **Step 5: Set Firestore Security Rules**
1. Go to **Firestore Database** → **Rules**
2. Replace the rules with:

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

3. Click **"Publish"**

## 🧪 **Test Your Setup**

### **Option 1: Use Diagnostic Tool**
1. Start your app: `npm start`
2. Go to: `http://localhost:3000/diagnostic`
3. Click **"Run Firebase Diagnostics"**
4. Check if Authentication is now working

### **Option 2: Test Registration**
1. Go to your main app
2. Try to register a new account
3. The error should be resolved

## 📋 **Quick Checklist**

- ✅ Firebase project exists and is accessible
- ✅ Authentication is enabled in Firebase Console
- ✅ Email/Password sign-in method is enabled
- ✅ Firestore Database is created
- ✅ Firestore security rules are set
- ✅ Project ID matches in config file: `reactlanguageapp`
- ✅ API key is correct

## 🔄 **After Enabling Authentication**

1. **Wait 1-2 minutes** for changes to propagate
2. **Refresh your browser**
3. **Try registration again**
4. **Check browser console** for any remaining errors

## 🚨 **If Still Not Working**

### **Check Project Settings**
1. Go to **Project Settings** (gear icon)
2. Check the **Project ID** matches: `reactlanguageapp`
3. Verify the API key matches your config file

### **Check Authorized Domains**
1. Go to **Authentication** → **Settings** → **Authorized domains**
2. Make sure `localhost` is listed
3. Add your domain if deploying

### **Alternative: Create New Firebase Project**
If the project is corrupted:
1. Create a new Firebase project
2. Enable Authentication and Firestore
3. Update `src/firebase/config.js` with new credentials

## 💰 **Cost Information**

- **Firebase Spark Plan**: FREE
- **Authentication**: FREE (up to 10,000 users/month)
- **Firestore**: FREE (up to 1GB storage, 50,000 reads/day)
- **No credit card required**

## 🎯 **What You Get**

- ✅ User registration and login
- ✅ User profile management
- ✅ Firestore database for user data
- ✅ Real-time authentication state
- ✅ Secure user sessions
- ✅ Error handling and validation

The diagnostic tool at `/diagnostic` will confirm if everything is properly configured.
