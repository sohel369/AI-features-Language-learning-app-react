import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Volume2, Check, X, Play, Pause, RotateCcw, Star, Clock, Target } from 'lucide-react';
import speakText from '../TextToSpeech';
import EnhancedConfetti from './EnhancedConfetti';

// Enhanced quiz question types
const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  TRUE_FALSE: 'true_false',
  FILL_BLANK: 'fill_blank',
  SHORT_ANSWER: 'short_answer',
  LISTENING: 'listening',
  MATCHING: 'matching',
  PRONUNCIATION: 'pronunciation',
  TRANSLATION: 'translation',
  GRAMMAR: 'grammar'
};

// Enhanced quiz questions for multiple languages
const ENHANCED_QUIZ_QUESTIONS = {
  english: [
    {
      id: 1,
      type: QUESTION_TYPES.MULTIPLE_CHOICE,
      question: "What is the capital of France?",
      options: ["London", "Paris", "Berlin", "Madrid"],
      correct: 1,
      explanation: "Paris is the capital and largest city of France.",
      difficulty: "beginner",
      category: "geography"
    },
    {
      id: 2,
      type: QUESTION_TYPES.TRUE_FALSE,
      question: "The Earth is flat.",
      options: ["True", "False"],
      correct: 1,
      explanation: "The Earth is approximately spherical, not flat.",
      difficulty: "beginner",
      category: "science"
    },
    {
      id: 3,
      type: QUESTION_TYPES.FILL_BLANK,
      question: "The ___ is shining brightly in the sky.",
      options: ["sun", "moon", "star", "planet"],
      blank: "sun",
      correct: 0,
      explanation: "The sun is the star that provides light and heat to Earth.",
      difficulty: "beginner",
      category: "science"
    },
    {
      id: 4,
      type: QUESTION_TYPES.LISTENING,
      question: "Listen to the audio and select the correct word:",
      audioText: "Hello, how are you?",
      options: ["Hello, how are you?", "Hi, how are you?", "Hello, what are you?", "Hi, what are you?"],
      correct: 0,
      explanation: "The audio clearly says 'Hello, how are you?'",
      difficulty: "beginner",
      category: "listening"
    },
    {
      id: 5,
      type: QUESTION_TYPES.MATCHING,
      question: "Match the words with their meanings:",
      leftItems: ["Apple", "Book", "Water", "House"],
      rightItems: ["ماء", "كتاب", "تفاح", "بيت"],
      correctMatches: [2, 1, 0, 3],
      explanation: "Apple = تفاح, Book = كتاب, Water = ماء, House = بيت",
      difficulty: "intermediate",
      category: "vocabulary"
    },
    {
      id: 6,
      type: QUESTION_TYPES.PRONUNCIATION,
      question: "Pronounce the following word correctly:",
      word: "Beautiful",
      phonetic: "/ˈbjuːtɪfəl/",
      explanation: "Focus on the 'beau' sound and the 'ful' ending.",
      difficulty: "intermediate",
      category: "pronunciation"
    },
    {
      id: 7,
      type: QUESTION_TYPES.TRANSLATION,
      question: "Translate to Arabic:",
      text: "Good morning",
      correctAnswer: "صباح الخير",
      explanation: "Good morning in Arabic is 'صباح الخير' (sabah al-khayr).",
      difficulty: "beginner",
      category: "translation"
    },
    {
      id: 8,
      type: QUESTION_TYPES.GRAMMAR,
      question: "Choose the correct form:",
      text: "I ___ to school every day.",
      options: ["go", "goes", "going", "went"],
      correct: 0,
      explanation: "With 'every day', we use the present simple tense: 'I go'.",
      difficulty: "intermediate",
      category: "grammar"
    }
  ],
  arabic: [
    {
      id: 1,
      type: QUESTION_TYPES.MULTIPLE_CHOICE,
      question: "مَا هِيْ عَاصِمَةُ فَرْنْسَا؟",
      options: ["لُنْدُنْ", "بَارِيسْ", "بَرْلِينْ", "مَدْرِيدْ"],
      correct: 1,
      explanation: "بَارِيسْ هِيَ عَاصِمَةُ فَرْنْسَا وَأَكْبَرُ مُدُنِهَا.",
      difficulty: "beginner",
      category: "geography"
    },
    {
      id: 2,
      type: QUESTION_TYPES.TRUE_FALSE,
      question: "الْأَرْضُ مُسْطَحَةٌ.",
      options: ["صَحِيْحٌ", "خَطْأٌ"],
      correct: 1,
      explanation: "الْأَرْضُ كُرَوِيَّةٌ تَقْرِيْباً، لَيْسَتْ مُسْطَحَةً.",
      difficulty: "beginner",
      category: "science"
    },
    {
      id: 3,
      type: QUESTION_TYPES.FILL_BLANK,
      question: "الْـ___ تُشْرِقُ بِشِدَّةٍ فِي السَّمَاءِ.",
      options: ["شَمْسٌ", "قَمَرٌ", "نَجْمٌ", "كَوْكَبٌ"],
      blank: "شَمْسٌ",
      correct: 0,
      explanation: "الشَّمْسُ هِيَ النَّجْمَةُ الَّتِي تُزَوِّدُ الْأَرْضَ بِالضَّوْءِ وَالْحَرَارَةِ.",
      difficulty: "beginner",
      category: "science"
    },
    {
      id: 4,
      type: QUESTION_TYPES.LISTENING,
      question: "اسْتَمِعْ إِلَى الصَّوْتِ وَاخْتَرِ الْكَلِمَةَ الصَّحِيحَةَ:",
      audioText: "مَرْحَبًا، كَيْفَ حَالُكَ؟",
      options: ["مَرْحَبًا، كَيْفَ حَالُكَ؟", "هَلَّا، كَيْفَ حَالُكَ؟", "مَرْحَبًا، مَا حَالُكَ؟", "هَلَّا، مَا حَالُكَ؟"],
      correct: 0,
      explanation: "الصَّوْتُ يَقُولُ وَاضِحاً 'مَرْحَبًا، كَيْفَ حَالُكَ؟'",
      difficulty: "beginner",
      category: "listening"
    },
    {
      id: 5,
      type: QUESTION_TYPES.MATCHING,
      question: "رَبِطِ الْكَلِمَاتِ بِمَعَانِيهَا:",
      leftItems: ["تَفَّاحٌ", "كِتَابٌ", "مَاءٌ", "بَيْتٌ"],
      rightItems: ["Water", "Book", "Apple", "House"],
      correctMatches: [2, 1, 0, 3],
      explanation: "تَفَّاحٌ = Apple، كِتَابٌ = Book، مَاءٌ = Water، بَيْتٌ = House",
      difficulty: "intermediate",
      category: "vocabulary"
    },
    {
      id: 6,
      type: QUESTION_TYPES.PRONUNCIATION,
      question: "نَطِقِ الْكَلِمَةَ التَّالِيَةَ بِصَوَابٍ:",
      word: "جَمِيلٌ",
      phonetic: "/dʒa.miːl/",
      explanation: "رَكِّزْ عَلَى صَوْتِ الْجِيمِ وَالْمِيمِ وَاللَّامِ.",
      difficulty: "intermediate",
      category: "pronunciation"
    },
    {
      id: 7,
      type: QUESTION_TYPES.TRANSLATION,
      question: "تَرْجِمْ إِلَى الْإِنْجِلِيزِيَّةِ:",
      text: "صَبَاحُ الْخَيْرِ",
      correctAnswer: "Good morning",
      explanation: "صَبَاحُ الْخَيْرِ بِالْإِنْجِلِيزِيَّةِ هُوَ 'Good morning'.",
      difficulty: "beginner",
      category: "translation"
    },
    {
      id: 8,
      type: QUESTION_TYPES.GRAMMAR,
      question: "اخْتَرِ الصِّيغَةَ الصَّحِيحَةَ:",
      text: "أَنَا ___ إِلَى الْمَدْرَسَةِ كُلَّ يَوْمٍ.",
      options: ["أَذْهَبُ", "يَذْهَبُ", "ذَاهِبٌ", "ذَهَبْتُ"],
      correct: 0,
      explanation: "مَعَ 'كُلَّ يَوْمٍ' نَسْتَخْدِمُ الْمُضَارِعَ: 'أَذْهَبُ'.",
      difficulty: "intermediate",
      category: "grammar"
    }
  ],
  dutch: [
    {
      id: 1,
      type: QUESTION_TYPES.MULTIPLE_CHOICE,
      question: "Wat is de hoofdstad van Frankrijk?",
      options: ["Londen", "Parijs", "Berlijn", "Madrid"],
      correct: 1,
      explanation: "Parijs is de hoofdstad en grootste stad van Frankrijk.",
      difficulty: "beginner",
      category: "geography"
    },
    {
      id: 2,
      type: QUESTION_TYPES.TRUE_FALSE,
      question: "De aarde is plat.",
      options: ["Waar", "Niet waar"],
      correct: 1,
      explanation: "De aarde is ongeveer bolvormig, niet plat.",
      difficulty: "beginner",
      category: "science"
    }
  ],
  indonesian: [
    {
      id: 1,
      type: QUESTION_TYPES.MULTIPLE_CHOICE,
      question: "Apa ibu kota Prancis?",
      options: ["London", "Paris", "Berlin", "Madrid"],
      correct: 1,
      explanation: "Paris adalah ibu kota dan kota terbesar Prancis.",
      difficulty: "beginner",
      category: "geography"
    }
  ],
  malay: [
    {
      id: 1,
      type: QUESTION_TYPES.MULTIPLE_CHOICE,
      question: "Apakah ibu kota Perancis?",
      options: ["London", "Paris", "Berlin", "Madrid"],
      correct: 1,
      explanation: "Paris adalah ibu kota dan bandar terbesar Perancis.",
      difficulty: "beginner",
      category: "geography"
    }
  ],
  thai: [
    {
      id: 1,
      type: QUESTION_TYPES.MULTIPLE_CHOICE,
      question: "เมืองหลวงของฝรั่งเศสคืออะไร?",
      options: ["ลอนดอน", "ปารีส", "เบอร์ลิน", "มาดริด"],
      correct: 1,
      explanation: "ปารีสเป็นเมืองหลวงและเมืองที่ใหญ่ที่สุดของฝรั่งเศส",
      difficulty: "beginner",
      category: "geography"
    }
  ],
  khmer: [
    {
      id: 1,
      type: QUESTION_TYPES.MULTIPLE_CHOICE,
      question: "តើរាជធានីនៃប្រទេសបារាំងគឺជាអ្វី?",
      options: ["ឡុងដុន", "ប៉ារីស", "ប៊ែរលីន", "ម៉ាឌ្រីដ"],
      correct: 1,
      explanation: "ប៉ារីសគឺជារាជធានីនិងទីក្រុងធំបំផុតនៃប្រទេសបារាំង",
      difficulty: "beginner",
      category: "geography"
    }
  ]
};

const EnhancedQuiz = ({ selectedLanguage = "english", onFinish, onQuestionComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [selectedLeftItem, setSelectedLeftItem] = useState(null);
  const [startTime, setStartTime] = useState(Date.now());
  const [showConfetti, setShowConfetti] = useState(false);
  const [autoAdvanceTimeout, setAutoAdvanceTimeout] = useState(null);
  const confettiTimeoutRef = useRef(null);

  // Get questions for selected language
  const questions = ENHANCED_QUIZ_QUESTIONS[selectedLanguage] || ENHANCED_QUIZ_QUESTIONS.english;
  const currentQuestionObj = questions[currentQuestion];
  const isQuestionArabic = /[\u0600-\u06FF]/.test(currentQuestionObj?.question || '');

  // Function to advance to next question
  const advanceToNextQuestion = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setUserAnswer("");
      setShowResult(false);
      setIsCorrect(false);
      setMatchedPairs([]);
      setSelectedLeftItem(null);
    } else {
      // Quiz finished
      const finalScore = quizScore;
      const totalQuestions = questions.length;
      if (onFinish) {
        onFinish(finalScore, totalQuestions, timeSpent);
      }
    }
  }, [currentQuestion, questions.length, quizScore, timeSpent, onFinish]);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  // Cleanup timeout on unmount or question change
  useEffect(() => {
    return () => {
      if (autoAdvanceTimeout) {
        clearTimeout(autoAdvanceTimeout);
      }
    };
  }, [autoAdvanceTimeout]);

  // Initialize drag and drop items
  useEffect(() => {
    if (currentQuestionObj?.type === QUESTION_TYPES.MATCHING) {
      setMatchedPairs([]);
      setSelectedLeftItem(null);
    }
  }, [currentQuestionObj]);

  const handleAnswer = useCallback((answerIndex) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);

    let correct = false;
    if (currentQuestionObj.type === QUESTION_TYPES.TRUE_FALSE) {
      correct = answerIndex === currentQuestionObj.correct;
    } else if (currentQuestionObj.type === QUESTION_TYPES.MULTIPLE_CHOICE) {
      correct = answerIndex === currentQuestionObj.correct;
    } else if (currentQuestionObj.type === QUESTION_TYPES.FILL_BLANK) {
      correct = currentQuestionObj.options[answerIndex] === currentQuestionObj.blank;
    }

    setIsCorrect(correct);
    if (correct) {
      setQuizScore(prev => prev + 1);
      // Clear any existing confetti timeout
      if (confettiTimeoutRef.current) {
        clearTimeout(confettiTimeoutRef.current);
      }
      // Trigger confetti animation for correct answers
      setShowConfetti(true);
      // Stop confetti after 3 seconds
      confettiTimeoutRef.current = setTimeout(() => {
        setShowConfetti(false);
        confettiTimeoutRef.current = null;
      }, 3000);
      // Auto-advance to next question after 3 seconds
      const timeout = setTimeout(() => {
        advanceToNextQuestion();
      }, 3000);
      setAutoAdvanceTimeout(timeout);
    }

    // Speak the selected answer
    const answerText = currentQuestionObj.options[answerIndex];
    const lang = /[\u0600-\u06FF]/.test(answerText) ? "arabic" : selectedLanguage;
    speakText(answerText, lang);

    if (onQuestionComplete) {
      onQuestionComplete(currentQuestion, correct, answerText);
    }
  }, [currentQuestionObj, selectedLanguage, showResult, onQuestionComplete, currentQuestion]);

  const handleShortAnswer = useCallback(() => {
    if (showResult || !userAnswer.trim()) return;
    
    setShowResult(true);
    const correctAnswer = currentQuestionObj.answer || currentQuestionObj.correctAnswer;
    const correct = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
    
    setIsCorrect(correct);
    if (correct) {
      setQuizScore(prev => prev + 1);
      // Clear any existing confetti timeout
      if (confettiTimeoutRef.current) {
        clearTimeout(confettiTimeoutRef.current);
      }
      // Trigger confetti animation for correct answers
      setShowConfetti(true);
      // Stop confetti after 3 seconds
      confettiTimeoutRef.current = setTimeout(() => {
        setShowConfetti(false);
        confettiTimeoutRef.current = null;
      }, 3000);
      // Auto-advance to next question after 3 seconds
      const timeout = setTimeout(() => {
        advanceToNextQuestion();
      }, 3000);
      setAutoAdvanceTimeout(timeout);
    }

    // Speak user's answer
    const lang = /[\u0600-\u06FF]/.test(userAnswer) ? "arabic" : selectedLanguage;
    speakText(userAnswer, lang);

    if (onQuestionComplete) {
      onQuestionComplete(currentQuestion, correct, userAnswer);
    }
  }, [userAnswer, currentQuestionObj, selectedLanguage, showResult, onQuestionComplete, currentQuestion]);

  const handleMatching = useCallback((leftIndex, rightIndex) => {
    if (showResult) return;
    
    // Check if this left item is already matched
    const existingMatch = matchedPairs.find(pair => pair.left === leftIndex);
    if (existingMatch) {
      // Remove existing match
      setMatchedPairs(prev => prev.filter(pair => pair.left !== leftIndex));
    }
    
    // Check if this right item is already matched
    const existingRightMatch = matchedPairs.find(pair => pair.right === rightIndex);
    if (existingRightMatch) {
      // Remove existing match
      setMatchedPairs(prev => prev.filter(pair => pair.right !== rightIndex));
    }
    
    // Add new match
    const newMatchedPairs = [...matchedPairs.filter(pair => pair.left !== leftIndex), { left: leftIndex, right: rightIndex }];
    setMatchedPairs(newMatchedPairs);
    
    // Check if all pairs are matched
    if (newMatchedPairs.length === currentQuestionObj.leftItems.length) {
      setShowResult(true);
      const correct = newMatchedPairs.every(pair => 
        pair.right === currentQuestionObj.correctMatches[pair.left]
      );
      setIsCorrect(correct);
      if (correct) {
        setQuizScore(prev => prev + 1);
      }
      
      if (onQuestionComplete) {
        onQuestionComplete(currentQuestion, correct, `Matched ${newMatchedPairs.length} pairs`);
      }
    }
  }, [matchedPairs, currentQuestionObj, showResult, onQuestionComplete, currentQuestion]);

  const playAudio = useCallback(() => {
    if (currentQuestionObj?.audioText) {
      setIsPlaying(true);
      const lang = /[\u0600-\u06FF]/.test(currentQuestionObj.audioText) ? "arabic" : selectedLanguage;
      speakText(currentQuestionObj.audioText, lang).then(() => {
        setIsPlaying(false);
      });
    }
  }, [currentQuestionObj, selectedLanguage]);

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setUserAnswer("");
    setShowResult(false);
    setIsCorrect(false);
    setMatchedPairs([]);
    setSelectedLeftItem(null);
    setStartTime(Date.now());
    setShowConfetti(false);
    // Clear any pending confetti timeout
    if (confettiTimeoutRef.current) {
      clearTimeout(confettiTimeoutRef.current);
      confettiTimeoutRef.current = null;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Quiz finished
      if (onFinish) {
        onFinish(quizScore, questions.length, timeSpent);
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setUserAnswer("");
    setShowResult(false);
    setIsCorrect(false);
    setQuizScore(0);
    setTimeSpent(0);
    setStartTime(Date.now());
    setMatchedPairs([]);
    setSelectedLeftItem(null);
    setShowConfetti(false);
    // Clear any pending confetti timeout
    if (confettiTimeoutRef.current) {
      clearTimeout(confettiTimeoutRef.current);
      confettiTimeoutRef.current = null;
    }
  };

  if (!currentQuestionObj) return <div>Loading quiz...</div>;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 p-4">
      {/* Confetti Animation */}
      <EnhancedConfetti 
        show={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />
      {/* Quiz Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-white text-2xl font-bold">
          Question {currentQuestion + 1}/{questions.length}
        </h2>
        <div className="flex items-center space-x-4 text-sm text-slate-300">
          <div className="flex items-center space-x-1">
            <Star className="text-yellow-400" size={16} />
            <span>{quizScore}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="text-blue-400" size={16} />
            <span>{formatTime(timeSpent)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Target className="text-green-400" size={16} />
            <span>{Math.round((quizScore / (currentQuestion + 1)) * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
            {currentQuestionObj.category?.toUpperCase()}
          </span>
          <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded">
            {currentQuestionObj.difficulty?.toUpperCase()}
          </span>
        </div>

        <p
          className={`text-white text-lg mb-4 ${isQuestionArabic ? "text-right" : "text-left"}`}
          dir={isQuestionArabic ? "rtl" : "auto"}
        >
          {currentQuestionObj.question}
        </p>

        {/* Audio Question */}
        {currentQuestionObj.type === QUESTION_TYPES.LISTENING && (
          <div className="text-center mb-6">
            <button
              onClick={playAudio}
              disabled={isPlaying}
              className="bg-blue-600 text-white p-4 rounded-full hover:bg-blue-500 transition-colors disabled:opacity-50"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <p className="text-slate-400 mt-2">Click to listen</p>
          </div>
        )}

        {/* Pronunciation Question */}
        {currentQuestionObj.type === QUESTION_TYPES.PRONUNCIATION && (
          <div className="text-center mb-6">
            <div className="bg-slate-700 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                {currentQuestionObj.word}
              </h3>
              <p className="text-slate-400 mb-4">
                {currentQuestionObj.phonetic}
              </p>
              <button
                onClick={() => speakText(currentQuestionObj.word, selectedLanguage)}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-500 transition-colors"
              >
                <Volume2 className="inline mr-2" size={16} />
                Listen
              </button>
            </div>
          </div>
        )}

        {/* Question Content */}
        {renderQuestionContent()}

        {/* Result Display */}
        {showResult && (
          <div className="mt-6 p-4 bg-slate-700/50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              {isCorrect ? (
                <Check className="text-green-400" size={24} />
              ) : (
                <X className="text-red-400" size={24} />
              )}
              <span className={`font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </span>
            </div>
            {currentQuestionObj.explanation && (
              <p className="text-slate-300 text-sm mb-4">
                {currentQuestionObj.explanation}
              </p>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={resetQuiz}
            className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw size={16} />
            <span>Reset Quiz</span>
          </button>
          
          {showResult && (
            <button
              onClick={nextQuestion}
              className="px-6 py-3 bg-blue-600 rounded-xl text-white font-medium hover:bg-blue-500 transition-colors"
            >
              {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  function renderQuestionContent() {
    switch (currentQuestionObj.type) {
      case QUESTION_TYPES.SHORT_ANSWER:
      case QUESTION_TYPES.TRANSLATION:
        return (
          <div className="space-y-4">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder={
                isQuestionArabic
                  ? "اكْتُبْ إِجَابَتَكَ هُنَا..."
                  : "Enter your answer here..."
              }
              className={`w-full p-4 rounded-xl text-white bg-slate-700 border-2 focus:outline-none focus:border-blue-400 ${
                showResult
                  ? isCorrect
                    ? "border-green-400 bg-green-600"
                    : "border-red-400 bg-red-600"
                  : "border-transparent"
              }`}
              dir={isQuestionArabic ? "rtl" : "auto"}
            />
            {!showResult && (
              <button
                onClick={handleShortAnswer}
                className="w-full px-6 py-3 bg-blue-600 rounded-xl text-white font-medium hover:bg-blue-500"
              >
                Submit Answer
              </button>
            )}
          </div>
        );

      case QUESTION_TYPES.MATCHING:
        return (
          <div className="space-y-4">
            <div className="text-center text-slate-300 text-sm">
              Click on an item from the left column, then click on its matching item from the right column
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-medium mb-3 text-center">Left Side</h4>
                {currentQuestionObj.leftItems.map((item, index) => {
                  const isMatched = matchedPairs.some(pair => pair.left === index);
                  const isCorrect = isMatched && matchedPairs.find(pair => pair.left === index)?.right === currentQuestionObj.correctMatches[index];
                  
                  return (
                    <div
                      key={index}
                      className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors text-center ${
                        showResult
                          ? isCorrect
                            ? 'bg-green-600 text-white'
                            : isMatched
                            ? 'bg-red-600 text-white'
                            : 'bg-slate-600'
                          : isMatched
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-600 hover:bg-slate-500'
                      }`}
                      onClick={() => {
                        if (!showResult) {
                          setSelectedLeftItem(index);
                        }
                      }}
                    >
                      {item}
                      {isMatched && showResult && (
                        <div className="text-xs mt-1">
                          {isCorrect ? '✓' : '✗'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div>
                <h4 className="text-white font-medium mb-3 text-center">Right Side</h4>
                {currentQuestionObj.rightItems.map((item, index) => {
                  const isMatched = matchedPairs.some(pair => pair.right === index);
                  const isCorrect = isMatched && matchedPairs.find(pair => pair.right === index)?.left === currentQuestionObj.correctMatches.indexOf(index);
                  
                  return (
                    <div
                      key={index}
                      className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors text-center ${
                        showResult
                          ? isCorrect
                            ? 'bg-green-600 text-white'
                            : isMatched
                            ? 'bg-red-600 text-white'
                            : 'bg-slate-600'
                          : isMatched
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-600 hover:bg-slate-500'
                      }`}
                      onClick={() => {
                        if (!showResult && selectedLeftItem !== null) {
                          handleMatching(selectedLeftItem, index);
                          setSelectedLeftItem(null);
                        }
                      }}
                    >
                      {item}
                      {isMatched && showResult && (
                        <div className="text-xs mt-1">
                          {isCorrect ? '✓' : '✗'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            {selectedLeftItem !== null && !showResult && (
              <div className="text-center text-blue-400 text-sm">
                Now click on the matching item from the right column
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="space-y-2">
            {currentQuestionObj.options?.map((option, index) => {
              const isArabic = /[\u0600-\u06FF]/.test(option);
              const lang = isArabic ? "arabic" : selectedLanguage;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl text-white ${
                    isArabic ? "text-right" : "text-left"
                  } ${
                    showResult
                      ? index === currentQuestionObj.correct
                        ? "bg-green-600 border-2 border-green-400"
                        : selectedAnswer === index
                        ? "bg-red-600 border-2 border-red-400"
                        : "bg-slate-700"
                      : "bg-slate-700 hover:bg-slate-600"
                  }`}
                  dir={isArabic ? "rtl" : "auto"}
                >
                  <div className="flex justify-between items-center">
                    <span dir={isArabic ? "rtl" : "auto"}>{option}</span>
                    {showResult && (
                      <>
                        {index === currentQuestionObj.correct && (
                          <Check className="text-green-400" />
                        )}
                        {selectedAnswer === index && index !== currentQuestionObj.correct && (
                          <X className="text-red-400" />
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            speakText(option, lang);
                          }}
                          className="text-blue-400 ml-2"
                        >
                          <Volume2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        );
    }
  }
};

export default EnhancedQuiz;
