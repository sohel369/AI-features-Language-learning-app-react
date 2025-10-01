import React, { createContext, useContext, useState, useEffect } from 'react';
import settingsService from '../services/SettingsService';

const AppSettingsContext = createContext();

export const AppSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    theme: 'system',
    darkMode: false,
    fontSize: 'medium',
    notifications: true,
    soundEffects: true,
    sound: true
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize settings on mount
  useEffect(() => {
    initializeSettings();
  }, []);

  const initializeSettings = async () => {
    try {
      setLoading(true);
      const initialSettings = await settingsService.initializeSettings();
      setSettings(initialSettings);
      setError(null);
    } catch (err) {
      console.error('Error initializing settings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update a specific setting
  const updateSetting = async (key, value) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      
      // Apply setting immediately
      if (key === 'theme' || key === 'darkMode') {
        const theme = key === 'darkMode' ? (value ? 'dark' : 'light') : value;
        settingsService.applyTheme(theme);
      }
      
      if (key === 'fontSize') {
        settingsService.applyFontSize(value);
      }
      
      // Save to backend and localStorage
      await settingsService.saveSettings({ [key]: value });
      
      // Play sound if enabled
      if (settings.sound) {
        settingsService.playLocalSound('click');
      }
      
      setError(null);
    } catch (err) {
      console.error('Error updating setting:', err);
      setError(err.message);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    updateSetting('darkMode', !settings.darkMode);
  };

  // Toggle notifications
  const toggleNotifications = () => {
    updateSetting('notifications', !settings.notifications);
  };

  // Toggle sound
  const toggleSound = () => {
    updateSetting('sound', !settings.sound);
  };

  // Set font size
  const setFontSize = (size) => {
    updateSetting('fontSize', size);
  };

  // Set theme
  const setTheme = (theme) => {
    updateSetting('theme', theme);
  };

  // Send notification (if enabled)
  const sendNotification = async (title, message, type = 'info') => {
    if (!settings.notifications) return;
    
    try {
      // Try backend first
      await settingsService.sendNotification(title, message, type);
    } catch (error) {
      // Fallback to local notification
      settingsService.showLocalNotification(title, message, type);
    }
  };

  // Play sound (if enabled)
  const playSound = (soundType, volume = 1.0) => {
    if (!settings.sound) return;
    
    try {
      // Try backend first
      settingsService.playSound(soundType, volume);
    } catch (error) {
      // Fallback to local sound
      settingsService.playLocalSound(soundType, volume);
    }
  };

  // Get current theme (considering darkMode override)
  const getCurrentTheme = () => {
    if (settings.darkMode) return 'dark';
    if (settings.theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return settings.theme;
  };

  // Check if dark mode is active
  const isDarkMode = () => {
    return getCurrentTheme() === 'dark';
  };

  // Get font size class
  const getFontSizeClass = () => {
    const sizeMap = {
      'small': 'text-sm',
      'medium': 'text-base',
      'large': 'text-lg'
    };
    return sizeMap[settings.fontSize] || 'text-base';
  };

  // Get font size for dynamic sizing
  const getFontSize = () => {
    const sizeMap = {
      'small': '14px',
      'medium': '16px',
      'large': '18px'
    };
    return sizeMap[settings.fontSize] || '16px';
  };

  const value = {
    // State
    settings,
    loading,
    error,
    
    // Computed values
    isDarkMode: isDarkMode(),
    currentTheme: getCurrentTheme(),
    fontSizeClass: getFontSizeClass(),
    fontSize: getFontSize(),
    
    // Actions
    updateSetting,
    toggleDarkMode,
    toggleNotifications,
    toggleSound,
    setFontSize,
    setTheme,
    sendNotification,
    playSound,
    
    // Direct access to settings
    theme: settings.theme,
    darkMode: settings.darkMode,
    fontSize: settings.fontSize,
    notifications: settings.notifications,
    sound: settings.sound,
    soundEffects: settings.soundEffects
  };

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
};
