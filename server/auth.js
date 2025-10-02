// Local Authentication Backend (No Firebase, No Paid APIs)
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// JWT Secret (in production, use environment variable)
const JWT_SECRET = 'your-super-secret-jwt-key-change-in-production';

// User database file path
const USERS_FILE = path.join(__dirname, 'users.json');

// Initialize users file if it doesn't exist
async function initUsersFile() {
  try {
    await fs.access(USERS_FILE);
  } catch (error) {
    // File doesn't exist, create it with empty array
    await fs.writeFile(USERS_FILE, JSON.stringify([], null, 2));
    console.log('Created users.json file');
  }
}

// Read users from file
async function getUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
}

// Write users to file
async function saveUsers(users) {
  try {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving users file:', error);
    return false;
  }
}

// Generate JWT token
function generateToken(user) {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email 
    }, 
    JWT_SECRET, 
    { expiresIn: '24h' }
  );
}

// Verify JWT token
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'No token provided' 
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      error: 'Invalid token' 
    });
  }
}

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const users = await getUsers();
    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email: email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    // Save user
    users.push(newUser);
    const saved = await saveUsers(users);

    if (!saved) {
      return res.status(500).json({
        success: false,
        error: 'Failed to save user'
      });
    }

    // Generate token
    const token = generateToken(newUser);

    console.log('User registered successfully:', email);
    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      user: {
        id: newUser.id,
        email: newUser.email
      },
      token: token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Find user
    const users = await getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user);

    console.log('User logged in successfully:', email);
    res.json({
      success: true,
      message: 'Login successful!',
      user: {
        id: user.id,
        email: user.email
      },
      token: token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get current user endpoint
app.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    const users = await getUsers();
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Logout endpoint (client-side token removal)
app.post('/api/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Local Auth Server is running!',
    timestamp: new Date().toISOString()
  });
});

// Start server
async function startServer() {
  await initUsersFile();
  
  app.listen(PORT, () => {
    console.log(`🔥 Local Auth Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📝 Users database: ${USERS_FILE}`);
  });
}

startServer().catch(console.error);

module.exports = app;

