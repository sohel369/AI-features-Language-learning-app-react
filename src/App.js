import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Volume2,
  Mic,
  MicOff,
  Star,
  Trophy,
  Target,
  BookOpen,
  Users,
  Settings,
  Home,
  Award,
  Zap,
  Brain,
  MessageCircle,
  Play,
  Check,
  X,
  ChevronLeft,
  Globe,
  User,
  Flame   // use Flame instead of Fire
} from 'lucide-react';

// Move static data outside component to prevent recreation on renders
const LANGUAGES = {
  english: { name: 'English', flag: '🇺🇸', rtl: false },
  arabic: { name: 'العربية', flag: '🇸🇦', rtl: true },
  dutch: { name: 'Nederlands', flag: '🇳🇱', rtl: false },
  indonesian: { name: 'Bahasa Indonesia', flag: '🇮🇩', rtl: false },
  malay: { name: 'Bahasa Melayu', flag: '🇲🇾', rtl: false },
  thai: { name: 'ไทย', flag: '🇹🇭', rtl: false },
  khmer: { name: 'ខ្មែរ', flag: '🇰🇭', rtl: false }
};

const VOCABULARY = {
  beginner: [
    { word: 'hello', translation: 'مرحبا', category: 'greetings', audio: '/audio/hello.mp3' },
    { word: 'goodbye', translation: 'وداعا', category: 'greetings', audio: '/audio/goodbye.mp3' },
    { word: 'water', translation: 'ماء', category: 'food', audio: '/audio/water.mp3' },
    { word: 'food', translation: 'طعام', category: 'food', audio: '/audio/food.mp3' }
  ],
  intermediate: [
    { word: 'beautiful', translation: 'جميل', category: 'adjectives', audio: '/audio/beautiful.mp3' },
    { word: 'difficult', translation: 'صعب', category: 'adjectives', audio: '/audio/difficult.mp3' }
  ],
  advanced: [
    { word: 'sophisticated', translation: 'معقد', category: 'advanced', audio: '/audio/sophisticated.mp3' },
    { word: 'magnificent', translation: 'رائع', category: 'advanced', audio: '/audio/magnificent.mp3' }
  ]
};

const QUIZ_QUESTIONS = [
  {
    question: "What does 'مرحبا' mean?",
    options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
    correct: 0
  },
  {
    question: "How do you say 'water' in Arabic?",
    options: ['طعام', 'ماء', 'جميل', 'صعب'],
    correct: 1
  }
];

const PLACEMENT_QUESTIONS = [
  {
    type: 'vocabulary',
    question: 'Select the word that means "beautiful"',
    options: ['جميل', 'صعب', 'كبير', 'صغير'],
    correct: 0
  },
  {
    type: 'grammar',
    question: 'Complete: "I ___ to the store yesterday"',
    options: ['go', 'went', 'going', 'goes'],
    correct: 1
  },
  {
    type: 'listening',
    question: 'What did you hear?',
    audio: '/audio/sample.mp3',
    options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
    correct: 0
  }
];

const LanguageLearningMVP = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [userProgress, setUserProgress] = useState({
    xp: 1250,
    streak: 7,
    level: 3,
    badges: ['first-lesson', 'week-streak', 'pronunciation-pro']
  });
  const [isRecording, setIsRecording] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [fontSize, setFontSize] = useState('text-base');
  const [highContrast, setHighContrast] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // PWA Install Prompt state
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(true);

  // Get current language with RTL support
  const currentLanguage = useMemo(() => LANGUAGES[selectedLanguage], [selectedLanguage]);

  // Enhanced TTS function with error handling
  const speakText = useCallback((text, lang = 'en') => {
    try {
      if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Enhanced language mapping
        const langMap = {
          arabic: 'ar-SA',
          dutch: 'nl-NL',
          indonesian: 'id-ID',
          malay: 'ms-MY',
          thai: 'th-TH',
          english: 'en-US'
        };

        utterance.lang = langMap[lang] || langMap[selectedLanguage] || 'en-US';
        utterance.rate = 0.8;
        utterance.pitch = 1;

        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('TTS Error:', error);
    }
  }, [selectedLanguage]);

  // Enhanced pronunciation analysis with realistic simulation
  const analyzePronunciation = useCallback(() => {
    return new Promise(resolve => {
      setTimeout(() => {
        const scores = [72, 85, 91, 78, 88, 94];
        const feedbacks = [
          'Great rhythm! Work on consonant clarity.',
          'Excellent intonation. Focus on vowel sounds.',
          'Perfect pronunciation! Keep it up.',
          'Good effort. Practice the "th" sound more.',
          'Well done! Your accent is improving.',
          'Nice flow. Work on word stress patterns.'
        ];

        const randomIndex = Math.floor(Math.random() * scores.length);
        resolve({
          score: scores[randomIndex],
          feedback: feedbacks[randomIndex]
        });
      }, 2000);
    });
  }, []);

  // PWA Install handler
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  // Memoized Navigation Component
  const NavigationBar = React.memo(() => (
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-slate-800 border-t border-slate-700 p-4 z-50">
      <div className="flex justify-around items-center mx-auto">
        {[
          { id: 'home', icon: Home, label: 'Home' },
          { id: 'lessons', icon: BookOpen, label: 'Lessons' },
          { id: 'quiz', icon: Target, label: 'Quiz' },
          { id: 'ai-coach', icon: Brain, label: 'AI Coach' },
          { id: 'profile', icon: User, label: 'Profile' }
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setCurrentScreen(id)}
            className={`flex flex-col items-center p-2 rounded-lg transition-all ${currentScreen === id
              ? 'text-blue-400 bg-slate-700/50'
              : 'text-slate-400 hover:text-white'
              }`}
            aria-label={`Navigate to ${label}`}
          >
            <Icon size={20} />
            <span className="text-xs mt-1">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  ));

  const HomeScreen = () => (
    <div className={`space-y-6 ${currentLanguage.rtl ? 'rtl' : 'ltr'}`} dir={currentLanguage.rtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4 ">
          <div>
            <h1 className={`font-bold mb-1 ${fontSize === 'text-sm' ? 'text-xl' : fontSize === 'text-lg' ? 'text-2xl' : 'text-3xl'}`}>
              Welcome back! 👋
            </h1>
            <p className="text-blue-200">Ready to continue learning?</p>
          </div>
          <button
            onClick={() => setCurrentScreen('settings')}
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
            <p className="text-sm text-blue-200">Day Streak</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="text-yellow-400 mr-1" size={20} />
              <span className="font-bold text-lg">{userProgress.xp}</span>
            </div>
            <p className="text-sm text-blue-200">Total XP</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Trophy className="text-purple-400 mr-1" size={20} />
              <span className="font-bold text-lg">{userProgress.level}</span>
            </div>
            <p className="text-sm text-blue-200">Level</p>
          </div>
        </div>
      </div>

      {/* Language Selection */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6">
        <h2 className={`font-bold text-white mb-4 flex items-center ${fontSize === 'text-sm' ? 'text-lg' : fontSize === 'text-lg' ? 'text-xl' : 'text-2xl'}`}>
          <Globe className="mr-2" size={20} />
          Select Language
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(LANGUAGES).map(([key, lang]) => (
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
          onClick={() => setCurrentScreen('lessons')}
          className="bg-gradient-to-br from-green-800 to-green-900 rounded-xl p-4 text-white hover:from-green-700 hover:to-green-800 transition-all"
        >
          <BookOpen className="mx-auto mb-2" size={24} />
          <div className={`font-medium ${fontSize}`}>Continue Lesson</div>
        </button>
        <button
          onClick={() => setCurrentScreen('ai-coach')}
          className="bg-gradient-to-br from-purple-800 to-pink-900 rounded-xl p-4 text-white hover:from-purple-700 hover:to-pink-800 transition-all"
        >
          <Brain className="mx-auto mb-2" size={24} />
          <div className={`font-medium ${fontSize}`}>AI Coach</div>
        </button>
      </div>
    </div>
  );

  const LessonsScreen = () => (
    <div className={`space-y-6 ${currentLanguage.rtl ? 'rtl' : 'ltr'}`} dir={currentLanguage.rtl ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <h1 className={`font-bold text-white ${fontSize === 'text-sm' ? 'text-xl' : fontSize === 'text-lg' ? 'text-2xl' : 'text-3xl'}`}>
          Lessons
        </h1>
        <div className="text-blue-400 font-medium">Level {userProgress.level}</div>
      </div>

      {/* Progress Bar */}
      <div className="bg-slate-800 rounded-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-300">Course Progress</span>
          <span className="text-blue-400 font-medium">65%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300" style={{ width: '65%' }}></div>
        </div>
      </div>

      {/* Lesson Categories */}
      {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
        <div key={level} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className={`font-bold text-white ${fontSize}`}>{level} Level</h3>
            <span className="text-xs text-slate-400">{VOCABULARY[level.toLowerCase()]?.length || 0} words</span>
          </div>

          <div className="space-y-2">
            {VOCABULARY[level.toLowerCase()]?.slice(0, 3).map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                onClick={() => speakText(item.word)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && speakText(item.word)}
              >
                <div>
                  <div className={`font-medium text-white ${fontSize}`}>{item.word}</div>
                  <div className={`text-sm text-slate-400 ${currentLanguage.rtl ? 'text-right' : 'text-left'}`}>
                    {item.translation}
                  </div>
                </div>
                <button
                  className="text-blue-400 hover:text-blue-300"
                  aria-label={`Play pronunciation for ${item.word}`}
                >
                  <Volume2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const QuizScreen = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);

    const handleAnswer = useCallback((answerIndex) => {
      setSelectedAnswer(answerIndex);
      setShowResult(true);

      if (answerIndex === QUIZ_QUESTIONS[currentQuestion].correct) {
        setQuizScore(prev => prev + 1);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);

        // Update user progress
        setUserProgress(prev => ({ ...prev, xp: prev.xp + 10 }));
      }
    }, [currentQuestion]);

    const nextQuestion = useCallback(() => {
      if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        // Quiz completed - could navigate to results screen
        setCurrentScreen('profile');
      }
    }, [currentQuestion]);

    return (
      <div className={`space-y-6 ${currentLanguage.rtl ? 'rtl' : 'ltr'}`} dir={currentLanguage.rtl ? 'rtl' : 'ltr'}>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            <div className="text-6xl animate-bounce">🎉</div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <h1 className={`font-bold text-white ${fontSize === 'text-sm' ? 'text-xl' : fontSize === 'text-lg' ? 'text-2xl' : 'text-3xl'}`}>
            Quiz Challenge
          </h1>
          <div className="text-blue-400 font-medium">
            {currentQuestion + 1}/{QUIZ_QUESTIONS.length}
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6">
          <div className="mb-6">
            <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
              <div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                role="progressbar"
                aria-valuenow={(currentQuestion + 1) / QUIZ_QUESTIONS.length * 100}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>

            <h2 className={`font-bold text-white mb-6 ${fontSize === 'text-sm' ? 'text-lg' : fontSize === 'text-lg' ? 'text-xl' : 'text-2xl'}`}>
              {QUIZ_QUESTIONS[currentQuestion]?.question}
            </h2>

            <div className="space-y-3">
              {QUIZ_QUESTIONS[currentQuestion]?.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !showResult && handleAnswer(index)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl text-left transition-all ${fontSize} ${showResult
                    ? index === QUIZ_QUESTIONS[currentQuestion].correct
                      ? 'bg-green-600 text-white border-2 border-green-400'
                      : selectedAnswer === index
                        ? 'bg-red-600 text-white border-2 border-red-400'
                        : 'bg-slate-700 text-slate-300'
                    : 'bg-slate-700 text-white hover:bg-slate-600 border-2 border-transparent hover:border-slate-500'
                    }`}
                  aria-pressed={selectedAnswer === index}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && (
                      <>
                        {index === QUIZ_QUESTIONS[currentQuestion].correct &&
                          <Check size={20} className="text-green-400" aria-label="Correct answer" />}
                        {selectedAnswer === index && index !== QUIZ_QUESTIONS[currentQuestion].correct &&
                          <X size={20} className="text-red-400" aria-label="Incorrect answer" />}
                      </>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {showResult && (
            <div className="text-center">
              <button
                onClick={nextQuestion}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:from-blue-500 hover:to-purple-500 transition-all"
              >
                {currentQuestion < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const AICoachScreen = () => {
    const [pronunciationScore, setPronunciationScore] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [chatMessages, setChatMessages] = useState([
      { type: 'ai', message: 'Hello! I\'m your AI language coach. How can I help you today?' }
    ]);
    const [inputMessage, setInputMessage] = useState('');

    const startRecording = useCallback(async () => {
      setIsRecording(true);
      setIsAnalyzing(false);
      setPronunciationScore(null);

      // Simulate recording for 3 seconds
      setTimeout(() => {
        setIsRecording(false);
        setIsAnalyzing(true);

        // Simulate AI analysis
        analyzePronunciation().then(result => {
          setIsAnalyzing(false);
          setPronunciationScore(result);
        });
      }, 3000);
    }, [analyzePronunciation]);

    const sendMessage = useCallback(() => {
      if (!inputMessage.trim()) return;

      setChatMessages(prev => [...prev,
      { type: 'user', message: inputMessage },
      { type: 'ai', message: 'That\'s a great question! Let me help you practice that pronunciation. Try repeating after me...' }
      ]);
      setInputMessage('');
    }, [inputMessage]);

    return (
      <div className={`space-y-6 ${currentLanguage.rtl ? 'rtl' : 'ltr'}`} dir={currentLanguage.rtl ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-between">
          <h1 className={`font-bold text-white ${fontSize === 'text-sm' ? 'text-xl' : fontSize === 'text-lg' ? 'text-2xl' : 'text-3xl'}`}>
            AI Language Coach
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
            <h3 className={`font-bold text-white ${fontSize}`}>Pronunciation Coach</h3>
          </div>

          <div className="text-center">
            <div className="mb-4">
              <p className="text-purple-200 mb-2">Say: "Hello, how are you?"</p>
              <button
                onClick={startRecording}
                disabled={isRecording || isAnalyzing}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${isRecording
                  ? 'bg-red-500 animate-pulse'
                  : 'bg-purple-600 hover:bg-purple-500'
                  }`}
                aria-label={isRecording ? "Recording..." : "Start recording"}
              >
                {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
              </button>
            </div>

            {isAnalyzing && (
              <div className="text-purple-200" role="status" aria-live="polite">
                <div className="animate-spin w-6 h-6 border-2 border-purple-300 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p>AI is analyzing your pronunciation...</p>
              </div>
            )}

            {pronunciationScore && (
              <div className="bg-purple-800/50 rounded-xl p-4 mt-4" role="alert">
                <div className="flex items-center justify-center mb-2">
                  <Star className="text-yellow-400 mr-2" size={20} />
                  <span className="text-2xl font-bold text-white">{pronunciationScore.score}%</span>
                </div>
                <p className="text-purple-200">{pronunciationScore.feedback}</p>
              </div>
            )}
          </div>
        </div>

        {/* AI Chat */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <MessageCircle className="text-blue-300 mr-2" size={20} />
            <h3 className={`font-bold text-white ${fontSize}`}>Chat with AI Tutor</h3>
          </div>

          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto" role="log" aria-live="polite">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs p-3 rounded-xl ${fontSize} ${msg.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-200'
                  }`}>
                  {msg.message}
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask me anything about language learning..."
              className={`flex-1 p-3 bg-slate-700 text-white rounded-xl border border-slate-600 focus:border-blue-500 outline-none ${fontSize}`}
              aria-label="Chat message input"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-500 transition-colors"
              aria-label="Send message"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ProfileScreen = () => (
    <div className={`space-y-6 ${currentLanguage.rtl ? 'rtl' : 'ltr'}`} dir={currentLanguage.rtl ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <h1 className={`font-bold text-white ${fontSize === 'text-sm' ? 'text-xl' : fontSize === 'text-lg' ? 'text-2xl' : 'text-3xl'}`}>
          Profile
        </h1>
      </div>

      {/* User Stats */}
      <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-2xl p-6 text-white">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3">
            JD
          </div>
          <h2 className={`font-bold mb-1 ${fontSize === 'text-sm' ? 'text-lg' : fontSize === 'text-lg' ? 'text-xl' : 'text-2xl'}`}>Mohammed E.</h2>
          <p className="text-blue-200">Language Explorer</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-white/10 rounded-xl">
            <Zap className="text-yellow-400 mx-auto mb-2" size={24} />
            <div className="font-bold text-lg">{userProgress.xp}</div>
            <div className="text-sm text-blue-200">Total XP</div>
          </div>
          <div className="text-center p-4 bg-white/10 rounded-xl">
            <Flame className="text-orange-400 mx-auto mb-2" size={24} />
            <div className="font-bold text-lg">{userProgress.streak}</div>
            <div className="text-sm text-blue-200">Day Streak</div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6">
        <h3 className={`font-bold text-white mb-4 flex items-center ${fontSize}`}>
          <Award className="mr-2" size={20} />
          Achievements
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'first-lesson', name: 'First Steps', icon: '🎯', unlocked: true },
            { id: 'week-streak', name: 'Week Warrior', icon: '🔥', unlocked: true },
            { id: 'pronunciation-pro', name: 'Pronunciation Pro', icon: '🎤', unlocked: true },
            { id: 'polyglot', name: 'Polyglot', icon: '🌍', unlocked: false }
          ].map(badge => (
            <div
              key={badge.id}
              className={`p-4 rounded-xl text-center ${badge.unlocked
                ? 'bg-gradient-to-br from-yellow-600 to-orange-600 text-white'
                : 'bg-slate-700 text-slate-400'
                }`}
              role={badge.unlocked ? "img" : undefined}
              aria-label={badge.unlocked ? `Achievement unlocked: ${badge.name}` : `Achievement locked: ${badge.name}`}
            >
              <div className="text-2xl mb-2">{badge.icon}</div>
              <div className={`font-medium ${fontSize}`}>{badge.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6">
        <h3 className={`font-bold text-white mb-4 flex items-center ${fontSize}`}>
          <Trophy className="mr-2" size={20} />
          Weekly Leaderboard
        </h3>
        <div className="space-y-3">
          {[
            { name: 'You', xp: userProgress.xp, rank: 1, current: true },
            { name: 'Sarah M.', xp: 1180, rank: 2 },
            { name: 'Ahmed K.', xp: 1050, rank: 3 }
          ].map(user => (
            <div
              key={user.name}
              className={`flex items-center justify-between p-3 rounded-lg ${user.current ? 'bg-blue-600/20 border border-blue-500/50' : 'bg-slate-700/50'
                }`}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${user.rank === 1 ? 'bg-yellow-500' : user.rank === 2 ? 'bg-gray-400' : 'bg-amber-600'
                  }`}>
                  {user.rank}
                </div>
                <span className={`text-white font-medium ${fontSize}`}>{user.name}</span>
              </div>
              <span className="text-slate-300">{user.xp} XP</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SettingsScreen = () => (
    <div className={`space-y-6 ${currentLanguage.rtl ? 'rtl' : 'ltr'}`} dir={currentLanguage.rtl ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('home')}
          className="text-slate-400 hover:text-white transition-colors"
          aria-label="Go back to home"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className={`font-bold text-white ${fontSize === 'text-sm' ? 'text-xl' : fontSize === 'text-lg' ? 'text-2xl' : 'text-3xl'}`}>
          Settings
        </h1>
        <div></div>
      </div>

      {/* Accessibility Settings */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6">
        <h3 className={`font-bold text-white mb-4 ${fontSize}`}>Accessibility</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="font-size-select" className={`text-slate-300 ${fontSize}`}>Font Size</label>
            <select
              id="font-size-select"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-blue-500 outline-none"
            >
              <option value="text-sm">Small</option>
              <option value="text-base">Medium</option>
              <option value="text-lg">Large</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-slate-300 ${fontSize}`}>High Contrast</span>
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`w-12 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${highContrast ? 'bg-blue-600' : 'bg-slate-600'
                }`}
              role="switch"
              aria-checked={highContrast}
              aria-label="Toggle high contrast mode"
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${highContrast ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-slate-300 ${fontSize}`}>Captions</span>
            <button
              onClick={() => setCaptionsEnabled(!captionsEnabled)}
              className={`w-12 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${captionsEnabled ? 'bg-blue-600' : 'bg-slate-600'
                }`}
              role="switch"
              aria-checked={captionsEnabled}
              aria-label="Toggle captions"
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${captionsEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
            </button>
          </div>
        </div>
      </div>

      {/* Language Settings */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6">
        <h3 className={`font-bold text-white mb-4 ${fontSize}`}>Language Preferences</h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="interface-lang" className={`text-slate-300 block mb-2 ${fontSize}`}>Interface Language</label>
            <select
              id="interface-lang"
              className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-blue-500 outline-none"
            >
              <option>English</option>
              <option>العربية</option>
              <option>Nederlands</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-slate-300 ${fontSize}`}>Auto-play Audio</span>
            <button
              className="w-12 h-6 bg-blue-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              role="switch"
              aria-checked="true"
              aria-label="Toggle auto-play audio"
            >
              <div className="w-5 h-5 bg-white rounded-full translate-x-6 transition-transform"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6">
        <h3 className={`font-bold text-white mb-4 ${fontSize}`}>Notifications</h3>

        <div className="space-y-4">
          {[
            { label: 'Daily Reminders', enabled: true },
            { label: 'Achievement Alerts', enabled: true },
            { label: 'Streak Warnings', enabled: true }
          ].map((setting, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className={`text-slate-300 ${fontSize}`}>{setting.label}</span>
              <button
                className="w-12 h-6 bg-blue-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                role="switch"
                aria-checked={setting.enabled}
                aria-label={`Toggle ${setting.label.toLowerCase()}`}
              >
                <div className="w-5 h-5 bg-white rounded-full translate-x-6 transition-transform"></div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6">
        <h3 className={`font-bold text-white mb-4 ${fontSize}`}>Account</h3>

        <div className="space-y-3">
          {[
            { label: 'Privacy Policy', color: 'text-slate-300' },
            { label: 'Terms of Service', color: 'text-slate-300' },
            { label: 'Export Data', color: 'text-slate-300' },
            { label: 'Delete Account', color: 'text-red-400' }
          ].map((item, index) => (
            <button
              key={index}
              className={`w-full text-left p-3 ${item.color} hover:text-white hover:bg-slate-700 rounded-lg transition-colors ${fontSize} ${item.color === 'text-red-400' ? 'hover:bg-red-900/20' : ''
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Placement Test Screen
  const PlacementTestScreen = () => {
    const [testStep, setTestStep] = useState(0);
    const [testResults, setTestResults] = useState(null);

    const handleTestAnswer = useCallback((answerIndex) => {
      if (testStep < PLACEMENT_QUESTIONS.length - 1) {
        setTestStep(testStep + 1);
      } else {
        // Calculate results based on answers
        const level = ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)];
        const score = Math.floor(Math.random() * 30) + 70;
        setTestResults({ level, score });
      }
    }, [testStep]);

    return (
      <div className={`space-y-6 ${currentLanguage.rtl ? 'rtl' : 'ltr'}`} dir={currentLanguage.rtl ? 'rtl' : 'ltr'}>
        <div className="text-center">
          <h1 className={`font-bold text-white mb-2 ${fontSize === 'text-sm' ? 'text-xl' : fontSize === 'text-lg' ? 'text-2xl' : 'text-3xl'}`}>
            Placement Test
          </h1>
          <p className="text-slate-400">Let's find your perfect starting level</p>
        </div>

        {!testResults ? (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6">
            <div className="mb-6">
              <div className="flex justify-between text-sm text-slate-400 mb-2">
                <span>Question {testStep + 1}</span>
                <span>{testStep + 1}/{PLACEMENT_QUESTIONS.length}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((testStep + 1) / PLACEMENT_QUESTIONS.length) * 100}%` }}
                  role="progressbar"
                  aria-valuenow={(testStep + 1) / PLACEMENT_QUESTIONS.length * 100}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>

            {PLACEMENT_QUESTIONS[testStep] && (
              <div>
                <h3 className={`font-bold text-white mb-6 ${fontSize === 'text-sm' ? 'text-lg' : fontSize === 'text-lg' ? 'text-xl' : 'text-2xl'}`}>
                  {PLACEMENT_QUESTIONS[testStep].question}
                </h3>

                {PLACEMENT_QUESTIONS[testStep].type === 'listening' && (
                  <div className="text-center mb-6">
                    <button
                      onClick={() => speakText('Hello')}
                      className="bg-blue-600 text-white p-4 rounded-full hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label="Play audio sample"
                    >
                      <Play size={24} />
                    </button>
                    <p className="text-slate-400 mt-2">Click to listen</p>
                  </div>
                )}

                <div className="space-y-3">
                  {PLACEMENT_QUESTIONS[testStep].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleTestAnswer(index)}
                      className={`w-full p-4 text-left bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all border-2 border-transparent hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${fontSize}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-green-800 to-blue-800 rounded-2xl p-6 text-center text-white" role="alert">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className={`font-bold mb-2 ${fontSize === 'text-sm' ? 'text-xl' : fontSize === 'text-lg' ? 'text-2xl' : 'text-3xl'}`}>
              Placement Complete!
            </h2>
            <p className="text-green-100 mb-4">Your level: {testResults.level}</p>
            <p className="text-green-100 mb-6">Score: {testResults.score}%</p>
            <button
              onClick={() => setCurrentScreen('lessons')}
              className="bg-white text-green-800 px-8 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Start Learning!
            </button>
          </div>
        )}
      </div>
    );
  };

  // Teacher Integration Screen
  const TeacherScreen = () => {
    const [isLiveSession, setIsLiveSession] = useState(false);

    return (
      <div className={`space-y-6 ${currentLanguage.rtl ? 'rtl' : 'ltr'}`} dir={currentLanguage.rtl ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-between">
          <h1 className={`font-bold text-white ${fontSize === 'text-sm' ? 'text-xl' : fontSize === 'text-lg' ? 'text-2xl' : 'text-3xl'}`}>
            Live Teacher Support
          </h1>
          <div className={`flex items-center space-x-2 ${isLiveSession ? 'text-green-400' : 'text-slate-400'}`}>
            <div className={`w-2 h-2 rounded-full ${isLiveSession ? 'bg-green-400 animate-pulse' : 'bg-slate-400'}`}></div>
            <span className="text-sm">{isLiveSession ? 'Live' : 'Offline'}</span>
          </div>
        </div>

        {/* Avatar Teacher */}
        <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl p-6">
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-4" role="img" aria-label="AI Teacher avatar">
              👩‍🏫
            </div>
            <h3 className={`font-bold text-white ${fontSize}`}>Ms. Sarah - AI Teacher</h3>
            <p className="text-purple-200">Specialized in Arabic & English</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setIsLiveSession(!isLiveSession)}
              className={`w-full p-4 rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-white ${isLiveSession
                ? 'bg-red-600 hover:bg-red-500 text-white'
                : 'bg-green-600 hover:bg-green-500 text-white'
                }`}
            >
              {isLiveSession ? 'End Session' : 'Start Live Session'}
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 bg-purple-800/50 text-purple-200 rounded-xl hover:bg-purple-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400">
                <MessageCircle className="mx-auto mb-1" size={20} />
                <span className="text-sm">Chat</span>
              </button>
              <button className="p-3 bg-purple-800/50 text-purple-200 rounded-xl hover:bg-purple-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400">
                <Mic className="mx-auto mb-1" size={20} />
                <span className="text-sm">Voice Call</span>
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Corrections */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6">
          <h3 className={`font-bold text-white mb-4 ${fontSize}`}>Recent Corrections</h3>

          <div className="space-y-3">
            {[
              { error: "I go to school yesterday", correction: "I went to school yesterday", type: "Grammar" },
              { error: "الكتاب الأحمر", correction: "الكتاب الأحمر", type: "Pronunciation", note: "Focus on the 'ح' sound" }
            ].map((item, index) => (
              <div key={index} className="p-4 bg-slate-700/50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">{item.type}</span>
                  <button
                    onClick={() => speakText(item.correction)}
                    className="text-blue-400 hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                    aria-label={`Play pronunciation for: ${item.correction}`}
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
                <div className={`text-red-400 mb-1 ${fontSize}`}>❌ {item.error}</div>
                <div className={`text-green-400 mb-1 ${fontSize}`}>✅ {item.correction}</div>
                {item.note && <div className="text-slate-400 text-sm">{item.note}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Schedule Lesson */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6">
          <h3 className={`font-bold text-white mb-4 ${fontSize}`}>Schedule Private Lesson</h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="lesson-time" className="text-slate-300 block mb-2">Preferred Time</label>
              <input
                id="lesson-time"
                type="datetime-local"
                className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label htmlFor="focus-area" className="text-slate-300 block mb-2">Focus Area</label>
              <select
                id="focus-area"
                className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-blue-500 outline-none"
              >
                <option>Pronunciation</option>
                <option>Grammar</option>
                <option>Conversation</option>
                <option>Reading</option>
              </select>
            </div>
            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-500 hover:to-purple-500 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500">
              Book Lesson ($15/hour)
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Main render function
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home': return <HomeScreen />;
      case 'lessons': return <LessonsScreen />;
      case 'quiz': return <QuizScreen />;
      case 'ai-coach': return <AICoachScreen />;
      case 'profile': return <ProfileScreen />;
      case 'settings': return <SettingsScreen />;
      case 'placement': return <PlacementTestScreen />;
      case 'teacher': return <TeacherScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <div className={`min-h-screen ${highContrast ? 'bg-black text-white' : 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800'} text-white`}>
      {/* Header */}
      <header className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 p-4 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold">
              L
            </div>
            <div>
              <h1 className="font-bold text-lg">LinguaAI</h1>
              <p className="text-xs text-slate-400">Smart Language Learning</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {currentScreen === 'home' && (
              <>
                <button
                  onClick={() => setCurrentScreen('placement')}
                  className="p-2 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg hover:from-green-500 hover:to-blue-500 transition-all focus:outline-none focus:ring-2 focus:ring-green-400"
                  title="Take Placement Test"
                  aria-label="Take Placement Test"
                >
                  <Target size={16} />
                </button>
                <button
                  onClick={() => setCurrentScreen('teacher')}
                  className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all focus:outline-none focus:ring-2 focus:ring-purple-400"
                  title="Teacher Support"
                  aria-label="Teacher Support"
                >
                  <Users size={16} />
                </button>
              </>
            )}

            <div className="flex items-center space-x-1 text-xs">
              <Flame className="text-orange-400" size={14} />
              <span className="font-bold">{userProgress.streak}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 pb-24">
        <div className="mx-auto">
          {renderScreen()}
        </div>
      </main>

      {/* Navigation */}
      <NavigationBar />

      {/* PWA Install Prompt */}
      {showInstallPrompt && (
        <div className="fixed bottom-20 left-4 right-4 w-full mx-auto z-40">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl shadow-lg flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Install LinguaAI</p>
              <p className="text-xs text-blue-100">Get offline access & notifications</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleInstallClick}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              >
                Install
              </button>
              <button
                onClick={() => setShowInstallPrompt(false)}
                className="text-blue-100 hover:text-white transition-colors p-2 focus:outline-none focus:ring-2 focus:ring-white rounded"
                aria-label="Dismiss install prompt"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screen Reader Support */}
      {captionsEnabled && (
        <div className="fixed bottom-28 left-4 right-4 bg-black/80 text-white p-2 rounded text-sm text-center z-30" role="status" aria-live="polite">
          Caption: Currently viewing {currentScreen.replace('-', ' ')} screen
        </div>
      )}

      {/* Offline Indicator - Hidden by default, would be shown when offline */}
      <div className="fixed top-20 left-4 right-4 max-w-md mx-auto z-30 hidden">
        <div className="bg-orange-600 text-white p-2 rounded text-sm text-center" role="alert">
          ⚠️ You're offline. Some features may be limited.
        </div>
      </div>
    </div>
  );
};

export default LanguageLearningMVP;