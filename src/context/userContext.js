// src/context/UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import firebaseAuthService from '../services/FirebaseAuthService';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebaseAuthService.onAuthStateChanged((firebaseUser) => {
      console.log('UserContext - Auth state changed:', firebaseUser);
      setUser(firebaseUser);
      setUserData(null); // Simplified - no Firestore user data for now
      setIsAuthenticated(!!firebaseUser);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

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
    return await firebaseAuthService.updateProfile(profileData);
  };

  const updateSettings = async (settings) => {
    return await firebaseAuthService.updateSettings(settings);
  };

  const updateLearningLanguages = async (languages) => {
    return await firebaseAuthService.updateLearningLanguages(languages);
  };

  const updateBaseLanguage = async (language) => {
    return await firebaseAuthService.updateBaseLanguage(language);
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      userData, 
      isAuthenticated, 
      isLoading,
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
