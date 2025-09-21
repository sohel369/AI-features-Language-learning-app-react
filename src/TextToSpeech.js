// Enhanced Text-to-Speech with Google TTS and Arabic vowel support
import googleTTSService from './services/GoogleTTSService';

// Language mapping for better voice selection
const LANGUAGE_MAP = {
  english: 'en-US',
  arabic: 'ar-SA',
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

// Fallback to Web Speech API with enhanced voice selection
const fallbackToWebSpeech = (text, language, options = {}) => {
  if (!('speechSynthesis' in window)) {
    console.error('Speech synthesis not supported');
    return null;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  const languageCode = LANGUAGE_MAP[language] || 'en-US';
  
  utterance.lang = languageCode;
  utterance.rate = options.rate || 0.8;
  utterance.pitch = options.pitch || 1.0;
  utterance.volume = options.volume || 1.0;

  // Enhanced voice selection for better quality
  const voices = speechSynthesis.getVoices();
  const preferredVoice = voices.find(voice => {
    const isCorrectLanguage = voice.lang === languageCode;
    const isGoogleVoice = voice.name.includes('Google') || voice.name.includes('Neural');
    const isHighQuality = voice.name.includes('Wavenet') || voice.name.includes('Standard');
    
    return isCorrectLanguage && (isGoogleVoice || isHighQuality);
  });

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  speechSynthesis.speak(utterance);
  return utterance;
};

// Initialize Google TTS service
googleTTSService.initialize();

export default speakText;
