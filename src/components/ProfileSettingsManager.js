import React, { useState, useEffect } from 'react';
import { Settings, Volume2, Bell, Type, Sun, Moon, Monitor } from 'lucide-react';
import authService from '../services/AuthService';
import settingsService from '../services/SettingsService';
import { useGlobalSettings } from '../context/GlobalSettingsContext';

const FONT_SIZE_OPTIONS = [
  { value: 'small', label: 'Small', size: '14px' },
  { value: 'medium', label: 'Medium', size: '16px' },
  { value: 'large', label: 'Large', size: '18px' }
];

const DARK_MODE_OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun, description: 'Always use light theme' },
  { value: 'dark', label: 'Dark', icon: Moon, description: 'Always use dark theme' },
  { value: 'system', label: 'System', icon: Monitor, description: 'Follow system preference' }
];

export default function ProfileSettingsManager() {
  const { settings, updateSettings, testNotification, testSound } = useGlobalSettings();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState('');

  // Apply theme changes
  const applyTheme = (theme) => {
    const root = document.documentElement;
    console.log('Applying theme:', theme);
    
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    } else {
      // System preference
      root.removeAttribute('data-theme');
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
    
    // Store in localStorage
    localStorage.setItem('theme', theme);
  };

  // Apply font size changes
  const applyFontSize = (size) => {
    const root = document.documentElement;
    const sizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    const fontSize = sizeMap[size] || '16px';
    root.style.fontSize = fontSize;
    root.setAttribute('data-font-size', size);
    
    // Store in localStorage
    localStorage.setItem('fontSize', size);
    console.log('Applied font size:', size, fontSize);
  };

  // Test notification function
  const sendTestNotification = async () => {
    const success = await testNotification();
    if (success) {
      setNotification('✅ Test notification sent successfully!');
      setTimeout(() => setNotification(''), 3000);
    } else {
      setNotification('❌ Please allow notifications in your browser settings.');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  // Test sound function
  const playTestSound = () => {
    const success = testSound();
    if (success) {
      setNotification('🔊 Test sound played successfully!');
      setTimeout(() => setNotification(''), 3000);
    } else {
      setNotification('ℹ️ Enable sound effects first to test them.');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  // Save app settings
  const handleAppSettingsSave = async (newSettings) => {
    setSaving(true);
    try {
      // Update global settings
      updateSettings(newSettings);
      
      // Save using SettingsService
      await settingsService.saveSettings(newSettings);
      
      // Also save to authService for compatibility
      await authService.updateUserProfile({
        settings: newSettings
      });
      
      setNotification('✅ Settings saved successfully!');
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setNotification('❌ Error saving settings');
      setTimeout(() => setNotification(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        // First try to load from localStorage
        const localTheme = localStorage.getItem('theme');
        const localFontSize = localStorage.getItem('fontSize');
        const localSound = localStorage.getItem('soundEnabled');
        const localNotifications = localStorage.getItem('notificationsEnabled');
        
        if (localTheme || localFontSize || localSound || localNotifications) {
          const settings = {
            darkMode: localTheme || 'system',
            fontSize: localFontSize || 'medium',
            soundEffects: localSound !== 'false',
            dailyReminders: localNotifications !== 'false',
            ttsVoice: 'google'
          };
          setAppSettings(settings);
          applyTheme(settings.darkMode);
          applyFontSize(settings.fontSize);
          return;
        }
        
        // Fallback to SettingsService
        const settings = await settingsService.loadSettings();
        setAppSettings(settings);
        applyTheme(settings.darkMode);
        applyFontSize(settings.fontSize);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    const unsubscribe = authService.onAuthStateChanged(async (user, userData) => {
      if (user && userData) {
        setUserData(userData);
        // Load settings
        await loadUserSettings();
      }
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);

  // Apply settings when they change
  useEffect(() => {
    applyTheme(appSettings.darkMode);
    applyFontSize(appSettings.fontSize);
  }, [appSettings.darkMode, appSettings.fontSize]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <span>{notification}</span>
        </div>
      )}

      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Settings className="w-5 h-5 text-purple-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">App Settings</h3>
      </div>
      
      <div className="space-y-6">
        {/* Theme Selection */}
        <div className="flex items-center justify-between py-3">
          <div>
            <div className="font-medium text-gray-900">Theme</div>
            <div className="text-sm text-gray-500">Choose your preferred theme</div>
          </div>
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {DARK_MODE_OPTIONS.map(option => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAppSettingsSave({ ...settings, darkMode: option.value });
                }}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  settings.darkMode === option.value
                    ? 'bg-green-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
        </div>

        {/* Sound Effects */}
        <div className="flex items-center justify-between py-3">
          <div>
            <div className="font-medium text-gray-900">Sound Effects</div>
            <div className="text-sm text-gray-500">Play sounds for interactions</div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAppSettingsSave({ ...settings, soundEffects: !settings.soundEffects });
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.soundEffects ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.soundEffects ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            {settings.soundEffects && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  playTestSound();
                }}
                className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                title="Test sound"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Daily Reminders */}
        <div className="flex items-center justify-between py-3">
          <div>
            <div className="font-medium text-gray-900">Daily Reminders</div>
            <div className="text-sm text-gray-500">Get notified about your progress</div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAppSettingsSave({ ...settings, dailyReminders: !settings.dailyReminders });
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.dailyReminders ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.dailyReminders ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            {settings.dailyReminders && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  sendTestNotification();
                }}
                className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                title="Test notification"
              >
                <Bell className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Font Size */}
        <div className="flex items-center justify-between py-3">
          <div>
            <div className="font-medium text-gray-900">Font Size</div>
            <div className="text-sm text-gray-500">Adjust text size for better readability</div>
          </div>
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {FONT_SIZE_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAppSettingsSave({ ...settings, fontSize: option.value });
                  }}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    settings.fontSize === option.value
                      ? 'bg-green-500 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* TTS Voice */}
        <div className="flex items-center justify-between py-3">
          <div>
            <div className="font-medium text-gray-900">TTS Voice</div>
            <div className="text-sm text-gray-500">Choose your text-to-speech voice</div>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setAppSettings(prev => ({ 
                ...prev, 
                ttsVoice: prev.ttsVoice === 'google' ? 'system' : 'google' 
              }));
              handleAppSettingsSave();
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              appSettings.ttsVoice === 'google'
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            {appSettings.ttsVoice === 'google' ? 'Google TTS' : 'System Voice'}
          </button>
        </div>
      </div>
    </div>
  );
}
