// Settings Service for managing app settings with database integration
import databaseService from './DatabaseService';

class SettingsService {
  constructor() {
    this.defaultSettings = {
      theme: 'system', // 'light', 'dark', 'system'
      sound: true,
      notifications: true,
      fontSize: 'medium', // 'small', 'medium', 'large'
      dailyReminders: true,
      achievementAlerts: true,
      streakWarnings: true,
      autoPlayAudio: true,
      highContrast: false
    };
  }

  // Load settings from localStorage and database
  async loadSettings(userId = null) {
    try {
      // Load from localStorage first for immediate access
      const localSettings = this.loadFromLocalStorage();
      
      // If user is logged in, load from database
      if (userId) {
        const dbSettings = await this.loadFromDatabase(userId);
        if (dbSettings) {
          // Merge database settings with local settings (database takes priority)
          const mergedSettings = { ...localSettings, ...dbSettings };
          this.saveToLocalStorage(mergedSettings);
          return mergedSettings;
        }
      }
      
      return localSettings;
    } catch (error) {
      console.error('Failed to load settings:', error);
      return this.defaultSettings;
    }
  }

  // Save settings to both localStorage and database
  async saveSettings(settings, userId = null) {
    try {
      // Save to localStorage for immediate access
      this.saveToLocalStorage(settings);
      
      // Save to database if user is logged in
      if (userId) {
        await this.saveToDatabase(settings, userId);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Failed to save settings:', error);
      return { success: false, error: error.message };
    }
  }

  // Load settings from localStorage
  loadFromLocalStorage() {
    const settings = { ...this.defaultSettings };
    
    Object.keys(settings).forEach(key => {
      const value = localStorage.getItem(key);
      if (value !== null) {
        if (value === 'true' || value === 'false') {
          settings[key] = value === 'true';
        } else {
          settings[key] = value;
        }
      }
    });
    
    return settings;
  }

  // Save settings to localStorage
  saveToLocalStorage(settings) {
    Object.keys(settings).forEach(key => {
      localStorage.setItem(key, settings[key].toString());
    });
  }

  // Load settings from database
  async loadFromDatabase(userId) {
    try {
      const result = await databaseService.getUserData(userId);
      if (result.success && result.data.settings) {
        return result.data.settings;
      }
      return null;
    } catch (error) {
      console.error('Failed to load settings from database:', error);
      return null;
    }
  }

  // Save settings to database
  async saveToDatabase(settings, userId) {
    try {
      await databaseService.updateUserData(userId, {
        settings: settings
      });
      return { success: true };
    } catch (error) {
      console.error('Failed to save settings to database:', error);
      return { success: false, error: error.message };
    }
  }

  // Apply theme to document
  applyTheme(theme) {
    const root = document.documentElement;
    let currentTheme = theme;
    
    if (theme === 'system') {
      currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    root.setAttribute('data-theme', currentTheme);
    root.classList.remove('light', 'dark');
    root.classList.add(currentTheme);
  }

  // Apply font size to document
  applyFontSize(fontSize) {
    const root = document.documentElement;
    root.setAttribute('data-font-size', fontSize);
    root.classList.remove('font-small', 'font-medium', 'font-large');
    root.classList.add(`font-${fontSize}`);
  }

  // Get current theme (resolved from system if needed)
  getCurrentTheme(theme) {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  }

  // Reset settings to default
  async resetSettings(userId = null) {
    try {
      this.saveToLocalStorage(this.defaultSettings);
      
      if (userId) {
        await this.saveToDatabase(this.defaultSettings, userId);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Failed to reset settings:', error);
      return { success: false, error: error.message };
    }
  }

  // Get setting value
  getSetting(key, defaultValue = null) {
    const settings = this.loadFromLocalStorage();
    return settings[key] !== undefined ? settings[key] : defaultValue;
  }

  // Set setting value
  async setSetting(key, value, userId = null) {
    const settings = this.loadFromLocalStorage();
    settings[key] = value;
    return await this.saveSettings(settings, userId);
  }

  // Export settings
  exportSettings() {
    const settings = this.loadFromLocalStorage();
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'app-settings.json';
    link.click();
    
    URL.revokeObjectURL(url);
  }

  // Import settings
  async importSettings(file, userId = null) {
    try {
      const text = await file.text();
      const settings = JSON.parse(text);
      
      // Validate settings
      const validatedSettings = { ...this.defaultSettings, ...settings };
      
      return await this.saveSettings(validatedSettings, userId);
    } catch (error) {
      console.error('Failed to import settings:', error);
      return { success: false, error: 'Invalid settings file' };
    }
  }
}

// Create singleton instance
const settingsService = new SettingsService();

export default settingsService;