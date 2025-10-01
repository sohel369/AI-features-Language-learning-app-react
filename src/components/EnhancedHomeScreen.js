import React, { useState, useEffect } from 'react';
import { Flame, Star, Trophy, Globe, BookOpen, Brain, Target, Settings } from 'lucide-react';
import { INTERFACE_LANGUAGES, TRANSLATIONS } from '../data/languageData';

const EnhancedHomeScreen = ({ user, onLogout, onNavigate }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [userProgress, setUserProgress] = useState({
    xp: 0,
    streak: 0,
    level: 1,
    badges: []
  });
  const [fontSize, setFontSize] = useState('text-base');

  // Get current language with RTL support
  const currentLanguage = INTERFACE_LANGUAGES[selectedLanguage];

  // Translation function
  const t = (key) => {
    return TRANSLATIONS[selectedLanguage]?.[key] || TRANSLATIONS.english[key] || key;
  };

  return (
    <div className={`space-y-6 ${currentLanguage.rtl ? 'rtl' : 'ltr'}`} dir={currentLanguage.rtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className={`font-bold mb-1 ${fontSize === 'text-sm' ? 'text-xl' : fontSize === 'text-lg' ? 'text-2xl' : 'text-3xl'}`}>
              {t('welcomeBack')}
            </h1>
            <p className="text-blue-200">{t('readyToContinue')}</p>
          </div>
          <button
            onClick={() => onNavigate('settings')}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            aria-label="Open settings"
          >
            <Settings size={20} />
          </button>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Flame className="text-orange-400 mr-1" size={20} />
              <span className="font-bold text-lg">{userProgress.streak}</span>
            </div>
            <p className="text-sm text-blue-200">{t('dayStreak')}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="text-yellow-400 mr-1" size={20} />
              <span className="font-bold text-lg">{userProgress.xp}</span>
            </div>
            <p className="text-sm text-blue-200">{t('totalXP')}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Trophy className="text-purple-400 mr-1" size={20} />
              <span className="font-bold text-lg">{userProgress.level}</span>
            </div>
            <p className="text-sm text-blue-200">{t('level')}</p>
          </div>
        </div>
      </div>

      {/* Language Selection */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6">
        <h2 className={`font-bold text-white mb-4 flex items-center ${fontSize === 'text-sm' ? 'text-lg' : fontSize === 'text-lg' ? 'text-xl' : 'text-2xl'}`}>
          <Globe className="mr-2" size={20} />
          {t('selectLanguage')}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(INTERFACE_LANGUAGES).map(([key, lang]) => (
            <button
              key={key}
              onClick={() => setSelectedLanguage(key)}
              className={`p-4 rounded-xl border-2 transition-all ${selectedLanguage === key
                ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500'
                }`}
              aria-pressed={selectedLanguage === key}
            >
              <div className="text-2xl mb-2">{lang.flag}</div>
              <div className={`font-medium ${fontSize}`}>{lang.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onNavigate('lessons')}
          className="bg-gradient-to-br from-green-800 to-green-900 rounded-xl p-4 text-white hover:from-green-700 hover:to-green-800 transition-all"
        >
          <BookOpen className="mx-auto mb-2" size={24} />
          <div className={`font-medium ${fontSize}`}>{t('continueLesson')}</div>
        </button>
        <button
          onClick={() => onNavigate('ai-coach')}
          className="bg-gradient-to-br from-purple-800 to-pink-900 rounded-xl p-4 text-white hover:from-purple-700 hover:to-pink-800 transition-all"
        >
          <Brain className="mx-auto mb-2" size={24} />
          <div className={`font-medium ${fontSize}`}>{t('aiCoach')}</div>
        </button>
      </div>

      {/* Additional Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={() => onNavigate('quiz')}
          className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl p-4 text-white hover:from-blue-700 hover:to-blue-800 transition-all"
        >
          <Target className="mx-auto mb-2" size={24} />
          <div className={`font-medium text-sm ${fontSize}`}>{t('quizChallenge')}</div>
        </button>
        <button
          onClick={() => onNavigate('tts-input')}
          className="bg-gradient-to-br from-orange-800 to-orange-900 rounded-xl p-4 text-white hover:from-orange-700 hover:to-orange-800 transition-all"
        >
          <div className="mx-auto mb-2 text-2xl">🎤</div>
          <div className={`font-medium text-sm ${fontSize}`}>{t('ttsInput')}</div>
        </button>
        <button
          onClick={() => onNavigate('teacher')}
          className="bg-gradient-to-br from-red-800 to-red-900 rounded-xl p-4 text-white hover:from-red-700 hover:to-red-800 transition-all"
        >
          <div className="mx-auto mb-2 text-2xl">👩‍🏫</div>
          <div className={`font-medium text-sm ${fontSize}`}>{t('liveTeacherSupport')}</div>
        </button>
      </div>
    </div>
  );
};

export default EnhancedHomeScreen;
