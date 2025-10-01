import React, { createContext, useContext, useState, useEffect } from 'react';

const GlobalSettingsContext = createContext();

export const useGlobalSettings = () => {
  const context = useContext(GlobalSettingsContext);
  if (!context) {
    throw new Error('useGlobalSettings must be used within a GlobalSettingsProvider');
  }
  return context;
};

export const GlobalSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    darkMode: 'system',
    soundEffects: true,
    fontSize: 'medium',
    dailyReminders: true,
    ttsVoice: 'google'
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const loadSettings = () => {
      const savedSettings = {
        darkMode: localStorage.getItem('theme') || 'system',
        fontSize: localStorage.getItem('fontSize') || 'medium',
        soundEffects: localStorage.getItem('soundEnabled') !== 'false',
        dailyReminders: localStorage.getItem('notificationsEnabled') !== 'false',
        ttsVoice: 'google'
      };
      setSettings(savedSettings);
      applySettings(savedSettings);
    };

    loadSettings();
  }, []);

  // Apply settings to the entire app
  const applySettings = (newSettings) => {
    const root = document.documentElement;
    
    // Apply theme
    if (newSettings.darkMode === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else if (newSettings.darkMode === 'light') {
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

    // Apply font size
    const sizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    const fontSize = sizeMap[newSettings.fontSize] || '16px';
    root.style.fontSize = fontSize;
    root.setAttribute('data-font-size', newSettings.fontSize);

    // Apply sound settings
    root.setAttribute('data-sound', newSettings.soundEffects.toString());

    // Apply notification settings
    root.setAttribute('data-notifications', newSettings.dailyReminders.toString());
  };

  // Update settings and apply globally
  const updateSettings = (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    applySettings(updatedSettings);
    
    // Save to localStorage
    localStorage.setItem('theme', updatedSettings.darkMode);
    localStorage.setItem('fontSize', updatedSettings.fontSize);
    localStorage.setItem('soundEnabled', updatedSettings.soundEffects.toString());
    localStorage.setItem('notificationsEnabled', updatedSettings.dailyReminders.toString());
  };

  // Test notification
  const testNotification = async () => {
    if (settings.dailyReminders) {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification('🎉 Test Notification', {
            body: 'This is a test notification from your language learning app!',
            icon: '/favicon.ico',
            tag: 'language-app-test'
          });
          return true;
        }
      }
    }
    return false;
  };

  // Test sound
  const testSound = () => {
    if (settings.soundEffects) {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.8);
        
        return true;
      } catch (error) {
        console.error('Sound error:', error);
        return false;
      }
    }
    return false;
  };

  const value = {
    settings,
    updateSettings,
    testNotification,
    testSound,
    applySettings
  };

  return (
    <GlobalSettingsContext.Provider value={value}>
      {children}
    </GlobalSettingsContext.Provider>
  );
};
