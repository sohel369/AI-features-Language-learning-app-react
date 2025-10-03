// Language Selection Component for first-time users
import React, { useState } from 'react';
import { Check, Globe, ArrowRight } from 'lucide-react';

const LANGUAGES = {
  english: { name: 'English', flag: '🇺🇸', rtl: false },
  arabic: { name: 'العربية', flag: '🇸🇦', rtl: true },
  dutch: { name: 'Nederlands', flag: '🇳🇱', rtl: false },
  indonesian: { name: 'Bahasa Indonesia', flag: '🇮🇩', rtl: false },
  malay: { name: 'Bahasa Melayu', flag: '🇲🇾', rtl: false },
  thai: { name: 'ไทย', flag: '🇹🇭', rtl: false },
  khmer: { name: 'ខ្មែរ', flag: '🇰🇭', rtl: false }
};

const LanguageSelection = ({ onLanguageSelected, isLoading = false }) => {
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [baseLanguage, setBaseLanguage] = useState('english');

  const handleLanguageToggle = (language) => {
    if (selectedLanguages.includes(language)) {
      setSelectedLanguages(selectedLanguages.filter(lang => lang !== language));
    } else {
      setSelectedLanguages([...selectedLanguages, language]);
    }
  };

  const handleContinue = () => {
    if (selectedLanguages.length > 0) {
      onLanguageSelected({
        learningLanguages: selectedLanguages,
        baseLanguage: baseLanguage
      });
    }
  };

  const canContinue = selectedLanguages.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Welcome to LinguaAI
          </h1>
          <p className="text-slate-400">
            Choose the languages you want to learn
          </p>
        </div>

        {/* Base Language Selection */}
        <div className="mb-8">
          <h3 className="text-white font-medium mb-4">App Interface Language</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(LANGUAGES).map(([key, lang]) => (
              <button
                key={key}
                onClick={() => setBaseLanguage(key)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  baseLanguage === key
                    ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                    : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="text-2xl mb-2">{lang.flag}</div>
                <div className="font-medium">{lang.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Learning Languages Selection */}
        <div className="mb-8">
          <h3 className="text-white font-medium mb-4">What do you want to learn?</h3>
          <p className="text-slate-400 text-sm mb-4">
            You can select multiple languages to learn
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(LANGUAGES).map(([key, lang]) => (
              <button
                key={key}
                onClick={() => handleLanguageToggle(key)}
                className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                  selectedLanguages.includes(key)
                    ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                    : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{lang.flag}</div>
                  <div className="font-medium">{lang.name}</div>
                </div>
                {selectedLanguages.includes(key) && (
                  <Check className="w-5 h-5 text-blue-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!canContinue || isLoading}
          className={`w-full py-4 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 ${
            canContinue && !isLoading
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500'
              : 'bg-slate-600 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>Setting up...</span>
            </>
          ) : (
            <>
              <span>Continue</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        {/* Info */}
        <div className="mt-6 p-4 bg-slate-700/30 rounded-lg">
          <p className="text-slate-400 text-sm text-center">
            You can change these settings later in your profile
          </p>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;
