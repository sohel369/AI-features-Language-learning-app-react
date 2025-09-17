// QuizScreen.js
import React, { useState, useCallback } from "react";
import { Volume2, Check, X } from "lucide-react";
import speakText from "./TextToSpeech"; // Google TTS function

const QuizScreen = ({ selectedLanguage = "english", onFinish }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Ensure questions array exists
  const questions = QUIZ_QUESTIONS[selectedLanguage] || QUIZ_QUESTIONS.english;
  const currentQuestionObj = questions[currentQuestion];

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

      // Speak selected answer
      const answerText =
        currentQuestionObj.type === "true_false"
          ? answerIndex === 0
            ? "True"
            : "False"
          : currentQuestionObj.options[answerIndex];
      const lang = /[\u0600-\u06FF]/.test(answerText) ? "arabic" : selectedLanguage;
      speakText(answerText, lang);
    },
    [currentQuestionObj, selectedLanguage, showResult]
  );

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      if (onFinish) {
        onFinish(quizScore, questions.length);
      } else {
        alert(`Quiz finished! Your score: ${quizScore}/${questions.length}`);
      }
    }
  };

  if (!currentQuestionObj) return <div>Loading quiz...</div>;

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-white text-2xl font-bold">
        Question {currentQuestion + 1}/{questions.length}
      </h2>
      <p className="text-white text-lg mb-4">{currentQuestionObj.question}</p>

      <div className="space-y-2">
        {currentQuestionObj.options &&
          currentQuestionObj.options.map((option, index) => {
            const isArabic = /[\u0600-\u06FF]/.test(option);
            const lang = isArabic ? "arabic" : selectedLanguage;

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showResult}
                className={`w-full p-4 rounded-xl text-left text-white ${
                  showResult
                    ? index === currentQuestionObj.correct
                      ? "bg-green-600 border-2 border-green-400"
                      : selectedAnswer === index
                      ? "bg-red-600 border-2 border-red-400"
                      : "bg-slate-700"
                    : "bg-slate-700 hover:bg-slate-600"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>{option}</span>
                  {showResult && (
                    <>
                      {index === currentQuestionObj.correct && <Check className="text-green-400" />}
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

      {showResult && (
        <button
          onClick={nextQuestion}
          className="mt-4 px-6 py-3 bg-blue-600 rounded-xl text-white font-medium hover:bg-blue-500"
        >
          {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
        </button>
      )}
    </div>
  );
};

export default QuizScreen;
