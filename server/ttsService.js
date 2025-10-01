// Backend TTS Service for Arabic Pronunciation
const axios = require('axios');
const fs = require('fs');
const path = require('path');

class BackendTTSService {
  constructor() {
    this.cacheDir = path.join(__dirname, 'tts_cache');
    this.ensureCacheDir();
  }

  ensureCacheDir() {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
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

  // Generate cache filename
  getCacheFilename(text, language, options = {}) {
    const hash = require('crypto').createHash('md5').update(text + language + JSON.stringify(options)).digest('hex');
    return `${hash}.mp3`;
  }

  // Check if cached audio exists
  getCachedAudio(text, language, options = {}) {
    const filename = this.getCacheFilename(text, language, options);
    const filepath = path.join(this.cacheDir, filename);
    return fs.existsSync(filepath) ? filepath : null;
  }

  // Save audio to cache
  saveToCache(audioBuffer, text, language, options = {}) {
    const filename = this.getCacheFilename(text, language, options);
    const filepath = path.join(this.cacheDir, filename);
    fs.writeFileSync(filepath, audioBuffer);
    return filepath;
  }

  // Use free TTS API (ResponsiveVoice or similar)
  async generateAudioWithFreeAPI(text, language, options = {}) {
    try {
      // Use ResponsiveVoice API (free tier)
      const responsiveVoiceUrl = 'https://code.responsivevoice.org/getvoice.php';
      
      const params = {
        t: text,
        tl: language === 'arabic' ? 'ar' : language,
        sv: language === 'arabic' ? 'arabic' : 'english',
        v: language === 'arabic' ? 'arabic' : 'english',
        r: options.rate || 1.0,
        p: options.pitch || 1.0,
        vol: options.volume || 1.0,
        key: 'free' // Free tier key
      };

      const response = await axios.get(responsiveVoiceUrl, {
        params,
        responseType: 'arraybuffer',
        timeout: 10000
      });

      return Buffer.from(response.data);
    } catch (error) {
      console.error('Free TTS API error:', error.message);
      throw new Error('Free TTS service unavailable');
    }
  }

  // Use system TTS (fallback)
  async generateAudioWithSystemTTS(text, language, options = {}) {
    return new Promise((resolve, reject) => {
      try {
        const say = require('say');
        
        // Process Arabic text with diacritics
        const processedText = language === 'arabic' ? this.processArabicText(text) : text;
        
        // Generate temporary filename
        const tempFile = path.join(this.cacheDir, `temp_${Date.now()}.wav`);
        
        const voice = language === 'arabic' ? 'Microsoft Hoda Desktop' : 'Microsoft David Desktop';
        
        say.export(processedText, voice, 1.0, tempFile, (err) => {
          if (err) {
            console.error('System TTS error:', err);
            reject(err);
            return;
          }
          
          // Read the generated file
          const audioBuffer = fs.readFileSync(tempFile);
          
          // Clean up temp file
          fs.unlinkSync(tempFile);
          
          resolve(audioBuffer);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Main TTS function
  async generateAudio(text, language = 'english', options = {}) {
    try {
      // Check cache first
      const cachedFile = this.getCachedAudio(text, language, options);
      if (cachedFile) {
        return fs.readFileSync(cachedFile);
      }

      let audioBuffer;
      
      try {
        // Try free TTS API first
        audioBuffer = await this.generateAudioWithFreeAPI(text, language, options);
      } catch (error) {
        console.log('Free TTS failed, trying system TTS...');
        // Fallback to system TTS
        audioBuffer = await this.generateAudioWithSystemTTS(text, language, options);
      }

      // Cache the result
      this.saveToCache(audioBuffer, text, language, options);
      
      return audioBuffer;
    } catch (error) {
      console.error('TTS generation error:', error);
      throw new Error('Unable to generate audio');
    }
  }

  // Get supported languages
  getSupportedLanguages() {
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

module.exports = new BackendTTSService();
