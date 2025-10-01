import React, { useState, useEffect } from 'react';
import { Globe, Edit3, Check, X } from 'lucide-react';
import authService from '../services/AuthService';

const INTERFACE_LANGUAGES = {
  english: { name: 'English', flag: '🇺🇸', rtl: false },
  arabic: { name: 'العربية', flag: '🇸🇦', rtl: true },
  dutch: { name: 'Nederlands', flag: '🇳🇱', rtl: false },
  indonesian: { name: 'Bahasa Indonesia', flag: '🇮🇩', rtl: false },
  malay: { name: 'Bahasa Melayu', flag: '🇲🇾', rtl: false },
  thai: { name: 'ไทย', flag: '🇹🇭', rtl: false },
  khmer: { name: 'ខ្មែរ', flag: '🇰🇭', rtl: false }
};

const LEARNING_LANGUAGES = {
  english: { name: 'English', flag: '🇺🇸' },
  arabic: { name: 'العربية', flag: '🇸🇦' },
  dutch: { name: 'Nederlands', flag: '🇳🇱' },
  indonesian: { name: 'Bahasa Indonesia', flag: '🇮🇩' },
  malay: { name: 'Bahasa Melayu', flag: '🇲🇾' },
  thai: { name: 'ไทย', flag: '🇹🇭' },
  khmer: { name: 'ខ្មែរ', flag: '🇰🇭' }
};

const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'KH', name: 'Cambodia', flag: '🇰🇭' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' }
];

const CEFR_LEVELS = [
  { code: 'A1', name: 'A1 - Beginner', description: 'Basic user' },
  { code: 'A2', name: 'A2 - Elementary', description: 'Basic user' },
  { code: 'B1', name: 'B1 - Intermediate', description: 'Independent user' },
  { code: 'B2', name: 'B2 - Upper Intermediate', description: 'Independent user' },
  { code: 'C1', name: 'C1 - Advanced', description: 'Proficient user' },
  { code: 'C2', name: 'C2 - Mastery', description: 'Proficient user' }
];

export default function ProfileLanguageSettings() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState('');

  // Form states
  const [profileData, setProfileData] = useState({
    displayName: '',
    country: '',
    learningLanguage: '',
    cefrLevel: '',
    nativeLanguage: '',
    interfaceLanguage: 'english'
  });

  const [tempData, setTempData] = useState({
    displayName: '',
    country: '',
    learningLanguage: '',
    cefrLevel: '',
    nativeLanguage: '',
    interfaceLanguage: 'english'
  });

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user, userData) => {
      if (user && userData) {
        setUserData(userData);
        const data = {
          displayName: userData.displayName || '',
          country: userData.country || '',
          learningLanguage: userData.learningLanguage || '',
          cefrLevel: userData.cefrLevel || '',
          nativeLanguage: userData.nativeLanguage || '',
          interfaceLanguage: userData.interfaceLanguage || 'english'
        };
        setProfileData(data);
        setTempData(data);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await authService.updateUserProfile(tempData);
      setProfileData(tempData);
      setIsEditing(false);
      setNotification('✅ Settings saved successfully!');
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setNotification('❌ Error saving settings');
      setTimeout(() => setNotification(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  // Auto-save function for immediate changes
  const handleAutoSave = async (data) => {
    try {
      await authService.updateUserProfile(data);
    } catch (error) {
      console.error('Error auto-saving:', error);
    }
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
  };

  const handleInterfaceLanguageChange = async (languageCode) => {
    const newData = { ...tempData, interfaceLanguage: languageCode };
    setTempData(newData);
    setProfileData(newData);
    
    // Auto-save the language change
    try {
      await authService.updateUserProfile(newData);
      setNotification('✅ Language changed successfully!');
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      console.error('Error saving language change:', error);
      setNotification('❌ Error changing language');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Globe className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Language Settings</h3>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center space-x-2 self-start sm:self-auto"
        >
          <Edit3 className="w-4 h-4" />
          <span>{isEditing ? 'Cancel' : 'Edit'}</span>
        </button>
      </div>

      {/* User Profile Information */}
      <div className="space-y-4 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
            {isEditing ? (
              <input
                type="text"
                value={tempData.displayName}
                onChange={(e) => setTempData(prev => ({ ...prev, displayName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter your display name"
              />
            ) : (
              <p className="text-gray-900 py-2">{profileData.displayName || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country/Region</label>
            {isEditing ? (
              <select
                value={tempData.country}
                onChange={(e) => setTempData(prev => ({ ...prev, country: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select country</option>
                {COUNTRIES.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-gray-900 py-2">
                {profileData.country ? COUNTRIES.find(c => c.code === profileData.country)?.name || 'Not set' : 'Not set'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Learning Language</label>
            {isEditing ? (
              <select
                value={tempData.learningLanguage}
                onChange={(e) => setTempData(prev => ({ ...prev, learningLanguage: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select learning language</option>
                {Object.entries(LEARNING_LANGUAGES).map(([code, lang]) => (
                  <option key={code} value={code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-gray-900 py-2">
                {profileData.learningLanguage ? LEARNING_LANGUAGES[profileData.learningLanguage]?.name || 'Not set' : 'Not set'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CEFR Level</label>
            {isEditing ? (
              <select
                value={tempData.cefrLevel}
                onChange={(e) => setTempData(prev => ({ ...prev, cefrLevel: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select CEFR level</option>
                {CEFR_LEVELS.map(level => (
                  <option key={level.code} value={level.code}>
                    {level.name} - {level.description}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-gray-900 py-2">
                {profileData.cefrLevel ? CEFR_LEVELS.find(l => l.code === profileData.cefrLevel)?.name || 'Not set' : 'Not set'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Native Language</label>
            {isEditing ? (
              <select
                value={tempData.nativeLanguage}
                onChange={(e) => setTempData(prev => ({ ...prev, nativeLanguage: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select native language</option>
                {Object.entries(LEARNING_LANGUAGES).map(([code, lang]) => (
                  <option key={code} value={code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-gray-900 py-2">
                {profileData.nativeLanguage ? LEARNING_LANGUAGES[profileData.nativeLanguage]?.name || 'Not set' : 'Not set'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Interface Language Selection */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-4">Interface Language</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {Object.entries(INTERFACE_LANGUAGES).map(([code, lang]) => (
            <button
              key={code}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleInterfaceLanguageChange(code);
              }}
              className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center space-x-2 ${
                tempData.interfaceLanguage === code
                  ? 'border-green-500 bg-green-500 text-white shadow-lg transform scale-105'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 hover:scale-102'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="text-sm font-medium truncate">{lang.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Save/Cancel Buttons */}
      {isEditing && (
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </div>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <Check className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}
    </div>
  );
}
