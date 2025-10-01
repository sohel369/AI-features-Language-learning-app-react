import React, { useState, useCallback } from 'react';
import { Volume2, Check, X, Play } from 'lucide-react';
import { QUIZ_QUESTIONS, INTERFACE_LANGUAGES, TRANSLATIONS } from '../data/languageData';

const QuizScreen = ({ selectedLanguage, onSpeakText, onFinish }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [isCurrentCorrect, setIsCurrentCorrect] = useState(false);

  // Get current language with RTL support
  const currentLanguage = INTERFACE_LANGUAGES[selectedLanguage];

  // Translation function
  const t = (key) => {
    return TRANSLATIONS[selectedLanguage]?.[key] || TRANSLATIONS.english[key] || key;
  };

  const questions = QUIZ_QUESTIONS[selectedLanguage] || QUIZ_QUESTIONS.english;
  const currentQuestionObj = questions[currentQuestion];

  // Check if question contains Arabic text
  const isQuestionArabic = /[\u0600-\u06FF]/.test(currentQuestionObj?.question || '');

  const handleAnswer = useCallback(
    (answerIndex) => {
      if (showResult) return; // prevent multiple clicks
      setSelectedAnswer(answerIndex);
      setShowResult(true);

      let isCorrect = false;

      if (currentQuestionObj.type === "true_false") {
        isCorrect = answerIndex === currentQuestionObj.correct;
      } else if (currentQuestionObj.type === "multiple_choice") {
        isCorrect = answerIndex === currentQuestionObj.correct;
      } else if (currentQuestionObj.type === "fill_blank") {
        isCorrect = currentQuestionObj.options[answerIndex] === currentQuestionObj.blank;
      }

      if (isCorrect) {
        setQuizScore((prev) => prev + 1);
      }
      setIsCurrentCorrect(isCorrect);

      // Speak selected answer
      const answerText = currentQuestionObj.options[answerIndex];
      const lang = /[\u0600-\u06FF]/.test(answerText) ? "arabic" : selectedLanguage;
      onSpeakText && onSpeakText(answerText, lang);
    },
    [currentQuestionObj, selectedLanguage, showResult, onSpeakText]
  );

  const handleShortAnswer = useCallback(() => {
    if (showResult || !userAnswer.trim()) return;
    setShowResult(true);

    const correctAnswer = currentQuestionObj.answer.toLowerCase().trim();
    const userAns = userAnswer.toLowerCase().trim();
    const isCorrectBool = userAns === correctAnswer;

    setSelectedAnswer(userAnswer);
    if (isCorrectBool) {
      setQuizScore((prev) => prev + 1);
    }
    setIsCurrentCorrect(isCorrectBool);

    // Speak user's answer
    const lang = /[\u0600-\u06FF]/.test(userAnswer) ? "arabic" : selectedLanguage;
    onSpeakText && onSpeakText(userAnswer, lang);
  }, [userAnswer, currentQuestionObj, selectedLanguage, showResult, onSpeakText]);

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setUserAnswer("");
    setShowResult(false);
    setIsCurrentCorrect(false);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // Quiz finished
      if (onFinish) {
        onFinish(quizScore, questions.length);
      }
    }
  };

  if (!currentQuestionObj) return <div>Loading quiz...</div>;

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-white text-2xl font-bold">
        {t('question')} {currentQuestion + 1}/{questions.length}
      </h2>
      <p
        className={`text-white text-lg mb-4 ${isQuestionArabic ? "text-right" : "text-left"}`}
        dir={isQuestionArabic ? "rtl" : "auto"}
      >
        {currentQuestionObj.question}
      </p>

      {currentQuestionObj.type === "short_answer" ? (
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
            className={`w-full p-4 rounded-xl text-white bg-slate-700 border-2 focus:outline-none focus:border-blue-400 ${showResult
              ? isCurrentCorrect
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
          {showResult && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                {isCurrentCorrect ? (
                  <Check className="text-green-400" />
                ) : (
                  <X className="text-red-400" />
                )}
                <button
                  onClick={() => {
                    const lang = /[\u0600-\u06FF]/.test(userAnswer)
                      ? "arabic"
                      : selectedLanguage;
                    onSpeakText && onSpeakText(userAnswer, lang);
                  }}
                  className="text-blue-400"
                >
                  <Volume2 size={16} />
                </button>
              </div>
              {!isCurrentCorrect && (
                <div className="space-y-2">
                  <p className="text-green-400 font-medium">
                    {t('correctAnswer')}: {currentQuestionObj.answer}
                  </p>
                  <button
                    onClick={() => onSpeakText && onSpeakText(currentQuestionObj.answer, "arabic")}
                    className="text-blue-400 flex items-center"
                  >
                    <Volume2 size={16} className="mr-1" />
                    Hear correct answer
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {currentQuestionObj.options.map((option, index) => {
            const isArabic = /[\u0600-\u06FF]/.test(option);
            const lang = isArabic ? "arabic" : selectedLanguage;

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showResult}
                className={`w-full p-4 rounded-xl text-white ${isArabic ? "text-right" : "text-left"
                  } ${showResult
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
                      {selectedAnswer === index &&
                        index !== currentQuestionObj.correct && (
                          <X className="text-red-400" />
                        )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSpeakText && onSpeakText(option, lang);
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
      )}

      {showResult && (
        <button
          onClick={nextQuestion}
          className="mt-4 px-6 py-3 bg-blue-600 rounded-xl text-white font-medium hover:bg-blue-500"
        >
          {currentQuestion < questions.length - 1 ? t('nextQuestion') : t('finishQuiz')}
        </button>
      )}
    </div>
  );
};

export default QuizScreen;
