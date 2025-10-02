# Firebase Profile Integration Setup Guide

This guide will help you set up the complete Firebase integration for the user profile system.

## 1. Firebase Configuration

### Firestore Security Rules
Copy the contents of `firestore.rules` to your Firebase Console:

1. Go to Firebase Console → Firestore Database → Rules
2. Replace the existing rules with the content from `firestore.rules`
3. Click "Publish"

### Firestore Indexes
The following indexes are recommended for optimal performance:

1. **Collection**: `users`
   - **Fields**: `xp` (Descending)
   - **Fields**: `createdAt` (Ascending)
   - **Fields**: `updatedAt` (Ascending)

## 2. User Data Structure

The user document structure in Firestore:

```javascript
{
  email: "user@example.com",
  displayName: "User Name",
  createdAt: timestamp,
  updatedAt: timestamp,
  settings: {
    language: "english", // "english" | "arabic"
    fontSize: "medium",   // "small" | "medium" | "large"
    sound: true,         // boolean
    notifications: true, // boolean
    theme: "system"       // "light" | "dark" | "system"
  },
  learningLanguages: ["arabic", "spanish"], // array of language codes
  baseLanguage: "english", // "english" | "arabic"
  xp: 0,                  // number
  level: 1,               // number
  streak: 0,              // number
  wordsLearned: 0,        // number
  badges: []              // array of strings
}
```

## 3. Features Implemented

### ✅ User Authentication
- Firebase Authentication integration
- Email/password registration and login
- Automatic user document creation on registration

### ✅ Profile Management
- **Account Info**: Display name and email editing
- **Preferences**: Language settings, font size, sound, notifications
- **Theme Settings**: Light, dark, and system theme options

### ✅ Real-time Updates
- Firestore real-time listeners
- Automatic UI updates when data changes
- Optimistic updates for better UX

### ✅ Global Settings
- Settings apply across the entire app
- Theme changes affect the whole interface
- Font size changes are global
- Language preferences affect all components

### ✅ Live Leaderboard
- Real-time leaderboard updates
- XP-based ranking system
- Live data synchronization

### ✅ Security
- Firestore security rules
- User can only access their own data
- Data validation on both client and server
- Form validation for user inputs

## 4. Usage

### Accessing User Data
```javascript
import { useContext } from 'react';
import { UserContext } from './context/userContext';

const { user, userData, isAuthenticated, isLoading, leaderboard } = useContext(UserContext);
```

### Updating Settings
```javascript
const { updateSettings } = useContext(UserContext);

// Update theme
await updateSettings({ theme: 'dark' });

// Update multiple settings
await updateSettings({ 
  fontSize: 'large', 
  sound: false 
});
```

### Updating Profile
```javascript
const { updateProfile } = useContext(UserContext);

await updateProfile({
  displayName: 'New Name',
  email: 'new@email.com'
});
```

## 5. Testing

### Test User Registration
1. Navigate to the app
2. Click "Sign Up"
3. Enter email and password
4. Check Firestore for new user document

### Test Settings Updates
1. Go to Profile → Settings
2. Change font size, language, or other settings
3. Verify changes are saved to Firestore
4. Check that settings apply globally

### Test Theme Changes
1. Go to Profile → Settings
2. Switch between Light, Dark, and System themes
3. Verify the entire app theme changes

### Test Live Leaderboard
1. Go to Profile → Leaderboard
2. Verify real-time updates
3. Check XP-based ranking

## 6. Troubleshooting

### Common Issues

1. **Firebase not initialized**
   - Check `src/firebase/config.js` has correct config
   - Ensure Firebase project is properly set up

2. **Permission denied errors**
   - Verify Firestore rules are deployed
   - Check user is authenticated

3. **Settings not applying globally**
   - Ensure UserContext is wrapping the entire app
   - Check that settings are being applied in `applyGlobalSettings`

4. **Real-time updates not working**
   - Verify Firestore listeners are properly set up
   - Check for JavaScript errors in console

### Debug Mode
Enable debug logging by adding to your browser console:
```javascript
localStorage.setItem('debug', 'firebase:*');
```

## 7. Performance Optimization

### Firestore Optimization
- Use specific field updates instead of full document updates
- Implement proper error handling for offline scenarios
- Use Firestore offline persistence for better UX

### React Optimization
- Memoize expensive components
- Use React.memo for settings components
- Implement proper loading states

## 8. Security Best Practices

1. **Never expose API keys in client code**
2. **Use Firestore security rules for data validation**
3. **Implement proper error handling**
4. **Validate all user inputs**
5. **Use HTTPS in production**

## 9. Deployment Checklist

- [ ] Firebase project configured
- [ ] Firestore rules deployed
- [ ] Authentication enabled
- [ ] User registration working
- [ ] Profile updates working
- [ ] Settings applying globally
- [ ] Theme changes working
- [ ] Real-time updates working
- [ ] Live leaderboard working
- [ ] Security rules tested
- [ ] Error handling implemented
