const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const settingsRouter = require('./settings');
const ttsService = require('./ttsService');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/language-app';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

// User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  settings: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    darkMode: {
      type: Boolean,
      default: false
    },
    fontSize: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'medium'
    },
    notifications: {
      type: Boolean,
      default: true
    },
    soundEffects: {
      type: Boolean,
      default: true
    },
    sound: {
      type: Boolean,
      default: true
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

// JWT Secret (in production, use a secure secret)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Simple JWT verification middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }

  try {
    // Simple token verification (in production, use proper JWT library)
    const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Get user settings
app.get('/api/settings/get', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('settings email displayName');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      settings: user.settings,
      userId: user._id,
      user: {
        email: user.email,
        displayName: user.displayName
      }
    });
  } catch (error) {
    console.error('Error getting settings:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update user settings
app.post('/api/settings/update', verifyToken, async (req, res) => {
  try {
    const { theme, fontSize, notifications, soundEffects, darkMode, sound } = req.body;
    
    // Validate input
    const validThemes = ['light', 'dark', 'system'];
    const validFontSizes = ['small', 'medium', 'large'];
    
    if (theme && !validThemes.includes(theme)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid theme value'
      });
    }
    
    if (fontSize && !validFontSizes.includes(fontSize)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid font size value'
      });
    }

    const updateData = {
      'settings.lastUpdated': new Date()
    };

    // Handle both new and legacy field names
    if (theme !== undefined) updateData['settings.theme'] = theme;
    if (darkMode !== undefined) updateData['settings.darkMode'] = darkMode;
    if (fontSize !== undefined) updateData['settings.fontSize'] = fontSize;
    if (notifications !== undefined) updateData['settings.notifications'] = notifications;
    if (soundEffects !== undefined) updateData['settings.soundEffects'] = soundEffects;
    if (sound !== undefined) updateData['settings.sound'] = sound;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updateData },
      { new: true, select: 'settings email displayName' }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Settings updated successfully',
      settings: user.settings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create demo user (for testing without authentication)
app.post('/api/demo/user', async (req, res) => {
  try {
    const { email, displayName } = req.body;
    
    if (!email || !displayName) {
      return res.status(400).json({
        success: false,
        message: 'Email and display name are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({
        success: true,
        message: 'User already exists',
        userId: existingUser._id,
        token: Buffer.from(JSON.stringify({ userId: existingUser._id })).toString('base64')
      });
    }

    // Create new user
    const user = new User({
      email,
      displayName,
      password: 'demo-password' // In production, hash this
    });

    await user.save();

    // Create a simple token (in production, use proper JWT)
    const token = Buffer.from(JSON.stringify({ userId: user._id })).toString('base64');

    res.json({
      success: true,
      message: 'Demo user created',
      userId: user._id,
      token
    });
  } catch (error) {
    console.error('Error creating demo user:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// TTS Routes
// Generate audio for text
app.post('/api/tts/generate', async (req, res) => {
  try {
    const { text, language = 'english', options = {} } = req.body;
    
    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Text is required and must be a string'
      });
    }

    // Validate language
    const supportedLanguages = ttsService.getSupportedLanguages();
    if (!supportedLanguages[language]) {
      return res.status(400).json({
        success: false,
        message: 'Unsupported language',
        supportedLanguages: Object.keys(supportedLanguages)
      });
    }

    // Generate audio
    const audioBuffer = await ttsService.generateAudio(text, language, options);
    
    // Set appropriate headers
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length,
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      'Access-Control-Allow-Origin': '*'
    });
    
    res.send(audioBuffer);
  } catch (error) {
    console.error('TTS generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate audio',
      error: error.message
    });
  }
});

// Get supported languages
app.get('/api/tts/languages', (req, res) => {
  try {
    const languages = ttsService.getSupportedLanguages();
    res.json({
      success: true,
      languages
    });
  } catch (error) {
    console.error('Error getting languages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get supported languages'
    });
  }
});

// Test TTS endpoint
app.get('/api/tts/test', async (req, res) => {
  try {
    const { language = 'english', text = 'Hello, this is a test.' } = req.query;
    
    const testText = language === 'arabic' ? 'مَرْحَبًا، كَيْفَ حَالُكَ الْيَوْمَ؟' : text;
    const audioBuffer = await ttsService.generateAudio(testText, language);
    
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length,
      'Access-Control-Allow-Origin': '*'
    });
    
    res.send(audioBuffer);
  } catch (error) {
    console.error('TTS test error:', error);
    res.status(500).json({
      success: false,
      message: 'TTS test failed',
      error: error.message
    });
  }
});

// Notification management endpoints
app.post('/api/notifications/send', verifyToken, async (req, res) => {
  try {
    const { title, message, type = 'info' } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required'
      });
    }

    // In a real app, you would integrate with push notification services
    // For now, we'll just log the notification
    console.log(`Notification for user ${req.userId}: ${title} - ${message}`);
    
    res.json({
      success: true,
      message: 'Notification sent successfully',
      notification: {
        id: Date.now().toString(),
        title,
        message,
        type,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Sound management endpoints
app.post('/api/sound/play', verifyToken, async (req, res) => {
  try {
    const { soundType, volume = 1.0 } = req.body;
    
    const validSoundTypes = ['success', 'error', 'notification', 'click', 'hover'];
    
    if (!soundType || !validSoundTypes.includes(soundType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid sound type'
      });
    }

    // In a real app, you would return audio data or trigger sound playback
    // For now, we'll just return success
    console.log(`Playing sound: ${soundType} at volume ${volume} for user ${req.userId}`);
    
    res.json({
      success: true,
      message: 'Sound played successfully',
      sound: {
        type: soundType,
        volume,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error playing sound:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// API Routes
app.use('/api/settings', settingsRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`⚙️ Settings API: http://localhost:${PORT}/api/settings`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});