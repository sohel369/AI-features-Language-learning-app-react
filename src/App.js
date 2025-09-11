import React, { useState, useEffect } from 'react';
import { Book, FileText, Star, User, Home, Volume2, Trophy, Zap, Calendar, Target, Award, PlayCircle, Heart, ChevronRight, Check, X } from 'lucide-react';

// Mock data
const vocabularyData = {
  Animals: [
    { word: 'Cat', translation: 'قطة', pronunciation: 'qitta', language: 'Arabic' },
    { word: 'Dog', translation: 'كلب', pronunciation: 'kalb', language: 'Arabic' },
    { word: 'Cat', translation: 'ឆ្មា', pronunciation: 'chmaa', language: 'Khmer' },
    { word: 'Dog', translation: 'ឆ្កែ', pronunciation: 'chkae', language: 'Khmer' },
  ],
  Food: [
    { word: 'Apple', translation: 'تفاحة', pronunciation: 'tuffaha', language: 'Arabic' },
    { word: 'Bread', translation: 'خبز', pronunciation: 'khubz', language: 'Arabic' },
    { word: 'Water', translation: 'ماء', pronunciation: 'maa', language: 'Arabic' },
    { word: 'Rice', translation: 'បាយ', pronunciation: 'baay', language: 'Khmer' },
    { word: 'Fish', translation: 'ត្រី', pronunciation: 'trey', language: 'Khmer' },
  ],
  Travel: [
    { word: 'Airport', translation: 'مطار', pronunciation: 'matar', language: 'Arabic' },
    { word: 'Hotel', translation: 'فندق', pronunciation: 'funduq', language: 'Arabic' },
    { word: 'Car', translation: 'سيارة', pronunciation: 'sayyara', language: 'Arabic' },
    { word: 'Road', translation: 'ផ្លូវ', pronunciation: 'phlou', language: 'Khmer' },
    { word: 'City', translation: 'ទីក្រុង', pronunciation: 'tii krong', language: 'Khmer' },
  ]
};

const quizQuestions = [
  {
    type: 'multiple-choice',
    question: 'What does "قطة" mean in English?',
    options: ['Dog', 'Cat', 'Bird', 'Fish'],
    correct: 1,
    difficulty: 'easy'
  },
  {
    type: 'fill-blank',
    question: 'Complete: A ____ is "كلب" in Arabic',
    answer: 'dog',
    difficulty: 'medium'
  },
  {
    type: 'match',
    question: 'Match the word with its meaning',
    pairs: [
      { word: 'Apple', translation: 'تفاحة' },
      { word: 'Water', translation: 'ماء' }
    ],
    difficulty: 'hard'
  }
];

const achievements = [
  { id: 1, name: 'First Steps', icon: '🎯', unlocked: true, description: 'Complete your first lesson' },
  { id: 2, name: 'Vocabulary Master', icon: '📚', unlocked: true, description: 'Learn 50 words' },
  { id: 3, name: 'Quiz Champion', icon: '🏆', unlocked: false, description: 'Score 100% on 5 quizzes' },
  { id: 4, name: 'Streak Warrior', icon: '🔥', unlocked: false, description: 'Maintain a 7-day streak' },
];

const lessons = [
  { id: 1, title: 'Basic Greetings', progress: 5, total: 5, unlocked: true, xp: 50 },
  { id: 2, title: 'Family Members', progress: 3, total: 5, unlocked: true, xp: 30 },
  { id: 3, title: 'Numbers 1-10', progress: 0, total: 4, unlocked: true, xp: 0 },
  { id: 4, title: 'Colors', progress: 0, total: 6, unlocked: false, xp: 0 },
];

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [user, setUser] = useState({
    name: 'Mohammed E.',
    xp: 1250,
    streak: 5,
    level: 3,
    targetLanguage: 'Arabic'
  });
  const [selectedCategory, setSelectedCategory] = useState('Animals');
  const [favorites, setFavorites] = useState(new Set());
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [isFlipped, setIsFlipped] = useState({});
  const [fontSize, setFontSize] = useState('normal');

  const toggleFavorite = (word) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(word)) {
      newFavorites.delete(word);
    } else {
      newFavorites.add(word);
    }
    setFavorites(newFavorites);
  };

  const playAudio = (text, language) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'Arabic' ? 'ar' : language === 'Khmer' ? 'km' : 'en';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const startQuiz = (difficulty = 'easy') => {
    const filteredQuestions = quizQuestions.filter(q => q.difficulty === difficulty);
    setCurrentQuiz({
      questions: filteredQuestions,
      currentQuestion: 0,
      score: 0,
      difficulty
    });
    setQuizAnswers({});
    setShowResults(false);
  };

  const submitQuizAnswer = (answer) => {
    const question = currentQuiz.questions[currentQuiz.currentQuestion];
    const isCorrect = question.type === 'multiple-choice' 
      ? answer === question.correct
      : answer.toLowerCase() === question.answer?.toLowerCase();

    setQuizAnswers(prev => ({
      ...prev,
      [currentQuiz.currentQuestion]: { answer, correct: isCorrect }
    }));

    setTimeout(() => {
      if (currentQuiz.currentQuestion < currentQuiz.questions.length - 1) {
        setCurrentQuiz(prev => ({
          ...prev,
          currentQuestion: prev.currentQuestion + 1,
          score: prev.score + (isCorrect ? 1 : 0)
        }));
      } else {
        setCurrentQuiz(prev => ({ ...prev, score: prev.score + (isCorrect ? 1 : 0) }));
        setShowResults(true);
      }
    }, 1500);
  };

  const flipCard = (index) => {
    setIsFlipped(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const BottomNavigation = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-900 to-purple-800 px-6 py-4 z-50 shadow-2xl rounded-t-2xl">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {[
          { id: 'dashboard', icon: Home, label: 'Home' },
          { id: 'vocabulary', icon: Book, label: 'Lessons' },
          { id: 'quiz', icon: FileText, label: 'Quizzes' },
          { id: 'progress', icon: Star, label: 'Progress' },
          { id: 'profile', icon: User, label: 'Profile' }
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setCurrentPage(id)}
            className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${
              currentPage === id 
                ? 'text-amber-400 bg-white/10 scale-110 shadow-md' 
                : 'text-gray-300 hover:text-amber-400 hover:bg-white/5'
            }`}
          >
            <Icon size={26} className="mb-1" />
            <span className="text-xs font-medium tracking-wide">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );

  const Dashboard = () => (
    <div className="p-6 pb-24 min-h-screen bg-gradient-to-b from-gray-900 to-blue-950">
      <header className="bg-gradient-to-r from-blue-900 to-purple-800 text-white rounded-3xl p-8 mb-6 relative overflow-hidden shadow-2xl animate-slide-up">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full -ml-20 -mb-20"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-3 tracking-tight">Welcome, {user.name}! 🌟</h1>
          <p className="text-sm opacity-80 mb-6">Master {user.targetLanguage} with style</p>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center bg-white/5 rounded-xl p-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Zap size={20} className="text-amber-400" />
                <span className="font-bold text-xl">{user.xp}</span>
              </div>
              <span className="text-xs opacity-80">XP Points</span>
            </div>
            <div className="text-center bg-white/5 rounded-xl p-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Calendar size={20} className="text-orange-400" />
                <span className="font-bold text-xl">{user.streak}</span>
              </div>
              <span className="text-xs opacity-80">Day Streak</span>
            </div>
            <div className="text-center bg-white/5 rounded-xl p-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Trophy size={20} className="text-emerald-400" />
                <span className="font-bold text-xl">{user.level}</span>
              </div>
              <span className="text-xs opacity-80">Level</span>
            </div>
          </div>
          <div className="bg-white/10 rounded-full h-4 mb-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-400 to-orange-400 h-4 rounded-full transition-all duration-1000 relative"
              style={{ width: `${(user.xp % 500) / 5}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
            </div>
          </div>
          <p className="text-sm opacity-80">Level {user.level} • {500 - (user.xp % 500)} XP to next level</p>
        </div>
      </header>
      <section className="grid grid-cols-2 gap-4 mb-6">
        <button 
          onClick={() => setCurrentPage('vocabulary')}
          className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 shadow-lg"
        >
          <PlayCircle size={28} className="mx-auto mb-3" />
          <h3 className="font-semibold text-lg">Continue Lesson</h3>
          <p className="text-sm opacity-80">Family Members</p>
        </button>
        <button 
          onClick={() => setCurrentPage('quiz')}
          className="bg-gradient-to-br from-amber-600 to-orange-600 text-white rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 shadow-lg"
        >
          <Target size={28} className="mx-auto mb-3" />
          <h3 className="font-semibold text-lg">Take Quiz</h3>
          <p className="text-sm opacity-80">Test your knowledge</p>
        </button>
      </section>
      <section className="bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-100 mb-4 flex items-center">
          <Trophy size={22} className="text-amber-400 mr-2" />
          Recent Achievements
        </h2>
        <div className="space-y-4">
          {achievements.filter(a => a.unlocked).slice(0, 2).map(achievement => (
            <div key={achievement.id} className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl">
              <span className="text-3xl">{achievement.icon}</span>
              <div>
                <h4 className="font-medium text-gray-100">{achievement.name}</h4>
                <p className="text-sm text-gray-400">{achievement.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const VocabularyPage = () => (
    <div className="p-6 pb-24 min-h-screen bg-gradient-to-b from-gray-900 to-blue-950">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-blue-400 mb-4 tracking-tight">Vocabulary</h1>
        <div className="flex space-x-3 overflow-x-auto pb-3">
          {Object.keys(vocabularyData).map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-700 to-purple-700 text-white shadow-md'
                  : 'bg-white/5 text-gray-300 hover:bg-blue-800/50 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </header>
      <section className="space-y-4">
        {vocabularyData[selectedCategory].map((item, index) => (
          <div key={index} className="relative perspective-1000">
            <div 
              className={`flashcard transition-transform duration-600 ${isFlipped[index] ? 'rotate-y-180' : ''}`}
              onClick={() => flipCard(index)}
            >
              <div className="flashcard-front absolute w-full h-full backface-hidden">
                <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700 cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                      item.language === 'Arabic' ? 'bg-emerald-900 text-emerald-300' : 'bg-purple-900 text-purple-300'
                    }`}>
                      {item.language}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(`${item.word}-${index}`);
                      }}
                      className={`p-2 rounded-full transition-colors ${
                        favorites.has(`${item.word}-${index}`) 
                          ? 'text-red-400 bg-red-900/50' 
                          : 'text-gray-400 hover:text-red-400 hover:bg-red-900/30'
                      }`}
                    >
                      <Heart size={22} fill={favorites.has(`${item.word}-${index}`) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  <h3 className="text-2xl font-bold text-center mb-3 text-gray-100">{item.word}</h3>
                  <p className="text-center text-gray-400 text-sm">Tap to reveal translation</p>
                </div>
              </div>
              <div className="flashcard-back absolute w-full h-full backface-hidden rotate-y-180">
                <div className="bg-gradient-to-br from-blue-900 to-purple-800 rounded-2xl p-6 shadow-lg border border-blue-800">
                  <div className={`text-center ${item.language === 'Arabic' ? 'font-arabic text-right' : 'font-khmer'}`}>
                    <h3 className="text-3xl font-bold mb-3 text-blue-300">{item.translation}</h3>
                    <p className="text-lg text-gray-300 mb-4">{item.pronunciation}</p>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playAudio(item.word, 'en');
                        }}
                        className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg shadow hover:shadow-md transition-shadow duration-300 text-gray-100"
                      >
                        <Volume2 size={18} className="text-blue-400" />
                        <span>English</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playAudio(item.translation, item.language);
                        }}
                        className="flex items-center space-x-2 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors duration-300"
                      >
                        <Volume2 size={18} />
                        <span>{item.language}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );

  const QuizPage = () => {
    if (currentQuiz && !showResults) {
      const question = currentQuiz.questions[currentQuiz.currentQuestion];
      const userAnswer = quizAnswers[currentQuiz.currentQuestion];
      
      return (
        <div className="p-6 pb-24 min-h-screen bg-gradient-to-b from-gray-900 to-blue-950">
          <header className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setCurrentQuiz(null)}
                className="text-blue-400 hover:text-blue-300 font-semibold"
              >
                ← Back
              </button>
              <span className="text-sm text-gray-400 font-medium">
                {currentQuiz.currentQuestion + 1} / {currentQuiz.questions.length}
              </span>
            </div>
            <div className="bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-700 to-purple-700 h-3 rounded-full transition-all duration-500"
                style={{ width: `${((currentQuiz.currentQuestion + 1) / currentQuiz.questions.length) * 100}%` }}
              ></div>
            </div>
          </header>
          <section className="bg-gray-800 rounded-2xl p-6 shadow-lg animate-slide-up">
            <h2 className="text-xl font-semibold text-gray-100 mb-6">{question.question}</h2>
            {question.type === 'multiple-choice' && (
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => !userAnswer && submitQuizAnswer(index)}
                    disabled={userAnswer}
                    className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
                      userAnswer
                        ? index === question.correct
                          ? 'bg-emerald-900 border-2 border-emerald-500 text-emerald-300'
                          : userAnswer.answer === index
                          ? 'bg-red-900 border-2 border-red-500 text-red-300'
                          : 'bg-gray-700 border border-gray-600'
                        : 'bg-gray-700 border border-gray-600 hover:bg-blue-900/50 hover:border-blue-500 hover:shadow-md text-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option}</span>
                      {userAnswer && (
                        index === question.correct ? (
                          <Check size={20} className="text-emerald-400" />
                        ) : userAnswer.answer === index ? (
                          <X size={20} className="text-red-400" />
                        ) : null
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
            {question.type === 'fill-blank' && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Type your answer..."
                  className="w-full p-4 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-100"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      submitQuizAnswer(e.target.value.trim());
                    }
                  }}
                  disabled={userAnswer}
                />
                {userAnswer && (
                  <div className={`p-3 rounded-lg font-medium ${
                    userAnswer.correct ? 'bg-emerald-900 text-emerald-300' : 'bg-red-900 text-red-300'
                  }`}>
                    {userAnswer.correct ? '✓ Correct!' : `✗ Correct answer: ${question.answer}`}
                  </div>
                )}
              </div>
            )}
            {question.type === 'match' && (
              <div className="space-y-4">
                {question.pairs.map((pair, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <span className="font-medium text-gray-100">{pair.word}</span>
                    <span className="text-blue-400">{pair.translation}</span>
                  </div>
                ))}
                <button
                  onClick={() => submitQuizAnswer('match')}
                  className="w-full p-4 rounded-xl bg-blue-700 text-white font-semibold hover:bg-blue-800 transition-colors duration-300"
                >
                  Submit Match
                </button>
              </div>
            )}
          </section>
        </div>
      );
    }

    if (showResults) {
      const percentage = Math.round((currentQuiz.score / currentQuiz.questions.length) * 100);
      
      return (
        <div className="p-6 pb-24 min-h-screen bg-gradient-to-b from-gray-900 to-blue-950">
          <section className="text-center">
            <div className="mb-6">
              <div className="text-7xl mb-4 animate-pulse">
                {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '📚'}
              </div>
              <h1 className="text-3xl font-bold text-blue-400 mb-2">Quiz Complete!</h1>
              <p className="text-xl text-gray-400">
                You scored {currentQuiz.score}/{currentQuiz.questions.length} ({percentage}%)
              </p>
            </div>
            <div className="bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-emerald-400">{currentQuiz.score}</div>
                  <div className="text-sm text-gray-400">Correct</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-400">
                    {currentQuiz.questions.length - currentQuiz.score}
                  </div>
                  <div className="text-sm text-gray-400">Wrong</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">+{currentQuiz.score * 10}</div>
                  <div className="text-sm text-gray-400">XP</div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => startQuiz(currentQuiz.difficulty)}
                className="w-full bg-blue-700 text-white p-4 rounded-xl hover:bg-blue-800 transition-colors duration-300 font-semibold"
              >
                Try Again
              </button>
              <button
                onClick={() => setCurrentQuiz(null)}
                className="w-full bg-gray-700 text-gray-300 p-4 rounded-xl hover:bg-gray-600 transition-colors duration-300 font-semibold"
              >
                Back to Quizzes
              </button>
            </div>
          </section>
        </div>
      );
    }

    return (
      <div className="p-6 pb-24 min-h-screen bg-gradient-to-b from-gray-900 to-blue-950">
        <h1 className="text-3xl font-bold text-blue-400 mb-6 tracking-tight">Quizzes</h1>
        <section className="space-y-4">
          {['easy', 'medium', 'hard'].map(difficulty => (
            <div key={difficulty} className="bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-100 capitalize mb-2">{difficulty} Level</h3>
                  <p className="text-gray-400 text-sm">
                    {difficulty === 'easy' ? 'Basic vocabulary and phrases' :
                     difficulty === 'medium' ? 'Grammar and sentence structure' :
                     'Complex conversations and idioms'}
                  </p>
                </div>
                <button
                  onClick={() => startQuiz(difficulty)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-colors duration-300 ${
                    difficulty === 'easy' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' :
                    difficulty === 'medium' ? 'bg-amber-600 hover:bg-amber-700 text-white' :
                    'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  Start
                </button>
              </div>
            </div>
          ))}
        </section>
        <section className="mt-8 bg-gradient-to-r from-blue-900 to-purple-800 rounded-2xl p-6">
          <h3 className="font-semibold mb-4 text-blue-300">Quiz Types</h3>
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              <span>Multiple Choice Questions</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              <span>Fill in the Blank</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              <span>Match Word to Meaning</span>
            </div>
          </div>
        </section>
      </div>
    );
  };

  const ProgressPage = () => (
    <div className="p-6 pb-24 min-h-screen bg-gradient-to-b from-gray-900 to-blue-950">
      <h1 className="text-3xl font-bold text-blue-400 mb-6 tracking-tight">Your Progress</h1>
      <section className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-900 to-purple-800 text-white rounded-2xl p-6 shadow-lg">
          <div className="text-center">
            <div className="text-3xl font-bold">{user.xp}</div>
            <div className="text-sm opacity-80">Total XP</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="text-center">
            <div className="text-3xl font-bold">{user.streak}</div>
            <div className="text-sm opacity-80">Day Streak</div>
          </div>
        </div>
      </section>
      <section className="bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">Lessons Progress</h2>
        <div className="space-y-4">
          {lessons.map(lesson => (
            <div key={lesson.id} className="flex items-center space-x-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                lesson.progress === lesson.total ? 'bg-emerald-600 text-white' :
                lesson.progress > 0 ? 'bg-blue-700 text-white' :
                lesson.unlocked ? 'bg-gray-600 text-gray-300' : 'bg-gray-700 text-gray-400'
              }`}>
                {lesson.progress === lesson.total ? (
                  <Check size={20} />
                ) : (
                  <span className="text-sm font-semibold">{lesson.id}</span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-100">{lesson.title}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <span>{lesson.progress}/{lesson.total} completed</span>
                  {lesson.xp > 0 && (
                    <>
                      <span>•</span>
                      <span className="text-amber-400">+{lesson.xp} XP</span>
                    </>
                  )}
                </div>
                <div className="mt-2 bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-700 to-purple-700 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(lesson.progress / lesson.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-100 mb-4 flex items-center">
          <Award size={22} className="text-amber-400 mr-2" />
          Achievements
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {achievements.map(achievement => (
            <div 
              key={achievement.id} 
              className={`p-4 rounded-xl border-2 text-center transition-all duration-300 ${
                achievement.unlocked 
                  ? 'border-amber-600 bg-amber-900/50' 
                  : 'border-gray-600 bg-gray-700 opacity-60'
              }`}
            >
              <div className="text-2xl mb-2">{achievement.icon}</div>
              <h4 className="font-medium text-sm text-gray-100">{achievement.name}</h4>
              <p className="text-xs text-gray-400 mt-1">{achievement.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const ProfilePage = () => (
    <div className="p-6 pb-24 min-h-screen bg-gradient-to-b from-gray-900 to-blue-950">
      <header className="text-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-r from-blue-900 to-purple-800 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
          {user.name[0]}
        </div>
        <h1 className="text-3xl font-bold text-blue-400">{user.name}</h1>
        <p className="text-gray-400 text-sm">Level {user.level} • Learning {user.targetLanguage}</p>
      </header>
      <section className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-4 shadow-lg text-center">
          <div className="text-2xl font-bold text-blue-400">{user.xp}</div>
          <div className="text-sm text-gray-400">XP Points</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 shadow-lg text-center">
          <div className="text-2xl font-bold text-orange-400">{user.streak}</div>
          <div className="text-sm text-gray-400">Day Streak</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 shadow-lg text-center">
          <div className="text-2xl font-bold text-emerald-400">{user.level}</div>
          <div className="text-sm text-gray-400">Level</div>
        </div>
      </section>
      <section className="space-y-4">
        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-100">Target Language</span>
              <select 
                value={user.targetLanguage}
                onChange={(e) => setUser(prev => ({ ...prev, targetLanguage: e.target.value }))}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
              >
                <option value="Arabic">Arabic</option>
                <option value="Khmer">Khmer</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-100">Font Size</span>
              <select 
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
              >
                <option value="small">Small</option>
                <option value="normal">Normal</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-100 mb-4 flex items-center">
            <Trophy size={22} className="text-amber-400 mr-2" />
            Leaderboard
          </h2>
          <div className="space-y-3">
            {[
              { name: 'Sarah M.', xp: 2150, rank: 1 },
              { name: 'Mike K.', xp: 1890, rank: 2 },
              { name: user.name, xp: user.xp, rank: 3 },
              { name: 'Lisa P.', xp: 1100, rank: 4 },
            ].map((player, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-3 rounded-lg ${
                  player.name === user.name ? 'bg-blue-900/50 border border-blue-800' : 'bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    player.rank === 1 ? 'bg-amber-500 text-white' :
                    player.rank === 2 ? 'bg-gray-400 text-white' :
                    player.rank === 3 ? 'bg-orange-500 text-white' :
                    'bg-gray-600 text-gray-300'
                  }`}>
                    {player.rank}
                  </div>
                  <span className={`font-medium ${player.name === user.name ? 'text-blue-400' : 'text-gray-100'}`}>
                    {player.name}
                  </span>
                </div>
                <span className="text-gray-400">{player.xp} XP</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'vocabulary':
        return <VocabularyPage />;
      case 'quiz':
        return <QuizPage />;
      case 'progress':
        return <ProgressPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`min-h-screen ${fontSize === 'large' ? 'text-lg' : fontSize === 'small' ? 'text-sm' : 'text-base'}`}>
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .flashcard {
          transform-style: preserve-3d;
          height: 200px;
        }
        
        .flashcard-front,
        .flashcard-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
        }
        
        .flashcard-back {
          transform: rotateY(180deg);
        }
        
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        
        .font-arabic {
          font-family: 'Noto Sans Arabic', sans-serif;
        }
        
        .font-khmer {
          font-family: 'Noto Sans Khmer', sans-serif;
        }
        
        .text-right {
          direction: rtl;
          text-align: right;
        }
        
        @keyframes slide-up {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        .animate-slide-up {
          animation: slide-up 0.5s ease-in-out;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;700&family=Noto+Sans+Khmer:wght@400;700&display=swap');
      `}</style>
      {renderPage()}
      <BottomNavigation />
    </div>
  );
}

export default App;