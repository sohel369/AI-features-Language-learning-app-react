# 🔐 Local Authentication System

A complete authentication system that works **without Firebase** or any paid APIs. Uses a local Node.js backend with JSON file storage.

## 🚀 Quick Start

### Option 1: Windows (Batch Script)
```bash
start-local-auth.bat
```

### Option 2: Manual Setup
```bash
cd server
npm install
node auth.js
```

### Option 3: Unix/Linux/Mac (Shell Script)
```bash
./start-local-auth.sh
```

## 📁 Files Created

### Backend Files
- `server/auth.js` - Main authentication server
- `server/users.json` - User database (auto-created)
- `server/package.json` - Dependencies (already exists)

### Frontend Files
- `src/services/LocalAuthService.js` - Authentication service
- `src/components/LocalAuthForm.js` - React authentication component
- `local-auth-test.html` - Standalone HTML test file

## 🧪 Testing

### 1. HTML Test (Easiest)
1. Start the server: `start-local-auth.bat`
2. Open `local-auth-test.html` in your browser
3. Test registration and sign-in

### 2. React Component
```jsx
import LocalAuthForm from './components/LocalAuthForm';

function App() {
  return <LocalAuthForm />;
}
```

## 🔧 Features

- ✅ **User Registration** with email/password
- ✅ **User Sign In** with validation
- ✅ **User Sign Out** functionality
- ✅ **JWT Token Authentication**
- ✅ **Password Hashing** with bcrypt
- ✅ **Local JSON Database**
- ✅ **No External Dependencies**
- ✅ **No Paid APIs Required**

## 📊 API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Sign in user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Sign out user
- `GET /api/health` - Server health check

## 🔒 Security Features

- **Password Hashing**: Uses bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: Email and password validation
- **Error Handling**: Comprehensive error messages

## 🛠️ Configuration

### Server Port
```javascript
const PORT = process.env.PORT || 3001;
```

### JWT Secret
```javascript
const JWT_SECRET = 'your-super-secret-jwt-key-change-in-production';
```

## 📝 Usage Examples

### Register User
```javascript
const result = await localAuthService.register('test@example.com', 'password123');
if (result.success) {
  console.log('User registered:', result.user);
}
```

### Sign In User
```javascript
const result = await localAuthService.signIn('test@example.com', 'password123');
if (result.success) {
  console.log('User signed in:', result.user);
}
```

### Check Authentication
```javascript
if (localAuthService.isAuthenticated()) {
  const user = localAuthService.getCurrentUser();
  console.log('Current user:', user);
}
```

## 🐛 Troubleshooting

### Server Won't Start
- Make sure port 3001 is available
- Check if Node.js is installed
- Run `npm install` in the server directory

### Authentication Fails
- Check browser console for errors
- Verify server is running on http://localhost:3001
- Check network tab for API calls

### Database Issues
- The `users.json` file is created automatically
- Check file permissions in the server directory
- Verify JSON file is not corrupted

## 🔄 Migration from Firebase

To replace Firebase authentication:

1. **Replace FirebaseAuthService** with LocalAuthService
2. **Update imports** in your components
3. **Start the local server** before testing
4. **Update API calls** to use local endpoints

## 📈 Production Considerations

For production use, consider:
- Using a real database (PostgreSQL, MongoDB)
- Environment variables for secrets
- HTTPS for secure communication
- Rate limiting for API endpoints
- Input sanitization and validation

## 🎯 Benefits

- ✅ **No Firebase dependency**
- ✅ **No paid API keys required**
- ✅ **Works offline**
- ✅ **Easy to customize**
- ✅ **Simple deployment**
- ✅ **Full control over data**

---

**Ready to test?** Run `start-local-auth.bat` and open `local-auth-test.html`! 🚀



