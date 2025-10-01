import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/AuthService';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to 'system'
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'system';
  });

  const [fontSize, setFontSize] = useState(() => {
    // Get font size from localStorage or default to 'medium'
    const savedFontSize = localStorage.getItem('fontSize');
    return savedFontSize || 'medium';
  });

  const [notifications, setNotifications] = useState(() => {
    // Get notifications from localStorage or default to true
    const savedNotifications = localStorage.getItem('notifications');
    return savedNotifications === 'true';
  });

  const [soundEffects, setSoundEffects] = useState(() => {
    // Get sound effects from localStorage or default to true
    const savedSoundEffects = localStorage.getItem('soundEffects');
    return savedSoundEffects === 'true';
  });

  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Get language from localStorage or default to English
    const savedLanguage = localStorage.getItem('currentLanguage');
    return savedLanguage ? JSON.parse(savedLanguage) : { 
      name: 'English', 
      flag: '🇺🇸', 
      rtl: false,
      code: 'english'
    };
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Initialize theme and font size immediately
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply theme immediately
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
    
    // Apply font size immediately
    root.setAttribute('data-font-size', fontSize);
    root.style.setProperty('--current-font-size', 
      fontSize === 'small' ? '14px' : 
      fontSize === 'large' ? '18px' : '16px'
    );

    // Apply font size to body as well
    document.body.style.fontSize = 
      fontSize === 'small' ? '14px' : 
      fontSize === 'large' ? '18px' : '16px';
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      // System preference
      root.classList.remove('light');
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
    
    // Force immediate visual update
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    // Apply theme to body as well for immediate effect
    if (theme === 'dark') {
      document.body.style.backgroundColor = '#0f172a';
      document.body.style.color = '#f1f5f9';
    } else if (theme === 'light') {
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#1e293b';
    } else {
      // System preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.style.backgroundColor = '#0f172a';
        document.body.style.color = '#f1f5f9';
      } else {
        document.body.style.backgroundColor = '#ffffff';
        document.body.style.color = '#1e293b';
      }
    }
  }, [theme]);

  // Apply font size to document
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-font-size', fontSize);
    
    // Also apply as CSS custom property for better control
    root.style.setProperty('--current-font-size', 
      fontSize === 'small' ? '14px' : 
      fontSize === 'large' ? '18px' : '16px'
    );

    // Apply font size to body as well for global effect
    document.body.style.fontSize = 
      fontSize === 'small' ? '14px' : 
      fontSize === 'large' ? '18px' : '16px';

    // Update all text elements
    const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, button, input, textarea');
    textElements.forEach(element => {
      if (!element.style.fontSize) {
        element.style.fontSize = 'inherit';
      }
    });
  }, [fontSize]);

  // Apply RTL/LTR direction
  useEffect(() => {
    const root = document.documentElement;
    if (currentLanguage?.rtl) {
      root.setAttribute('dir', 'rtl');
    } else {
      root.setAttribute('dir', 'ltr');
    }
  }, [currentLanguage]);

  // Save to localStorage whenever values change
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('notifications', notifications.toString());
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('soundEffects', soundEffects.toString());
  }, [soundEffects]);

  useEffect(() => {
    localStorage.setItem('currentLanguage', JSON.stringify(currentLanguage));
  }, [currentLanguage]);

  // Load user settings from AuthService when user is authenticated
  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        const user = authService.getCurrentUser();
        if (user) {
          const settings = await authService.getUserSettings();
          if (settings) {
            setTheme(settings.theme || 'system');
            setFontSize(settings.fontSize || 'medium');
            setNotifications(settings.notifications !== undefined ? settings.notifications : true);
            setSoundEffects(settings.soundEffects !== undefined ? settings.soundEffects : true);
          }
        }
      } catch (error) {
        console.error('Error loading user settings:', error);
      }
    };

    loadUserSettings();
  }, []);

  // Save settings to AuthService when they change
  const saveSettingsToBackend = async (settings) => {
    try {
      const user = authService.getCurrentUser();
      if (user) {
        await authService.updateUserSettings(settings);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  // Enhanced setters that also save to backend
  const setThemeWithBackend = (newTheme) => {
    setTheme(newTheme);
    saveSettingsToBackend({ theme: newTheme });
    
    // Apply theme immediately to all elements
    applyThemeImmediately(newTheme);
  };

  // Apply theme immediately to all elements
  const applyThemeImmediately = (themeValue) => {
    const root = document.documentElement;
    const body = document.body;
    
    // Remove existing theme classes
    root.classList.remove('dark', 'light');
    body.classList.remove('dark-mode', 'light-mode');
    
    // Apply new theme
    if (themeValue === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark-mode');
      body.style.backgroundColor = '#0f172a';
      body.style.color = '#f1f5f9';
    } else if (themeValue === 'light') {
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
    
    // Force reflow to ensure changes take effect
    body.offsetHeight;
  };

  const setFontSizeWithBackend = (newFontSize) => {
    setFontSize(newFontSize);
    saveSettingsToBackend({ fontSize: newFontSize });
    
    // Apply font size globally
    applyGlobalFontSize(newFontSize);
  };

  const setNotificationsWithBackend = (newNotifications) => {
    setNotifications(newNotifications);
    saveSettingsToBackend({ notifications: newNotifications });
  };

  const setSoundEffectsWithBackend = (newSoundEffects) => {
    setSoundEffects(newSoundEffects);
    saveSettingsToBackend({ soundEffects: newSoundEffects });
  };

  // Apply font size globally to all elements
  const applyGlobalFontSize = (size) => {
    const root = document.documentElement;
    const body = document.body;
    
    // Set CSS custom property
    const fontSize = size === 'small' ? '14px' : size === 'large' ? '18px' : '16px';
    root.style.setProperty('--current-font-size', fontSize);
    body.style.fontSize = fontSize;
    
    // Update all text elements
    const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, button, input, textarea, a, li, td, th');
    textElements.forEach(element => {
      if (!element.hasAttribute('data-font-size-locked')) {
        element.style.fontSize = 'inherit';
      }
    });
    
    // Force reflow to ensure changes take effect
    document.body.offsetHeight;
  };

  const value = {
    theme,
    setTheme: setThemeWithBackend,
    fontSize,
    setFontSize: setFontSizeWithBackend,
    notifications,
    setNotifications: setNotificationsWithBackend,
    soundEffects,
    setSoundEffects: setSoundEffectsWithBackend,
    currentLanguage,
    setCurrentLanguage,
    loading,
    message,
    applyGlobalFontSize,
    applyThemeImmediately,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
