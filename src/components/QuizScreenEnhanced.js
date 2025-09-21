import React, { useState } from 'react';
import EnhancedQuiz from './EnhancedQuiz';
import Quiz from '../quiz';

const QuizScreenEnhanced = ({ selectedLanguage = "english", onFinish }) => {
  const [useEnhancedQuiz, setUseEnhancedQuiz] = useState(true);
  const [quizFinished, setQuizFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);

  const handleQuizFinish = (score, total, timeSpent) => {
    setFinalScore({ score, total, timeSpent });
    setQuizFinished(true);
    if (onFinish) {
      onFinish(score, total);
    }
  };

  const handleQuestionComplete = (questionIndex, isCorrect, answer) => {
    console.log(`Question ${questionIndex + 1}: ${isCorrect ? 'Correct' : 'Incorrect'} - ${answer}`);
  };

  if (quizFinished && finalScore) {
    return (
      <div className="space-y-6 p-4">
        <div className="bg-gradient-to-br from-green-800 to-blue-800 rounded-2xl p-6 text-center text-white">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
          <div className="space-y-2 mb-6">
            <p className="text-xl">Score: {finalScore.score}/{finalScore.total}</p>
            <p className="text-lg">Accuracy: {Math.round((finalScore.score / finalScore.total) * 100)}%</p>
            <p className="text-lg">Time: {Math.floor(finalScore.timeSpent / 60)}:{(finalScore.timeSpent % 60).toString().padStart(2, '0')}</p>
          </div>
          <div className="flex space-x-4 justify-center">
            <button
              onClick={() => {
                setQuizFinished(false);
                setFinalScore(null);
                setQuizStarted(false);
              }}
              className="bg-white text-green-800 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors"
            >
              Retake Quiz
            </button>
            <button
              onClick={() => window.location.href = '/home'}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-500 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show quiz selection if not started
  if (!quizStarted) {
    return (
      <div className="space-y-6 p-4">
        <div className="text-center">
          <h2 className="text-white text-3xl font-bold mb-4">Choose Your Quiz</h2>
          <p className="text-slate-300 mb-8">Select the type of quiz you'd like to take</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Enhanced Quiz Card */}
          <div className="bg-gradient-to-br from-blue-800 to-purple-900 rounded-2xl p-6 text-white">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Enhanced Quiz</h3>
              <p className="text-blue-200">Advanced quiz with multiple question types</p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                <span>8 Different Question Types</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                <span>Audio & Pronunciation Practice</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                <span>Real-time Scoring & Timing</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                <span>Google TTS Integration</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                <span>Arabic Vowel Support</span>
              </div>
            </div>

            <button
              onClick={() => {
                setUseEnhancedQuiz(true);
                setQuizStarted(true);
              }}
              className="w-full bg-white text-blue-800 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors"
            >
              Start Enhanced Quiz
            </button>
          </div>

          {/* Basic Quiz Card */}
          <div className="bg-gradient-to-br from-green-800 to-teal-900 rounded-2xl p-6 text-white">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Basic Quiz</h3>
              <p className="text-green-200">Simple quiz with standard questions</p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                <span>Multiple Choice Questions</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                <span>True/False Questions</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                <span>Fill in the Blank</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                <span>Quick & Simple</span>
              </div>
            </div>

            <button
              onClick={() => {
                setUseEnhancedQuiz(false);
                setQuizStarted(true);
              }}
              className="w-full bg-white text-green-800 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors"
            >
              Start Basic Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quiz Type Toggle */}
      <div className="flex justify-center">
        <div className="bg-slate-800 rounded-xl p-1">
          <button
            onClick={() => setUseEnhancedQuiz(true)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              useEnhancedQuiz ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Enhanced Quiz
          </button>
          <button
            onClick={() => setUseEnhancedQuiz(false)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              !useEnhancedQuiz ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Basic Quiz
          </button>
        </div>
      </div>

      {/* Quiz Content */}
      {useEnhancedQuiz ? (
        <EnhancedQuiz
          selectedLanguage={selectedLanguage}
          onFinish={handleQuizFinish}
          onQuestionComplete={handleQuestionComplete}
        />
      ) : (
        <Quiz
          selectedLanguage={selectedLanguage}
          onFinish={handleQuizFinish}
        />
      )}
    </div>
  );
};

export default QuizScreenEnhanced;
