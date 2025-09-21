// QuizScreen.js
import React, { useState, useCallback } from "react";
import { Volume2, Check, X } from "lucide-react";
import speakText from "./TextToSpeech"; // Google TTS function

// Quiz questions for different languages
const QUIZ_QUESTIONS = {
  english: [
    {
      type: "multiple_choice",
      question: "What is the capital of France?",
      options: ["London", "Paris", "Berlin"],
      correct: 1
    },
    {
      type: "true_false",
      question: "The Earth is flat.",
      options: ["True", "False"],
      correct: 1
    },
    {
      type: "fill_blank",
      question: "The ___ is shining brightly.",
      options: ["sun", "moon", "star"],
      blank: "sun",
      correct: 0
    },
    {
      type: "short_answer",
      question: "What is 2 + 2?",
      answer: "4"
    },
    {
      type: "multiple_choice",
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic Ocean", "Pacific Ocean", "Indian Ocean"],
      correct: 1
    }
  ],
  arabic: [
    {
      type: "multiple_choice",
      question: "مَا هِيْ عَاصِمَةُ فَرْنْسَا؟",
      options: ["لُنْدُنْ", "بَارِيسْ", "بَرْلِينْ"],
      correct: 1
    },
    {
      type: "true_false",
      question: "الْأَرْضُ مُسْطَحَةٌ.",
      options: ["صَحِيْحٌ", "خَطْأٌ"],
      correct: 1
    },
    {
      type: "fill_blank",
      question: "الْـ___ تَلْمَعُ بِشِدَّةٍ.",
      options: ["شَمْسٌ", "قَمَرٌ", "نَجْمٌ"],
      blank: "شَمْسٌ",
      correct: 0
    },
    {
      type: "short_answer",
      question: "مَا هُوَ ٢ + ٢؟",
      answer: "٤"
    },
    {
      type: "multiple_choice",
      question: "مَا هُوَ أَكْبَرُ مُحِيطٍ عَلَى الْأَرْضِ؟",
      options: ["الْمُحِيطُ الْأَطْلَسِيُّ", "الْمُحِيطُ الْهَادِئُ", "الْمُحِيطُ الْهِنْدِيُّ"],
      correct: 1
    }
  ],
  dutch: [
    {
      type: "multiple_choice",
      question: "Wat is de hoofdstad van Frankrijk?",
      options: ["Londen", "Parijs", "Berlijn"],
      correct: 1
    },
    {
      type: "true_false",
      question: "De aarde is plat.",
      options: ["Waar", "Niet waar"],
      correct: 1
    },
    {
      type: "fill_blank",
      question: "De ___ schijnt fel.",
      options: ["zon", "maan", "ster"],
      blank: "zon",
      correct: 0
    }
  ],
  indonesian: [
    {
      type: "multiple_choice",
      question: "Apa ibu kota Prancis?",
      options: ["London", "Paris", "Berlin"],
      correct: 1
    },
    {
      type: "true_false",
      question: "Bumi itu datar.",
      options: ["Benar", "Salah"],
      correct: 1
    },
    {
      type: "fill_blank",
      question: "___ bersinar terang.",
      options: ["matahari", "bulan", "bintang"],
      blank: "matahari",
      correct: 0
    }
  ],
  malay: [
    {
      type: "multiple_choice",
      question: "Apakah ibu kota Perancis?",
      options: ["London", "Paris", "Berlin"],
      correct: 1
    },
    {
      type: "true_false",
      question: "Bumi adalah rata.",
      options: ["Betul", "Salah"],
      correct: 1
    },
    {
      type: "fill_blank",
      question: "___ bersinar terang.",
      options: ["matahari", "bulan", "bintang"],
      blank: "matahari",
      correct: 0
    }
  ],
  thai: [
    {
      type: "multiple_choice",
      question: "เมืองหลวงของฝรั่งเศสคืออะไร?",
      options: ["ลอนดอน", "ปารีส", "เบอร์ลิน"],
      correct: 1
    },
    {
      type: "true_false",
      question: "โลกแบน.",
      options: ["จริง", "เท็จ"],
      correct: 1
    },
    {
      type: "fill_blank",
      question: "___ ส่องแสงสว่าง",
      options: ["ดวงอาทิตย์", "ดวงจันทร์", "ดาว"],
      blank: "ดวงอาทิตย์",
      correct: 0
    }
  ],
  khmer: [
    {
      type: "multiple_choice",
      question: "តើរាជធានីនៃប្រទេសបារាំងគឺជាអ្វី?",
      options: ["ឡុងដុន", "ប៉ារីស", "ប៊ែរលីន"],
      correct: 1
    },
    {
      type: "true_false",
      question: "ផែនដីរាបស្មើ។",
      options: ["ពិត", "មិនពិត"],
      correct: 1
    },
    {
      type: "fill_blank",
      question: "___ បញ្ចេញពន្លឺភ្លឺ",
      options: ["ព្រះអាទិត្យ", "ព្រះច័ន្ទ", "ផ្កាយ"],
      blank: "ព្រះអាទិត្យ",
      correct: 0
    }
  ]
};

const QuizScreen = ({ selectedLanguage = "english", onFinish }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
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

  const handleShortAnswer = useCallback(() => {
    if (showResult || !userAnswer.trim()) return;
    setShowResult(true);

    const correctAnswer = currentQuestionObj.answer.toLowerCase().trim();
    const userAns = userAnswer.toLowerCase().trim();
    const isCorrect = userAns === correctAnswer;

    setSelectedAnswer(userAnswer);
    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
    }

    // Speak user's answer
    const lang = /[\u0600-\u06FF]/.test(userAnswer) ? "arabic" : selectedLanguage;
    speakText(userAnswer, lang);
  }, [userAnswer, currentQuestionObj, selectedLanguage, showResult]);

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setUserAnswer("");
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

  const isQuestionArabic = /[\u0600-\u06FF]/.test(currentQuestionObj?.question || '');

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-white text-2xl font-bold">
        Question {currentQuestion + 1}/{questions.length}
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
            className={`w-full p-4 rounded-xl text-white bg-slate-700 border-2 focus:outline-none focus:border-blue-400 ${
              showResult
                ? userAnswer.toLowerCase().trim() === currentQuestionObj.answer.toLowerCase().trim()
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
                {userAnswer.toLowerCase().trim() === currentQuestionObj.answer.toLowerCase().trim() ? (
                  <Check className="text-green-400" />
                ) : (
                  <X className="text-red-400" />
                )}
                <button
                  onClick={() => {
                    const lang = /[\u0600-\u06FF]/.test(userAnswer) ? "arabic" : selectedLanguage;
                    speakText(userAnswer, lang);
                  }}
                  className="text-blue-400"
                >
                  <Volume2 size={16} />
                </button>
              </div>
              {userAnswer.toLowerCase().trim() !== currentQuestionObj.answer.toLowerCase().trim() && (
                <div className="space-y-2">
                  <p className="text-green-400 font-medium">
                    {isQuestionArabic ? "الْإِجَابَةُ الصَّحِيحَةُ:" : "Correct Answer:"} {currentQuestionObj.answer}
                  </p>
                  <button
                    onClick={() => {
                      const lang = /[\u0600-\u06FF]/.test(currentQuestionObj.answer) ? "arabic" : selectedLanguage;
                      speakText(currentQuestionObj.answer, lang);
                    }}
                    className="text-blue-400 flex items-center"
                  >
                    <Volume2 size={16} className="mr-1" />
                    {isQuestionArabic ? "اسْتَمِعْ لِلْإِجَابَةِ الصَّحِيحَةِ" : "Hear correct answer"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
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
      )}

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
