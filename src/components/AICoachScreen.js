import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Mic, 
  MicOff, 
  MessageCircle, 
  Send, 
  X, 
  Star,
  Bot,
  Sparkles,
  Lightbulb,
  GraduationCap,
  Languages,
  Flag,
  MapPin,
  Heart,
  Gift,
  Shield,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Edit3,
  Save,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  Menu,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  MoreVertical,
  ExternalLink,
  Copy,
  Share2,
  Mail,
  Phone,
  Map,
  Navigation,
  Compass,
  MapPin as Location,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Timer,
  Stopwatch,
  Hourglass,
  Activity,
  Pulse,
  Heart as HeartIcon,
  Battery,
  Wifi,
  Signal,
  WifiOff,
  SignalZero,
  SignalLow,
  SignalMedium,
  SignalHigh,
  SignalMax
} from 'lucide-react';

const AICoachScreen = ({ t, selectedLanguage, speakText, fontSize }) => {
  const [learningLanguage, setLearningLanguage] = useState(null); // null = not selected yet
  const [pronunciationScore, setPronunciationScore] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [expectedText, setExpectedText] = useState('Hello, how are you?');
  const [liveTranscript, setLiveTranscript] = useState('');
  const [grammarCorrections, setGrammarCorrections] = useState([]);
  const [pronunciationFeedback, setPronunciationFeedback] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState('english');
  const recognitionRef = useRef(null);
  const isRecordingRef = useRef(false);

  // Initialize chat when language is selected
  const initializeChat = (language) => {
    setLearningLanguage(language);
    const welcomeMessages = {
      english: [
        { type: 'ai', message: 'Hello! I\'m your AI language coach. I\'ll help you learn English. What would you like to practice today?' },
        { type: 'ai', message: 'I can help you with:\n• Grammar and vocabulary\n• Pronunciation practice\n• Conversation practice\n• Writing exercises\n\nJust type your message or use voice input!' }
      ],
      arabic: [
        { type: 'ai', message: 'مرحباً! أنا مدربك الذكي للغة. سأساعدك في تعلم العربية. ماذا تريد أن تتدرب عليه اليوم؟' },
        { type: 'ai', message: 'يمكنني مساعدتك في:\n• القواعد والمفردات\n• ممارسة النطق\n• ممارسة المحادثة\n• تمارين الكتابة\n\nاكتب رسالتك أو استخدم الإدخال الصوتي!' }
      ]
    };
    setChatMessages(welcomeMessages[language] || welcomeMessages.english);
  };

  // Auto language detection function
  const detectLanguage = (text) => {
    // Check for Arabic characters (including diacritics)
    if (/[\u0600-\u06FF]/.test(text)) {
      return 'arabic';
    }
    // Check for Thai characters
    if (/[\u0E00-\u0E7F]/.test(text)) {
      return 'thai';
    }
    // Check for Khmer characters
    if (/[\u1780-\u17FF]/.test(text)) {
      return 'khmer';
    }
    // Default to English (also covers Dutch, Indonesian, Malay as they use Latin alphabet)
    return 'english';
  };

  // Levenshtein distance for pronunciation similarity
  const levenshteinDistance = (str1, str2) => {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[str2.length][str1.length];
  };

  const similarity = (str1, str2) => {
    const distance = levenshteinDistance(str1, str2);
    const maxLen = Math.max(str1.length, str2.length);
    return maxLen === 0 ? 1 : 1 - distance / maxLen;
  };

  // Grammar checker extended for multiple languages
  const checkGrammar = (text) => {
    const corrections = [];
    const lowerText = text.toLowerCase();

    const rules = {
      english: [
        { pattern: /i is/gi, correction: 'I am', note: 'Use "I am" for first-person singular.' },
        { pattern: /dont/gi, correction: "don't", note: "Use contraction 'don't' for 'do not'." }
      ],
      arabic: [
        { pattern: /مرحبا/gi, correction: 'مَرْحَبًا', note: 'Add correct vowel markings for proper pronunciation.' }
      ],
      dutch: [
        { pattern: /ik is/gi, correction: 'ik ben', note: 'Use "ik ben" for first-person singular.' }
      ],
      // Add for other languages...
      indonesian: [
        { pattern: /saya adalah/gi, correction: 'saya', note: 'Simplify to "saya" in casual speech.' }
      ],
      malay: [
        { pattern: /saya adalah/gi, correction: 'saya', note: 'Simplify to "saya" in casual speech.' }
      ],
      thai: [
        { pattern: /สวัสดี/gi, correction: 'สวัสดีครับ/ค่ะ', note: 'Add polite particles for proper greeting.' }
      ],
      khmer: [
        { pattern: /សួស្តី/gi, correction: 'សួស្តីជូនពរ', note: 'Add respectful ending for proper greeting.' }
      ]
    };

    const langRules = rules[selectedLanguage] || rules.english;
    langRules.forEach(rule => {
      if (rule.pattern.test(text)) {
        corrections.push({
          error: text.match(rule.pattern)[0],
          correction: text.replace(rule.pattern, rule.correction),
          note: rule.note
        });
      }
    });

    return corrections;
  };

  // Simulated phoneme-level pronunciation analysis
  const analyzePronunciation = (transcript) => {
    const sim = similarity(transcript.toLowerCase(), expectedText.toLowerCase());
    const score = Math.round(sim * 100);
    let feedback = '';
    if (score > 90) feedback = 'Excellent pronunciation!';
    else if (score > 70) feedback = 'Good job, but focus on clearer enunciation.';
    else feedback = 'Needs improvement. Try emphasizing each syllable.';

    // Mock phoneme feedback based on language
    let phonemeFeedback = '';
    if (selectedLanguage === 'english') {
      phonemeFeedback = transcript.toLowerCase().includes('hello')
        ? 'Great stress on "hello".'
        : 'Work on stressing the first syllable in "hello".';
    } else if (selectedLanguage === 'arabic') {
      phonemeFeedback = transcript.includes('مَرْحَبًا') ? 'Good use of diacritics in pronunciation.' : 'Focus on the harakat (vowels) for clarity.';
    } // Extend for other languages

    return { score, feedback, phonemeFeedback };
  };

  useEffect(() => {
    // Set expected text based on selected language with vowels for Arabic
    const expectedTexts = {
      english: 'Hello, how are you today?',
      arabic: 'مَرْحَبًا، كَيْفَ حَالُكَ الْيَوْمَ؟', // With full diacritics
      dutch: 'Hallo, hoe gaat het vandaag?',
      indonesian: 'Halo, apa kabar hari ini?',
      malay: 'Hello, apa khabar hari ini?',
      thai: 'สวัสดี คุณสบายดีไหมวันนี้?',
      khmer: 'សួស្តី អ្នកសប្បាយជាដើម្បីទេថ្ងៃនេះ?'
    };
    setExpectedText(expectedTexts[selectedLanguage] || expectedTexts.english);

    // Initialize SpeechRecognition with language support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      const langMap = {
        arabic: 'ar-SA',
        dutch: 'nl-NL',
        indonesian: 'id-ID',
        malay: 'ms-MY',
        thai: 'th-TH',
        khmer: 'km-KH',
        english: 'en-US'
      };
      recognitionRef.current.lang = langMap[selectedLanguage] || 'en-US';

      recognitionRef.current.onresult = (e) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const transcript = e.results[i][0].transcript;
          if (e.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        setLiveTranscript(interimTranscript);
        if (finalTranscript) {
          setLiveTranscript(finalTranscript);
          const grammar = checkGrammar(finalTranscript);
          setGrammarCorrections(grammar);
          const pronunciation = analyzePronunciation(finalTranscript);
          setPronunciationScore(pronunciation);
          setPronunciationFeedback(pronunciation.phonemeFeedback);
          setIsAnalyzing(false);
          isRecordingRef.current = false;
          setIsRecording(false);
        }
      };

      recognitionRef.current.onerror = (e) => {
        console.log('SpeechRecognition error:', e.error);
        isRecordingRef.current = false;
        setIsRecording(false);
        setIsAnalyzing(false);
      };

      recognitionRef.current.onend = () => {
        isRecordingRef.current = false;
        setIsRecording(false);
        setIsAnalyzing(false);
      };
    }
  }, [selectedLanguage, expectedText]);

  // Speak AI messages (auto-detect Arabic and enforce Arabic TTS with diacritics)
  useEffect(() => {
    if (chatMessages.length > 0 && chatMessages[chatMessages.length - 1].type === 'ai') {
      const msg = chatMessages[chatMessages.length - 1].message || '';
      const containsArabic = /[\u0600-\u06FF]/.test(msg);
      const lang = containsArabic ? 'arabic' : selectedLanguage;
      speakText(msg, lang, { rate: containsArabic ? 0.9 : 1.0, pitch: 1.0 });
    }
  }, [chatMessages, selectedLanguage, speakText]);

  // Unified recording function for both microphones
  const startRecording = useCallback(() => {
    // Prevent multiple starts using ref for immediate check
    if (isRecordingRef.current) return;

    // Set ref immediately to prevent race conditions
    isRecordingRef.current = true;
    setIsRecording(true);
    setIsAnalyzing(true);
    setPronunciationScore(null);
    setGrammarCorrections([]);
    setPronunciationFeedback('');
    setLiveTranscript('');

    if (recognitionRef.current) {
      // Check if already started
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.log('SpeechRecognition already started or not available');
        isRecordingRef.current = false;
        setIsRecording(false);
        setIsAnalyzing(false);
      }
    } else {
      // Fallback simulation
      setTimeout(() => {
        isRecordingRef.current = false;
        setIsRecording(false);
        setIsAnalyzing(true);
        setLiveTranscript(expectedText);
        setTimeout(() => {
          const grammar = checkGrammar(expectedText);
          setGrammarCorrections(grammar);
          const pronunciation = analyzePronunciation(expectedText);
          setPronunciationScore(pronunciation);
          setPronunciationFeedback(pronunciation.phonemeFeedback);
          setIsAnalyzing(false);
        }, 2000);
      }, 3000);
    }
  }, [expectedText]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log('SpeechRecognition stop failed:', error);
      }
    }
    // Reset ref immediately
    isRecordingRef.current = false;
    setIsRecording(false);
    setIsAnalyzing(false);
  }, []);

  // Chat-specific recording function for the small microphone
  const startChatListening = useCallback(() => {
    // Prevent multiple starts
    if (isRecordingRef.current) return;

    isRecordingRef.current = true;
    setIsRecording(true);

    if (recognitionRef.current) {
      // Create a new SpeechRecognition instance for chat to avoid conflicts
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const chatRecognition = new SpeechRecognition();
      chatRecognition.continuous = false;
      chatRecognition.interimResults = false;
      
      // Set language for chat recognition
      const langMap = {
        arabic: 'ar-SA',
        dutch: 'nl-NL',
        indonesian: 'id-ID',
        malay: 'ms-MY',
        thai: 'th-TH',
        khmer: 'km-KH',
        english: 'en-US'
      };
      chatRecognition.lang = langMap[selectedLanguage] || 'en-US';

      chatRecognition.onresult = (e) => {
        const text = e.results[0][0].transcript;
        setInputMessage(text);
        isRecordingRef.current = false;
        setIsRecording(false);
      };
      
      chatRecognition.onerror = (e) => {
        console.log('Chat SpeechRecognition error:', e.error);
        isRecordingRef.current = false;
        setIsRecording(false);
      };
      
      chatRecognition.onend = () => {
        isRecordingRef.current = false;
        setIsRecording(false);
      };
      
      try {
        chatRecognition.start();
      } catch (error) {
        console.log('Chat SpeechRecognition start failed:', error);
        isRecordingRef.current = false;
        setIsRecording(false);
      }
    } else {
      // Fallback simulation for chat
      setTimeout(() => {
        setInputMessage('Hello, how are you?');
        isRecordingRef.current = false;
        setIsRecording(false);
      }, 2000);
    }
  }, [selectedLanguage]);

  const sendMessage = useCallback(() => {
    if (!inputMessage.trim()) return;

    // Auto-detect language from user input
    const detectedLang = detectLanguage(inputMessage);
    setDetectedLanguage(detectedLang);

    let corrected = inputMessage;
    const grammar = checkGrammar(inputMessage);
    if (grammar.length > 0) {
      corrected = grammar.reduce((text, corr) => text.replace(corr.error, corr.correction), inputMessage);
    }

    // Generate language-specific response
    const getLanguageResponse = (lang) => {
      const responses = {
        english: `Great! I detected you're speaking English. You said: "${inputMessage}". ${grammar.length > 0 ? `Corrected: "${corrected}".` : ''} Excellent pronunciation! What would you like to practice next?`,
        arabic: `ممتاز! لقد اكتشفت أنك تتحدث العربية. قلت: "${inputMessage}". ${grammar.length > 0 ? `المصحح: "${corrected}".` : ''} نطق ممتاز! ماذا تريد أن تتدرب عليه بعد ذلك؟`,
        dutch: `Geweldig! Ik heb gedetecteerd dat je Nederlands spreekt. Je zei: "${inputMessage}". ${grammar.length > 0 ? `Gecorrigeerd: "${corrected}".` : ''} Uitstekende uitspraak! Wat wil je daarna oefenen?`,
        indonesian: `Bagus! Saya mendeteksi Anda berbicara bahasa Indonesia. Anda berkata: "${inputMessage}". ${grammar.length > 0 ? `Dikoreksi: "${corrected}".` : ''} Pengucapan yang bagus! Apa yang ingin Anda latih selanjutnya?`,
        malay: `Bagus! Saya mengesan anda bercakap bahasa Melayu. Anda berkata: "${inputMessage}". ${grammar.length > 0 ? `Dibetulkan: "${corrected}".` : ''} Sebutan yang bagus! Apa yang anda mahu latih seterusnya?`,
        thai: `ยอดเยี่ยม! ฉันตรวจพบว่าคุณพูดภาษาไทย คุณพูดว่า: "${inputMessage}". ${grammar.length > 0 ? `แก้ไขแล้ว: "${corrected}".` : ''} การออกเสียงยอดเยี่ยม! คุณต้องการฝึกอะไรต่อไป?`,
        khmer: `ល្អណាស់! ខ្ញុំបានរកឃើញថាអ្នកនិយាយភាសាខ្មែរ។ អ្នកបាននិយាយថា: "${inputMessage}". ${grammar.length > 0 ? `បានកែតម្រូវ: "${corrected}".` : ''} ការបញ្ចេញសំឡេងល្អណាស់! អ្នកចង់អនុវត្តអ្វីបន្តទៀត?`
      };
      return responses[lang] || responses.english;
    };

    setChatMessages(prev => [
      ...prev,
      { type: 'user', message: inputMessage },
      {
        type: 'ai',
        message: getLanguageResponse(detectedLang)
      }
    ]);
    setInputMessage('');
  }, [inputMessage, selectedLanguage]);

  // Cleanup effect to reset recording state
  useEffect(() => {
    return () => {
      isRecordingRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          // Ignore errors during cleanup
        }
      }
    };
  }, []);

  // Determine RTL based on selected language key
  const rtlLanguages = new Set(['arabic', 'hebrew', 'urdu', 'farsi']);
  const isRTL = rtlLanguages.has(String(selectedLanguage).toLowerCase());
  
  // Show language selection if not selected yet
  if (learningLanguage === null) {
    return (
      <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-between">
          <h1 className={`font-bold text-white ${fontSize === 'text-sm' ? 'text-xl' : fontSize === 'text-lg' ? 'text-2xl' : 'text-3xl'}`}>
            {t('aiLanguageCoach')}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm">Online</span>
            </div>
          </div>
        </div>

        {/* Language Selection */}
        <div className="bg-slate-800/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-slate-700/50">
          <div className="text-center mb-8">
            <h2 className={`font-bold text-white mb-4 ${fontSize === 'text-sm' ? 'text-2xl' : fontSize === 'text-lg' ? 'text-3xl' : 'text-4xl'}`}>
              Choose Your Learning Language
            </h2>
            <p className="text-slate-400 text-lg">
              What language would you like to learn with your AI coach?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <button
              onClick={() => initializeChat('english')}
              className="p-8 rounded-2xl border-2 border-blue-500 bg-gradient-to-br from-blue-500/20 to-purple-500/20 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 group"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">🇺🇸</div>
                <h3 className="text-2xl font-bold text-white mb-2">English</h3>
                <p className="text-slate-300 mb-4">Learn English with AI assistance</p>
                <div className="text-sm text-slate-400">
                  • Grammar & Vocabulary<br />
                  • Pronunciation Practice<br />
                  • Conversation Practice
                </div>
              </div>
            </button>

            <button
              onClick={() => initializeChat('arabic')}
              className="p-8 rounded-2xl border-2 border-green-500 bg-gradient-to-br from-green-500/20 to-emerald-500/20 shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-all duration-300 group"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">🇸🇦</div>
                <h3 className="text-2xl font-bold text-white mb-2">العربية</h3>
                <p className="text-slate-300 mb-4">تعلم العربية بمساعدة الذكاء الاصطناعي</p>
                <div className="text-sm text-slate-400">
                  • القواعد والمفردات<br />
                  • ممارسة النطق<br />
                  • ممارسة المحادثة
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <h1 className={`font-bold text-white ${fontSize === 'text-sm' ? 'text-xl' : fontSize === 'text-lg' ? 'text-2xl' : 'text-3xl'}`}>
          {t('aiLanguageCoach')} - {learningLanguage === 'arabic' ? 'العربية' : 'English'}
        </h1>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm">Online</span>
        </div>
      </div>

      {/* Pronunciation Coach */}
      <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-2xl p-6">
        <div className="flex items-center mb-4">
          <Mic className="text-purple-300 mr-2" size={20} />
          <h3 className={`font-bold text-white ${fontSize}`}>{t('pronunciationCoach')}</h3>
        </div>

        <div className="text-center">
          <div className="mb-4">
            <p className="text-purple-200 mb-2">{t('say')}<span className="font-bold">"{expectedText}"</span></p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={startRecording}
                disabled={isRecording}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-purple-600 hover:bg-purple-500'}`}
                aria-label={isRecording ? 'Recording...' : 'Start recording'}
              >
                {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
              </button>
              {isRecording && (
                <button
                  onClick={stopRecording}
                  className="w-20 h-20 rounded-full flex items-center justify-center bg-gray-600 hover:bg-gray-500 transition-all"
                  aria-label="Stop recording"
                >
                  <X size={24} />
                </button>
              )}
            </div>
          </div>

          {/* Live Transcript */}
          {liveTranscript && (
            <div className="bg-purple-800/50 rounded-xl p-4 mt-4" role="status" aria-live="polite">
              <p className="text-purple-200 font-medium">Live Transcript:</p>
              <p className="text-white">{liveTranscript}</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="text-purple-200" role="status" aria-live="polite">
              <div className="animate-spin w-6 h-6 border-2 border-purple-300 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p>{t('analyzingPronunciation')}</p>
            </div>
          )}

          {/* Real-time Feedback */}
          {(grammarCorrections.length > 0 || pronunciationScore || pronunciationFeedback) && (
            <div className="bg-purple-800/50 rounded-xl p-4 mt-4" role="alert">
              {grammarCorrections.length > 0 && (
                <div className="mb-4">
                  <p className="text-purple-200 font-medium">Grammar Corrections:</p>
                  {grammarCorrections.map((corr, index) => (
                    <div key={index} className="mt-2">
                      <p className="text-red-400">❌ {corr.error}</p>
                      <p className="text-green-400">✅ {corr.correction}</p>
                      <p className="text-purple-200 text-sm">{corr.note}</p>
                    </div>
                  ))}
                </div>
              )}
              {pronunciationScore && (
                <div>
                  <p className="text-purple-200 font-medium">Pronunciation Feedback:</p>
                  <div className="flex items-center justify-center mb-2">
                    <Star className="text-yellow-400 mr-2" size={20} />
                    <span className="text-2xl font-bold text-white">{pronunciationScore.score}%</span>
                  </div>
                  <p className="text-purple-200">{pronunciationScore.feedback}</p>
                  {pronunciationFeedback && (
                    <p className="text-purple-200 text-sm mt-2">{pronunciationFeedback}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* AI Chat */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6">
        <div className="flex items-center mb-4">
          <MessageCircle className="text-blue-300 mr-2" size={20} />
          <h3 className={`font-bold text-white ${fontSize}`}>{t('chatWithAiTutor')}</h3>
        </div>

        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto" role="log" aria-live="polite">
          {chatMessages.map((msg, index) => (
            <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs p-3 rounded-xl ${fontSize} ${msg.type === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-200'}`}>
                {msg.message}
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={startChatListening}
            disabled={isRecording}
            className={`text-white p-3 rounded-xl transition-colors ${isRecording ? 'bg-red-500 animate-pulse cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'}`}
            aria-label={isRecording ? 'Recording...' : 'Speak message'}
          >
            {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={t('askAboutLearning')}
            className={`flex-1 p-3 bg-slate-700 text-white rounded-xl border border-slate-600 focus:border-blue-500 outline-none ${fontSize}`}
            aria-label="Chat message input"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-500 transition-colors"
            aria-label="Send message"
          >
            {t('send')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICoachScreen;
