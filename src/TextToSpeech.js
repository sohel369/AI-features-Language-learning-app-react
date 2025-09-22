// Enhanced Text-to-Speech with Google TTS and Arabic vowel support
import googleTTSService from './services/GoogleTTSService';

// Language mapping for better voice selection
const LANGUAGE_MAP = {
  english: 'en-US',
  arabic: 'ar-SA',
  french: 'fr-FR',
  spanish: 'es-ES',
  dutch: 'nl-NL',
  indonesian: 'id-ID',
  malay: 'ms-MY',
  thai: 'th-TH',
  khmer: 'km-KH'
};

// Enhanced speakText function with Google TTS support
const speakText = async (text, language = "english", options = {}) => {
  try {
    // Use Google TTS service if available
    if (googleTTSService.isAvailable()) {
      return await googleTTSService.speak(text, language, options);
    }
    
    // Fallback to Web Speech API
    return fallbackToWebSpeech(text, language, options);
  } catch (error) {
    console.error('TTS Error:', error);
    return fallbackToWebSpeech(text, language, options);
  }
};

// Simple Arabic helpers for diacritics when using Web Speech fallback
const hasArabicDiacritics = (input) => /[\u064B-\u0652\u0670\u0640]/.test(input);
const applyBasicArabicDiacritics = (input) => {
  // Common phrase replacements to improve pronunciation
  const common = {
    'السلام عليكم': 'السَّلَامُ عَلَيْكُمْ',
    'ورحمة الله وبركاته': 'وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ',
    'مرحبا': 'مَرْحَبًا',
    'أهلا وسهلا': 'أَهْلًا وَسَهْلًا',
    'شكرا': 'شُكْرًا',
    'عفوا': 'عَفْوًا',
    'نعم': 'نَعَمْ',
    'لا': 'لَا',
    'كيف حالك': 'كَيْفَ حَالُكَ',
    'أنا بخير': 'أَنَا بِخَيْرٍ',
    'مع السلامة': 'مَعَ السَّلَامَةِ'
  };
  let out = input;
  Object.keys(common).forEach(key => { out = out.replace(new RegExp(key, 'g'), common[key]); });
  if (hasArabicDiacritics(out)) return out;
  // Add basic fatha to bare Arabic letters as a light aid (very naive)
  return out.split('').map(ch => (/^[\u0600-\u06FF]$/.test(ch) ? ch + '\u064E' : ch)).join('');
};

// Wait until voices are loaded in the browser
const waitForVoices = () => new Promise((resolve) => {
  const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  if (voices && voices.length > 0) {
    resolve(voices);
    return;
  }
  const id = setInterval(() => {
    const list = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    if (list && list.length > 0) {
      clearInterval(id);
      resolve(list);
    }
  }, 100);
  setTimeout(() => {
    clearInterval(id);
    resolve(window.speechSynthesis ? window.speechSynthesis.getVoices() : []);
  }, 2000);
});

// Fallback to Web Speech API with enhanced voice selection
const fallbackToWebSpeech = (text, language, options = {}) => {
  if (!('speechSynthesis' in window)) {
    console.error('Speech synthesis not supported');
    return null;
  }

  // If Arabic, lightly enrich text with diacritics for better vowels
  const languageCode = LANGUAGE_MAP[language] || 'en-US';
  const processedText = languageCode === 'ar-SA' ? applyBasicArabicDiacritics(String(text || '')) : text;

  const utterance = new SpeechSynthesisUtterance(processedText);
  
  utterance.lang = languageCode;
  utterance.rate = options.rate || 0.8;
  utterance.pitch = options.pitch || 1.0;
  utterance.volume = options.volume || 1.0;

  // Enhanced voice selection for better quality
  waitForVoices().then((voices) => {
    // Prefer exact lang match, then any Arabic voice if Arabic requested
    let preferredVoice = voices.find(v => v.lang === languageCode && (v.name.includes('Google') || v.name.includes('Neural') || v.name.includes('Wavenet') || v.name.includes('Standard')));
    if (!preferredVoice && languageCode === 'ar-SA') {
      preferredVoice = voices.find(v => v.lang?.toLowerCase().startsWith('ar')) || null;
    }
    if (!preferredVoice) {
      preferredVoice = voices.find(v => v.lang === languageCode) || null;
    }
    if (preferredVoice) utterance.voice = preferredVoice;
    speechSynthesis.speak(utterance);
  }).catch(() => {
    speechSynthesis.speak(utterance);
  });
  return utterance;
};

// Initialize Google TTS service
googleTTSService.initialize();

export default speakText;
