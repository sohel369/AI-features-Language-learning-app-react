# Complete Integration Example

This example shows how to integrate the Profile App Settings with a full-stack backend.

## 🎯 What You Get

- ✅ **Dark Mode Toggle** (Light/Dark/System)
- ✅ **Notifications** (Enable/Disable with browser API)
- ✅ **Sound Effects** (Enable/Disable with Web Audio API)
- ✅ **Font Size** (Small/Medium/Large)
- ✅ **Backend Storage** (MongoDB)
- ✅ **Auto-save** functionality
- ✅ **Live Preview** of changes

## 🚀 Quick Start

### 1. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
copy env.example .env

# Start MongoDB (if local)
mongod

# Start the server
npm start
```

### 2. Frontend Setup

```bash
# In main project directory
npm start
```

### 3. Test the Integration

1. Go to `http://localhost:3000/demo-auth`
2. Create a demo user
3. Go to `http://localhost:3000/settings`
4. Test all settings - they save to MongoDB!

## 📁 File Structure

```
src/
├── components/
│   ├── AppSettings.js      # Main settings component
│   ├── DemoAuth.js         # Demo authentication
│   └── ProfileSettings.js  # Wrapper component
├── services/
│   └── SettingsService.js  # API communication
└── context/
    └── ThemeContext.js     # Theme management

server/
├── server.js              # Express server
├── package.json           # Dependencies
└── .env                   # Environment variables
```

## 🔧 Key Components

### AppSettings.js
- **Full-featured settings page**
- **Live preview** of changes
- **Auto-save** to backend
- **Test functions** for notifications and sound

### SettingsService.js
- **API communication** with backend
- **Authentication** handling
- **Error handling** and fallbacks

### server.js
- **Express server** with MongoDB
- **JWT-like authentication**
- **Settings CRUD** operations
- **CORS** configuration

## 🎨 UI Features

### Theme Selection
```jsx
// Three options with icons
const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor }
];
```

### Font Size Options
```jsx
// Visual font size selector
const FONT_SIZE_OPTIONS = [
  { value: 'small', label: 'Small', size: '14px' },
  { value: 'medium', label: 'Medium', size: '16px' },
  { value: 'large', label: 'Large', size: '18px' }
];
```

### Live Preview
```jsx
// Real-time preview of settings
<div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
  <h4 className="font-medium mb-2">Sample Content</h4>
  <p className="text-slate-600 dark:text-slate-400">
    This is how your content will look with current settings.
  </p>
</div>
```

## 🔄 Backend Integration

### Settings API
```javascript
// Get settings
GET /api/settings/get
Headers: Authorization: Bearer <token>

// Update settings
POST /api/settings/update
Headers: Authorization: Bearer <token>
Body: { theme, fontSize, notifications, soundEffects }
```

### Database Schema
```javascript
{
  email: String,
  displayName: String,
  settings: {
    theme: 'light' | 'dark' | 'system',
    fontSize: 'small' | 'medium' | 'large',
    notifications: Boolean,
    soundEffects: Boolean,
    lastUpdated: Date
  }
}
```

## 🎵 Sound & Notifications

### Sound Effects
```javascript
const testSound = () => {
  if (soundEffects) {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    // ... create sound
  }
};
```

### Notifications
```javascript
const testNotification = async () => {
  if (notifications) {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      new Notification('Test Notification', {
        body: 'This is a test notification!'
      });
    }
  }
};
```

## 🎨 Theme System

### CSS Variables
```css
:root {
  --font-size-small: 14px;
  --font-size-medium: 16px;
  --font-size-large: 18px;
}

:root[data-font-size="small"] {
  font-size: var(--font-size-small);
}
```

### Theme Context
```javascript
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('system');
  const [fontSize, setFontSize] = useState('medium');
  // ... other state
};
```

## 🔐 Authentication

### Demo User Creation
```javascript
const createDemoUser = async (email, displayName) => {
  const response = await fetch('/api/demo/user', {
    method: 'POST',
    body: JSON.stringify({ email, displayName })
  });
  const data = await response.json();
  localStorage.setItem('authToken', data.token);
};
```

### Token Verification
```javascript
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  // ... verify token
  req.userId = decoded.userId;
  next();
};
```

## 🚀 Production Ready

### Security
- **Helmet** for security headers
- **Rate limiting** for API protection
- **CORS** configuration
- **Input validation**

### Error Handling
- **Try-catch** blocks
- **Graceful fallbacks**
- **User-friendly messages**
- **Console logging**

### Performance
- **Auto-save** with debouncing
- **Optimistic updates**
- **Efficient re-renders**
- **Minimal API calls**

## 🧪 Testing

### Manual Testing
1. **Create demo user** → `/demo-auth`
2. **Test server connection** → Click "Test Server Connection"
3. **Change settings** → Go to `/settings`
4. **Verify persistence** → Refresh page, settings should persist
5. **Test notifications** → Click notification test button
6. **Test sound** → Click sound test button

### Automated Testing
```javascript
// Test settings API
describe('Settings API', () => {
  it('should get user settings', async () => {
    const response = await fetch('/api/settings/get', {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(response.ok).toBe(true);
  });
});
```

## 🎉 Result

You now have a **complete full-stack settings system** with:

- ✅ **Beautiful UI** with live preview
- ✅ **Backend storage** in MongoDB
- ✅ **Real-time updates** and auto-save
- ✅ **Working notifications** and sound
- ✅ **Theme switching** with persistence
- ✅ **Font size** changes applied globally
- ✅ **Error handling** and fallbacks
- ✅ **Production-ready** code structure

The settings are now **fully functional** and **persist across sessions**! 🚀
