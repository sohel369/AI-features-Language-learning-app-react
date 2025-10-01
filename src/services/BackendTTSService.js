// Backend TTS Service for Arabic Pronunciation
// This service uses the backend server for TTS without requiring Google Cloud Console

class BackendTTSService {
  constructor() {
    this.baseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
    this.isAvailable = true;
  }

  // Check if service is available
  async checkAvailability() {
    try {
      const response = await fetch(`${this.baseUrl}/api/tts/languages`);
      this.isAvailable = response.ok;
      return this.isAvailable;
    } catch (error) {
      console.warn('Backend TTS not available:', error);
      this.isAvailable = false;
      return false;
    }
  }

  // Enhanced Arabic text processing with diacritics
  processArabicText(text) {
    // Enhanced Arabic diacritics mapping for better pronunciation
    const arabicDiacritics = {
      // Common words with proper diacritics
      'السلام': 'السَّلَامُ', 'عليكم': 'عَلَيْكُمْ', 'ورحمة': 'وَرَحْمَةُ',
      'الله': 'اللَّهُ', 'وبركاته': 'وَبَرَكَاتُهُ', 'مرحبا': 'مَرْحَبًا',
      'شكرا': 'شُكْرًا', 'عفوا': 'عَفْوًا', 'نعم': 'نَعَمْ', 'لا': 'لَا',
      'أهلا': 'أَهْلًا', 'وسهلا': 'وَسَهْلًا', 'كيف': 'كَيْفَ', 'حال': 'حَالُ',
      'أنت': 'أَنْتَ', 'أنا': 'أَنَا', 'هو': 'هُوَ', 'هي': 'هِيَ',
      
      // AI Coach specific phrases with full diacritics
      'مرحبا كيف حالك اليوم': 'مَرْحَبًا، كَيْفَ حَالُكَ الْيَوْمَ؟',
      'كيف حالك اليوم': 'كَيْفَ حَالُكَ الْيَوْمَ؟',
      'مرحبا': 'مَرْحَبًا',
      'كيف حالك': 'كَيْفَ حَالُكَ',
      'اليوم': 'الْيَوْمَ',
      
      // Additional common phrases with proper diacritics
      'صباح': 'صَبَاحُ', 'مساء': 'مَسَاءُ', 'الخير': 'الْخَيْرُ',
      'كيف حالك': 'كَيْفَ حَالُكَ', 'أنا بخير': 'أَنَا بِخَيْرٍ',
      'شكرا لك': 'شُكْرًا لَكَ', 'عفوا': 'عَفْوًا', 'مع السلامة': 'مَعَ السَّلَامَةِ',
      'أهلا وسهلا': 'أَهْلًا وَسَهْلًا', 'كيف الحال': 'كَيْفَ الْحَالُ',
      'أنا سعيد': 'أَنَا سَعِيدٌ', 'أنا حزين': 'أَنَا حَزِينٌ',
      'أنا جائع': 'أَنَا جَائِعٌ', 'أنا عطشان': 'أَنَا عَطْشَانٌ',
      'أنا متعب': 'أَنَا مُتْعَبٌ'
    };

    // Process common words first
    let processedText = text;
    Object.keys(arabicDiacritics).forEach(word => {
      const regex = new RegExp(word, 'g');
      processedText = processedText.replace(regex, arabicDiacritics[word]);
    });

    return processedText;
  }

  // Main TTS function
  async speak(text, language = 'english', options = {}) {
    try {
      // Check availability first
      if (!this.isAvailable) {
        await this.checkAvailability();
        if (!this.isAvailable) {
          throw new Error('Backend TTS service not available');
        }
      }

      // Process Arabic text with diacritics
      let processedText = text;
      if (language === 'arabic') {
        processedText = this.processArabicText(text);
      }

      // Prepare request
      const requestBody = {
        text: processedText,
        language: language,
        options: {
          rate: options.rate || (language === 'arabic' ? 0.8 : 1.0),
          pitch: options.pitch || 1.0,
          volume: options.volume || 1.0
        }
      };

      // Make request to backend
      const response = await fetch(`${this.baseUrl}/api/tts/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`TTS request failed: ${response.statusText}`);
      }

      // Get audio blob
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Create and play audio
      const audio = new Audio(audioUrl);
      audio.play();

      // Clean up URL after playing
      audio.onended = () => URL.revokeObjectURL(audioUrl);
      audio.onerror = () => URL.revokeObjectURL(audioUrl);

      return audio;

    } catch (error) {
      console.error('Backend TTS error:', error);
      throw error;
    }
  }

  // Test TTS functionality
  async testTTS(language = 'english') {
    try {
      const testText = language === 'arabic' ? 'مَرْحَبًا، كَيْفَ حَالُكَ الْيَوْمَ؟' : 'Hello, this is a test.';
      return await this.speak(testText, language);
    } catch (error) {
      console.error('TTS test failed:', error);
      throw error;
    }
  }

  // Get supported languages
  async getSupportedLanguages() {
    try {
      const response = await fetch(`${this.baseUrl}/api/tts/languages`);
      if (!response.ok) {
        throw new Error('Failed to get supported languages');
      }
      const data = await response.json();
      return data.languages;
    } catch (error) {
      console.error('Error getting supported languages:', error);
      return {
        english: 'English',
        arabic: 'العربية',
        dutch: 'Nederlands',
        indonesian: 'Bahasa Indonesia',
        malay: 'Bahasa Melayu',
        thai: 'ไทย',
        khmer: 'ខ្មែរ'
      };
    }
  }

  // Check if service is available
  isServiceAvailable() {
    return this.isAvailable;
  }
}

// Create singleton instance
const backendTTSService = new BackendTTSService();

export default backendTTSService;
