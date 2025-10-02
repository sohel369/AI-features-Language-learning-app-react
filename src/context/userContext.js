// src/context/UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import firebaseAuthService from '../services/FirebaseAuthService';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const unsubscribe = firebaseAuthService.onAuthStateChanged(async (firebaseUser) => {
      console.log('UserContext - Auth state changed:', firebaseUser);
      setUser(firebaseUser);
      
      if (firebaseUser) {
        setIsAuthenticated(true);
        // Load user data from Firestore
        try {
          const userDataResult = await firebaseAuthService.getUserData(firebaseUser.uid);
          if (userDataResult.success) {
            setUserData(userDataResult.data);
            // Apply global settings
            if (userDataResult.data.settings) {
              const { theme, fontSize, language, sound, notifications } = userDataResult.data.settings;
              
              // Apply theme globally
              if (theme === 'dark') {
                document.documentElement.classList.add('dark');
                document.documentElement.classList.remove('light');
                document.body.classList.add('dark');
                document.body.classList.remove('light');
              } else if (theme === 'light') {
                document.documentElement.classList.remove('dark');
                document.documentElement.classList.add('light');
                document.body.classList.remove('dark');
                document.body.classList.add('light');
              } else {
                // System theme
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                  document.body.classList.add('dark');
                  document.body.classList.remove('light');
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                  document.body.classList.remove('dark');
                  document.body.classList.add('light');
                }
              }
              
              // Apply font size globally
              const fontSizeMap = {
                small: '14px',
                medium: '16px',
                large: '18px'
              };
              const fontSizeValue = fontSizeMap[fontSize] || '16px';
              document.documentElement.style.fontSize = fontSizeValue;
              document.body.style.fontSize = fontSizeValue;
              
              // Apply language direction
              if (language === 'arabic') {
                document.documentElement.setAttribute('dir', 'rtl');
                document.documentElement.setAttribute('lang', 'ar');
                document.body.setAttribute('dir', 'rtl');
                document.body.setAttribute('lang', 'ar');
              } else {
                document.documentElement.setAttribute('dir', 'ltr');
                document.documentElement.setAttribute('lang', 'en');
                document.body.setAttribute('dir', 'ltr');
                document.body.setAttribute('lang', 'en');
              }
              
              // Apply sound settings globally
              window.userSoundEnabled = sound;
              localStorage.setItem('userSoundEnabled', sound.toString());
              
              // Apply notification settings globally
              window.userNotificationsEnabled = notifications;
              localStorage.setItem('userNotificationsEnabled', notifications.toString());
              
              console.log('Global settings applied:', { theme, fontSize, language, sound, notifications });
            }
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      } else {
        setIsAuthenticated(false);
        setUserData(null);
      }
      
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  // Initialize global settings on app start
  useEffect(() => {
    // Initialize global settings from localStorage
    const soundEnabled = localStorage.getItem('userSoundEnabled') === 'true';
    const notificationsEnabled = localStorage.getItem('userNotificationsEnabled') === 'true';
    
    window.userSoundEnabled = soundEnabled;
    window.userNotificationsEnabled = notificationsEnabled;
  }, []);

  // Load leaderboard data
  useEffect(() => {
    if (isAuthenticated) {
      const unsubscribe = firebaseAuthService.onLeaderboardChange((leaderboardData) => {
        setLeaderboard(leaderboardData);
      });
      return unsubscribe;
    }
  }, [isAuthenticated]);

  const login = async (email, password) => {
    return await firebaseAuthService.signIn(email, password);
  };

  const register = async (email, password, displayName) => {
    return await firebaseAuthService.register(email, password, displayName);
  };

  const logout = async () => {
    return await firebaseAuthService.signOut();
  };

  const updateProfile = async (profileData) => {
    if (!user) return { success: false, error: 'No user logged in' };
    
    setIsUpdating(true);
    try {
      const result = await firebaseAuthService.updateProfile(user.uid, profileData);
      if (result.success) {
        // Update local state
        setUserData(prev => ({
          ...prev,
          displayName: profileData.displayName,
          email: profileData.email
        }));
      }
      return result;
    } finally {
      setIsUpdating(false);
    }
  };

  const updateSettings = async (settings) => {
    if (!user) return { success: false, error: 'No user logged in' };
    
    setIsUpdating(true);
    try {
      const result = await firebaseAuthService.updateSettings(user.uid, settings);
      if (result.success) {
        // Update local state
        const updatedUserData = {
          ...userData,
          settings: { ...userData.settings, ...settings }
        };
        setUserData(updatedUserData);
        
        // Apply global settings immediately
        if (updatedUserData.settings) {
          const { theme, fontSize, language, sound, notifications } = updatedUserData.settings;
          
          // Apply theme globally
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
            document.body.classList.add('dark');
            document.body.classList.remove('light');
          } else if (theme === 'light') {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
            document.body.classList.remove('dark');
            document.body.classList.add('light');
          } else {
            // System theme
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
              document.documentElement.classList.add('dark');
              document.documentElement.classList.remove('light');
              document.body.classList.add('dark');
              document.body.classList.remove('light');
            } else {
              document.documentElement.classList.remove('dark');
              document.documentElement.classList.add('light');
              document.body.classList.remove('dark');
              document.body.classList.add('light');
            }
          }
          
          // Apply font size globally
          const fontSizeMap = {
            small: '14px',
            medium: '16px',
            large: '18px'
          };
          const fontSizeValue = fontSizeMap[fontSize] || '16px';
          document.documentElement.style.fontSize = fontSizeValue;
          document.body.style.fontSize = fontSizeValue;
          
          // Apply language direction
          if (language === 'arabic') {
            document.documentElement.setAttribute('dir', 'rtl');
            document.documentElement.setAttribute('lang', 'ar');
            document.body.setAttribute('dir', 'rtl');
            document.body.setAttribute('lang', 'ar');
          } else {
            document.documentElement.setAttribute('dir', 'ltr');
            document.documentElement.setAttribute('lang', 'en');
            document.body.setAttribute('dir', 'ltr');
            document.body.setAttribute('lang', 'en');
          }
          
          // Apply sound settings globally
          window.userSoundEnabled = sound;
          localStorage.setItem('userSoundEnabled', sound.toString());
          
          // Apply notification settings globally
          window.userNotificationsEnabled = notifications;
          localStorage.setItem('userNotificationsEnabled', notifications.toString());
          
          console.log('Global settings updated:', { theme, fontSize, language, sound, notifications });
        }
      }
      return result;
    } finally {
      setIsUpdating(false);
    }
  };

  const updateLearningLanguages = async (languages) => {
    if (!user) return { success: false, error: 'No user logged in' };
    
    setIsUpdating(true);
    try {
      const result = await firebaseAuthService.updateLearningLanguages(user.uid, languages);
      if (result.success) {
        // Update local state
        setUserData(prev => ({
          ...prev,
          learningLanguages: languages
        }));
      }
      return result;
    } finally {
      setIsUpdating(false);
    }
  };

  const updateBaseLanguage = async (language) => {
    if (!user) return { success: false, error: 'No user logged in' };
    
    setIsUpdating(true);
    try {
      const result = await firebaseAuthService.updateBaseLanguage(user.uid, language);
      if (result.success) {
        // Update local state
        setUserData(prev => ({
          ...prev,
          baseLanguage: language
        }));
      }
      return result;
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      userData, 
      isAuthenticated, 
      isLoading,
      isUpdating,
      leaderboard,
      login, 
      register,
      logout, 
      updateProfile,
      updateSettings,
      updateLearningLanguages,
      updateBaseLanguage
    }}>
      {children}
    </UserContext.Provider>
  );
};
