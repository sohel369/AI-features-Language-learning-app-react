// Comprehensive Settings Service
class SettingsService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    this.token = localStorage.getItem('authToken');
  }

  // Get authentication token
  getAuthToken() {
    return localStorage.getItem('authToken') || localStorage.getItem('demo_current_user');
  }

  // Make authenticated API request
  async makeRequest(endpoint, options = {}) {
    const token = this.getAuthToken();
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }
      
      return data;
    } catch (error) {
      console.error('Settings API request failed:', error);
      throw error;
    }
  }

  // Get user settings from backend
  async getUserSettings() {
    try {
      const response = await this.makeRequest('/api/settings/get');
      return response.settings || {
        theme: 'system',
        darkMode: false,
        fontSize: 'medium',
        notifications: true,
        soundEffects: true,
        sound: true
      };
    } catch (error) {
      console.error('Error fetching user settings:', error);
      // Return default settings if backend fails
      return {
        theme: 'system',
        darkMode: false,
        fontSize: 'medium',
        notifications: true,
        soundEffects: true,
        sound: true
      };
    }
  }

  // Update user settings
  async updateUserSettings(settings) {
    try {
      const response = await this.makeRequest('/api/settings/update', {
        method: 'POST',
        body: JSON.stringify(settings)
      });
      return response;
    } catch (error) {
      console.error('Error updating user settings:', error);
      throw error;
    }
  }

  // Send notification
  async sendNotification(title, message, type = 'info') {
    try {
      const response = await this.makeRequest('/api/notifications/send', {
        method: 'POST',
        body: JSON.stringify({ title, message, type })
      });
      return response;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  // Play sound effect
  async playSound(soundType, volume = 1.0) {
    try {
      const response = await this.makeRequest('/api/sound/play', {
        method: 'POST',
        body: JSON.stringify({ soundType, volume })
      });
      return response;
    } catch (error) {
      console.error('Error playing sound:', error);
      throw error;
    }
  }

  // Local notification system (for demo purposes)
  showLocalNotification(title, message, type = 'info') {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body: message,
          icon: '/favicon.ico',
          tag: 'language-app'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(title, {
              body: message,
              icon: '/favicon.ico',
              tag: 'language-app'
            });
          }
        });
      }
    }
  }

  // Local sound system (for demo purposes)
  playLocalSound(soundType, volume = 1.0) {
    // Create audio context for sound effects
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Generate different sound patterns based on type
    let frequency, duration;
    switch (soundType) {
      case 'success':
        frequency = 800;
        duration = 0.2;
        break;
      case 'error':
        frequency = 200;
        duration = 0.5;
        break;
      case 'notification':
        frequency = 600;
        duration = 0.3;
        break;
      case 'click':
        frequency = 1000;
        duration = 0.1;
        break;
      case 'hover':
        frequency = 1200;
        duration = 0.05;
        break;
      default:
        frequency = 500;
        duration = 0.2;
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume * 0.1, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  }

  // Apply theme globally
  applyTheme(theme) {
    const root = document.documentElement;
    const body = document.body;
    
    // Remove existing theme classes
    root.classList.remove('dark', 'light');
    body.classList.remove('dark-mode', 'light-mode');
    
    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark-mode');
      body.style.backgroundColor = '#0f172a';
      body.style.color = '#f1f5f9';
    } else if (theme === 'light') {
      root.classList.add('light');
      body.classList.add('light-mode');
      body.style.backgroundColor = '#ffffff';
      body.style.color = '#1e293b';
    } else {
      // System preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
        body.classList.add('dark-mode');
        body.style.backgroundColor = '#0f172a';
        body.style.color = '#f1f5f9';
      } else {
        root.classList.add('light');
        body.classList.add('light-mode');
        body.style.backgroundColor = '#ffffff';
        body.style.color = '#1e293b';
      }
    }
    
    // Force reflow
    body.offsetHeight;
  }

  // Apply font size globally
  applyFontSize(fontSize) {
    const root = document.documentElement;
    const body = document.body;
    
    const sizeMap = {
      'small': '14px',
      'medium': '16px',
      'large': '18px'
    };
    
    const size = sizeMap[fontSize] || '16px';
    
    root.style.setProperty('--current-font-size', size);
    body.style.fontSize = size;
    
    // Update all text elements
    const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, button, input, textarea, a, li, td, th');
    textElements.forEach(element => {
      if (!element.hasAttribute('data-font-size-locked')) {
        element.style.fontSize = 'inherit';
      }
    });
    
    // Force reflow
    body.offsetHeight;
  }

  // Initialize settings from localStorage or backend
  async initializeSettings() {
    try {
      // Try to get settings from backend first
      const backendSettings = await this.getUserSettings();
      
      // Apply settings immediately
      if (backendSettings.theme) {
        this.applyTheme(backendSettings.theme);
      }
      
      if (backendSettings.fontSize) {
        this.applyFontSize(backendSettings.fontSize);
      }
      
      // Store in localStorage for offline access
      localStorage.setItem('userSettings', JSON.stringify(backendSettings));
      
      return backendSettings;
    } catch (error) {
      console.error('Error initializing settings:', error);
      
      // Fallback to localStorage
      const localSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
      
      if (localSettings.theme) {
        this.applyTheme(localSettings.theme);
      }
      
      if (localSettings.fontSize) {
        this.applyFontSize(localSettings.fontSize);
      }
      
      return localSettings;
    }
  }

  // Save settings to both backend and localStorage
  async saveSettings(settings) {
    try {
      // Save to backend
      await this.updateUserSettings(settings);
      
      // Save to localStorage for offline access
      const currentSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
      const updatedSettings = { ...currentSettings, ...settings };
      localStorage.setItem('userSettings', JSON.stringify(updatedSettings));
      
      return updatedSettings;
    } catch (error) {
      console.error('Error saving settings:', error);
      
      // Fallback to localStorage only
      const currentSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
      const updatedSettings = { ...currentSettings, ...settings };
      localStorage.setItem('userSettings', JSON.stringify(updatedSettings));
      
      return updatedSettings;
    }
  }
}

// Create singleton instance
const settingsService = new SettingsService();
export default settingsService;