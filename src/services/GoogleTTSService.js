// Google Cloud Text-to-Speech Service
// This service provides high-quality TTS with proper Arabic vowel support

class GoogleTTSService {
  constructor() {
    this.apiKey = process.env.REACT_APP_GOOGLE_TTS_API_KEY;
    this.baseUrl = 'https://texttospeech.googleapis.com/v1';
    this.voices = new Map();
    this.isInitialized = false;
  }

  // Initialize the service and load available voices
  async initialize() {
    if (this.isInitialized) return;
    
    try {
      await this.loadVoices();
      this.isInitialized = true;
    } catch (error) {
      console.warn('Google TTS not available, falling back to Web Speech API:', error);
      this.isInitialized = false;
    }
  }

  // Load available voices from Google TTS API
  async loadVoices() {
    if (!this.apiKey) {
      throw new Error('Google TTS API key not configured');
    }

    const response = await fetch(`${this.baseUrl}/voices?key=${this.apiKey}`);
    if (!response.ok) {
      throw new Error(`Failed to load voices: ${response.statusText}`);
    }

    const data = await response.json();
    data.voices.forEach(voice => {
      if (!this.voices.has(voice.languageCodes[0])) {
        this.voices.set(voice.languageCodes[0], []);
      }
      this.voices.get(voice.languageCodes[0]).push(voice);
    });
  }

  // Language mapping for better voice selection
  getLanguageCode(language) {
    const languageMap = {
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
    return languageMap[language] || 'en-US';
  }

  // Get the best voice for a language
  getBestVoice(languageCode) {
    const voices = this.voices.get(languageCode) || [];
    
    // Prefer Google voices with specific characteristics
    const preferredVoices = voices.filter(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Neural') ||
      voice.name.includes('Wavenet')
    );

    if (preferredVoices.length > 0) {
      return preferredVoices[0];
    }

    return voices[0] || null;
  }

  // Enhanced text processing for Arabic with diacritics
  processArabicText(text) {
    // Check if text already has diacritics
    if (this.hasDiacritics(text)) {
      return text; // Return as-is if diacritics are present
    }

    // Enhanced Arabic diacritics mapping for better pronunciation
    const arabicDiacritics = {
      // Basic letters with fatha (َ)
      'ا': 'اَ', 'ب': 'بَ', 'ت': 'تَ', 'ث': 'ثَ', 'ج': 'جَ', 'ح': 'حَ', 'خ': 'خَ',
      'د': 'دَ', 'ذ': 'ذَ', 'ر': 'رَ', 'ز': 'زَ', 'س': 'سَ', 'ش': 'شَ', 'ص': 'صَ',
      'ض': 'ضَ', 'ط': 'طَ', 'ظ': 'ظَ', 'ع': 'عَ', 'غ': 'غَ', 'ف': 'فَ', 'ق': 'قَ',
      'ك': 'كَ', 'ل': 'لَ', 'م': 'مَ', 'ن': 'نَ', 'ه': 'هَ', 'و': 'وَ', 'ي': 'يَ',
      
      // Common words with proper diacritics
      'السلام': 'السَّلَامُ', 'عليكم': 'عَلَيْكُمْ', 'ورحمة': 'وَرَحْمَةُ',
      'الله': 'اللَّهُ', 'وبركاته': 'وَبَرَكَاتُهُ', 'مرحبا': 'مَرْحَبًا',
      'شكرا': 'شُكْرًا', 'عفوا': 'عَفْوًا', 'نعم': 'نَعَمْ', 'لا': 'لَا',
      'أهلا': 'أَهْلًا', 'وسهلا': 'وَسَهْلًا', 'كيف': 'كَيْفَ', 'حال': 'حَالُ',
      'أنت': 'أَنْتَ', 'أنا': 'أَنَا', 'هو': 'هُوَ', 'هي': 'هِيَ',
      
      // Additional common phrases with proper diacritics
      'صباح': 'صَبَاحُ', 'مساء': 'مَسَاءُ', 'الخير': 'الْخَيْرُ',
      'كيف حالك': 'كَيْفَ حَالُكَ', 'أنا بخير': 'أَنَا بِخَيْرٍ',
      'شكرا لك': 'شُكْرًا لَكَ', 'عفوا': 'عَفْوًا', 'مع السلامة': 'مَعَ السَّلَامَةِ',
      'أهلا وسهلا': 'أَهْلًا وَسَهْلًا', 'كيف الحال': 'كَيْفَ الْحَالُ',
      'أنا سعيد': 'أَنَا سَعِيدٌ', 'أنا حزين': 'أَنَا حَزِينٌ',
      'أنا جائع': 'أَنَا جَائِعٌ', 'أنا عطشان': 'أَنَا عَطْشَانٌ',
      'أنا متعب': 'أَنَا مُتْعَبٌ', 'أنا سعيد': 'أَنَا سَعِيدٌ'
    };

    // Process common words first
    let processedText = text;
    Object.keys(arabicDiacritics).forEach(word => {
      const regex = new RegExp(word, 'g');
      processedText = processedText.replace(regex, arabicDiacritics[word]);
    });

    // For remaining characters, add basic fatha if they don't have diacritics
    processedText = processedText.split('').map(char => {
      if (arabicDiacritics[char]) {
        return arabicDiacritics[char];
      }
      // Add fatha to Arabic letters that don't have diacritics
      if (/[\u0600-\u06FF]/.test(char) && !this.hasDiacritics(char)) {
        return char + '\u064E'; // Add fatha
      }
      return char;
    }).join('');

    return processedText;
  }

  // Process Thai text for better pronunciation
  processThaiText(text) {
    // Thai doesn't need diacritics processing like Arabic, but we can add tone markers
    // This is a simplified approach - in production you'd want more sophisticated processing
    return text;
  }

  // Process Khmer text for better pronunciation
  processKhmerText(text) {
    // Khmer doesn't need diacritics processing like Arabic, but we can add vowel markers
    // This is a simplified approach - in production you'd want more sophisticated processing
    return text;
  }

  // Check if Arabic text has diacritics
  hasDiacritics(text) {
    const diacriticPattern = /[\u064B-\u0652\u0670\u0640]/;
    return diacriticPattern.test(text);
  }

  // Main TTS function with Google Cloud API
  async speak(text, language = 'english', options = {}) {
    try {
      // Initialize if not done
      if (!this.isInitialized) {
        await this.initialize();
      }

      // If Google TTS is not available, fall back to Web Speech API
      if (!this.isInitialized || !this.apiKey) {
        return this.fallbackToWebSpeech(text, language, options);
      }

      const languageCode = this.getLanguageCode(language);
      const voice = this.getBestVoice(languageCode);
      
      if (!voice) {
        throw new Error(`No voice available for language: ${languageCode}`);
      }

      // Process text for better pronunciation
      let processedText = text;
      if (languageCode === 'ar-SA') {
        processedText = this.processArabicText(text);
      } else if (languageCode === 'th-TH') {
        processedText = this.processThaiText(text);
      } else if (languageCode === 'km-KH') {
        processedText = this.processKhmerText(text);
      }

      // Prepare the request
      const requestBody = {
        input: { text: processedText },
        voice: {
          languageCode: languageCode,
          name: voice.name,
          ssmlGender: voice.ssmlGender || 'NEUTRAL'
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: options.rate || 1.0,
          pitch: options.pitch || 0.0,
          volumeGainDb: options.volume || 0.0
        }
      };

      // Make the API request
      const response = await fetch(`${this.baseUrl}/text:synthesize?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`TTS API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Play the audio
      const audioData = data.audioContent;
      const audioBlob = new Blob([Uint8Array.from(atob(audioData), c => c.charCodeAt(0))], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audio.play();

      // Clean up the URL after playing
      audio.onended = () => URL.revokeObjectURL(audioUrl);

      return audio;

    } catch (error) {
      console.error('Google TTS error:', error);
      return this.fallbackToWebSpeech(text, language, options);
    }
  }

  // Fallback to Web Speech API
  fallbackToWebSpeech(text, language, options = {}) {
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported');
      return null;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const languageCode = this.getLanguageCode(language);
    
    utterance.lang = languageCode;
    utterance.rate = options.rate || 0.8;
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = options.volume || 1.0;

    // Try to find a good voice
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang === languageCode && 
      (voice.name.includes('Google') || voice.name.includes('Neural'))
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    speechSynthesis.speak(utterance);
    return utterance;
  }

  // Get available voices for a language
  getAvailableVoices(language) {
    const languageCode = this.getLanguageCode(language);
    return this.voices.get(languageCode) || [];
  }

  // Check if service is available
  isAvailable() {
    return this.isInitialized && this.apiKey;
  }
}

// Create singleton instance
const googleTTSService = new GoogleTTSService();

export default googleTTSService;
