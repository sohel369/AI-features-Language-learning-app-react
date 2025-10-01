// Settings API endpoints
const express = require('express');
const router = express.Router();

// In-memory storage for demo (in production, use a database)
let settingsStore = {};

// Get user settings
router.get('/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const settings = settingsStore[userId] || {
      darkMode: 'system',
      soundEffects: true,
      fontSize: 'medium',
      dailyReminders: true,
      ttsVoice: 'google'
    };
    
    res.json({ success: true, settings });
  } catch (error) {
    console.error('Error getting settings:', error);
    res.status(500).json({ success: false, error: 'Failed to get settings' });
  }
});

// Save user settings
router.post('/', (req, res) => {
  try {
    const { userId, settings } = req.body;
    
    if (!userId || !settings) {
      return res.status(400).json({ success: false, error: 'Missing userId or settings' });
    }
    
    // Store settings
    settingsStore[userId] = settings;
    
    console.log(`Settings saved for user ${userId}:`, settings);
    
    res.json({ success: true, message: 'Settings saved successfully' });
  } catch (error) {
    console.error('Error saving settings:', error);
    res.status(500).json({ success: false, error: 'Failed to save settings' });
  }
});

// Update user settings
router.put('/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { settings } = req.body;
    
    if (!settings) {
      return res.status(400).json({ success: false, error: 'Missing settings' });
    }
    
    // Update settings
    settingsStore[userId] = { ...settingsStore[userId], ...settings };
    
    console.log(`Settings updated for user ${userId}:`, settings);
    
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ success: false, error: 'Failed to update settings' });
  }
});

// Delete user settings
router.delete('/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    
    delete settingsStore[userId];
    
    console.log(`Settings deleted for user ${userId}`);
    
    res.json({ success: true, message: 'Settings deleted successfully' });
  } catch (error) {
    console.error('Error deleting settings:', error);
    res.status(500).json({ success: false, error: 'Failed to delete settings' });
  }
});

module.exports = router;
