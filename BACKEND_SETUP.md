# Backend Setup Guide

This guide will help you set up the backend server for the Profile App Settings with full functionality.

## Prerequisites

1. **Node.js** (version 14 or higher)
2. **MongoDB** (local installation or MongoDB Atlas)
3. **npm** or **yarn** package manager

## Quick Setup

### 1. Install MongoDB

#### Option A: Local MongoDB
- Download and install MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
- Start MongoDB service: `mongod`

#### Option B: MongoDB Atlas (Cloud)
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
- Create a new cluster
- Get your connection string

### 2. Backend Server Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env file with your settings
# MONGODB_URI=mongodb://localhost:27017/language-app
# or for Atlas: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/language-app

# Start the server
npm start
```

### 3. Frontend Setup

```bash
# In the main project directory
npm install

# Start the React app
npm start
```

## API Endpoints

The backend provides the following endpoints:

### Health Check
- **GET** `/api/health` - Check if server is running

### Demo User
- **POST** `/api/demo/user` - Create a demo user for testing
  ```json
  {
    "email": "user@example.com",
    "displayName": "John Doe"
  }
  ```

### Settings
- **GET** `/api/settings/get` - Get user settings (requires authentication)
- **POST** `/api/settings/update` - Update user settings (requires authentication)

## Testing the Integration

1. **Start the backend server** (port 5000)
2. **Start the React app** (port 3000)
3. **Navigate to** `http://localhost:3000/demo-auth`
4. **Create a demo user** with email and display name
5. **Navigate to** `http://localhost:3000/settings`
6. **Test the settings** - they will be saved to MongoDB

## Features

### ✅ Dark Mode
- Toggle between Light, Dark, and System themes
- Settings persist in database
- Immediate visual feedback

### ✅ Notifications
- Enable/disable push notifications
- Test notification functionality
- Browser permission handling

### ✅ Sound Effects
- Enable/disable audio feedback
- Test sound functionality
- Web Audio API integration

### ✅ Font Size
- Small, Medium, Large options
- Global font size application
- Live preview

### ✅ Backend Integration
- MongoDB storage
- JWT-like authentication
- Auto-save functionality
- Error handling

## Database Schema

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
  },
  createdAt: Date,
  lastLogin: Date
}
```

## Environment Variables

Create a `.env` file in the server directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/language-app
JWT_SECRET=your-super-secret-jwt-key-change-in-production
FRONTEND_URL=http://localhost:3000
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access for Atlas

### CORS Issues
- Update `FRONTEND_URL` in `.env`
- Check that React app is running on correct port

### Authentication Issues
- Clear localStorage: `localStorage.clear()`
- Create new demo user
- Check browser console for errors

## Production Deployment

For production deployment:

1. **Use a proper JWT library** (jsonwebtoken)
2. **Set secure JWT secrets**
3. **Use environment variables** for all secrets
4. **Enable HTTPS**
5. **Use a production MongoDB instance**
6. **Add proper error logging**
7. **Implement rate limiting**
8. **Add input validation**

## Code Structure

```
server/
├── server.js          # Main server file
├── package.json       # Dependencies
├── env.example        # Environment template
└── .env              # Environment variables (create this)

src/
├── components/
│   ├── AppSettings.js    # Main settings component
│   ├── DemoAuth.js       # Demo authentication
│   └── ProfileSettings.js # Wrapper component
├── services/
│   └── SettingsService.js # API communication
└── context/
    └── ThemeContext.js   # Theme management
```

## Next Steps

1. **Test all functionality** with the demo user
2. **Customize the UI** to match your design
3. **Add more settings** as needed
4. **Implement proper authentication** for production
5. **Add user management** features
6. **Deploy to production** when ready

The backend is now fully functional with MongoDB integration! 🎉
