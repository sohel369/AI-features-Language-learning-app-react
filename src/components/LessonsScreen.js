import React, { useState } from 'react';
import { BookOpen, Volume2, Star, Trophy } from 'lucide-react';
import { VOCABULARY, INTERFACE_LANGUAGES, TRANSLATIONS } from '../data/languageData';

const LessonsScreen = ({ selectedLanguage, onSpeakText }) => {
  const [activeTab, setActiveTab] = useState('english');
  const [fontSize, setFontSize] = useState('text-base');

  // Get current language with RTL support
  const currentLanguage = INTERFACE_LANGUAGES[selectedLanguage];

  // Translation function
  const t = (key) => {
    return TRANSLATIONS[selectedLanguage]?.[key] || TRANSLATIONS.english[key] || key;
  };

  // Get vocabulary for the active learning language
  const vocab = VOCABULARY.beginner[activeTab] || VOCABULARY.beginner.english;

  return (
    <div className={`space-y-6 ${currentLanguage.rtl ? 'rtl' : 'ltr'}`} dir={currentLanguage.rtl ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <h1 className={`font-bold text-white ${fontSize === 'text-sm' ? 'text-xl' : fontSize === 'text-lg' ? 'text-2xl' : 'text-3xl'}`}>
          {t('lessons')}
        </h1>
        <div className="text-blue-400 font-medium">{t('level')} 1</div>
      </div>

      {/* Language Tabs */}
      <div className="bg-slate-800/50 rounded-xl p-1">
        <div className="flex space-x-1">
          {['english', 'arabic'].map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveTab(lang)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${activeTab === lang
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg">{INTERFACE_LANGUAGES[lang]?.flag}</span>
                <span>{INTERFACE_LANGUAGES[lang]?.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-slate-800 rounded-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-300">{t('courseProgress')}</span>
          <span className="text-blue-400 font-medium">65%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300" style={{ width: '65%' }}></div>
        </div>
      </div>

      {/* Lesson Categories */}
      {['Beginner', 'Intermediate', 'Advanced'].map((level) => {
        const levelKey = level.toLowerCase() + 'Level';
        const levelVocab = VOCABULARY[level.toLowerCase()][activeTab] || VOCABULARY[level.toLowerCase()].english;
        return (
          <div key={level} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className={`font-bold text-white ${fontSize}`}>{t(levelKey)}</h3>
              <span className="text-xs text-slate-400">{levelVocab?.length || 0} words</span>
            </div>

            <div className="space-y-2">
              {levelVocab?.slice(0, 3).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                  onClick={() => onSpeakText && onSpeakText(item.word, activeTab)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => e.key === 'Enter' && onSpeakText && onSpeakText(item.word, activeTab)}
                >
                  <div>
                    <div className={`font-medium text-white ${fontSize}`}>{item.word}</div>
                    <div className={`text-sm text-slate-400 ${currentLanguage.rtl ? 'text-right' : 'text-left'}`}>
                      {item.translation}
                    </div>
                  </div>
                  <button
                    onClick={() => onSpeakText && onSpeakText(item.word, activeTab)}
                    className="text-blue-400 hover:text-blue-300"
                    aria-label={`Play pronunciation for ${item.word}`}
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LessonsScreen;
