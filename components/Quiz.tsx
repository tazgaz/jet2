import React, { useState, useEffect } from 'react';
import { getQuizQuestions } from '../services/questionService';
import { QuizQuestion } from '../types';
import { CheckCircle, XCircle, Loader2, Sparkles, AlertCircle, RefreshCw, Frown } from 'lucide-react';
import { triggerSuccessConfetti, playSound } from '../utils/gameEffects';

const Quiz: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Animation state for wrong answer
  const [showSadFace, setShowSadFace] = useState(false);

  useEffect(() => {
    loadQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadQuiz = async () => {
    setLoading(true);
    setError(false);
    try {
      const q = await getQuizQuestions();
      if (q && q.length > 0) {
        setQuestions(q);
      } else {
        setError(true);
      }
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = (option: string) => {
    if (isAnswered || showSadFace) return;
    
    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === questions[currentQuestionIndex].correctAnswer;

    if (isCorrect) {
      setScore(prev => prev + 1);
      triggerSuccessConfetti();
      playSound('success');
      
      // Auto advance after success animation
      setTimeout(() => {
        nextQuestion();
      }, 1500);

    } else {
      playSound('error');
      setShowSadFace(true);
      
      // Auto advance after sad face animation
      setTimeout(() => {
        setShowSadFace(false);
        nextQuestion();
      }, 1500);
    }
  };

  const nextQuestion = () => {
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowSadFace(false);
  };

  const restartQuiz = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowSadFace(false);
    loadQuiz();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-sky-600">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="text-xl font-bold">טוען מבחן...</p>
      </div>
    );
  }

  if (error || questions.length === 0) {
     return (
        <div className="flex flex-col items-center justify-center h-64 text-red-500 text-center">
            <AlertCircle size={48} className="mb-4"/>
            <p className="text-lg font-bold mb-4">אופס, היתה בעיה בטעינת השאלות</p>
            <button onClick={restartQuiz} className="bg-sky-500 text-white px-6 py-2 rounded-full font-bold">נסה שוב</button>
        </div>
     )
  }

  if (currentQuestionIndex >= questions.length) {
    return (
      <div className="flex flex-col items-center justify-center max-w-lg mx-auto p-8 bg-white rounded-3xl shadow-lg text-center">
        <div className="bg-yellow-100 p-4 rounded-full mb-6">
            <Sparkles size={48} className="text-yellow-500" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">המבחן הסתיים!</h2>
        <p className="text-xl text-slate-600 mb-8">
          הציון שלך: <span className="font-bold text-sky-600">{score}</span> מתוך <span className="font-bold text-sky-600">{questions.length}</span>
        </p>
        <button 
          onClick={restartQuiz}
          className="w-full py-4 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold text-xl shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
        >
          <RefreshCw size={24} />
          מבחן חדש
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto w-full p-4 relative">
      
      {/* Sad Face Overlay */}
      {showSadFace && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-full shadow-2xl animate-shake flex flex-col items-center border-4 border-red-200">
            <div className="text-8xl mb-2">😭</div>
            <p className="text-red-500 font-bold text-xl">אוי לא!</p>
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 font-bold mb-2">
          <span>שאלה {currentQuestionIndex + 1} מתוך {questions.length}</span>
          <span>ניקוד: {score}</span>
        </div>
        <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-sky-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border-b-8 border-slate-100">
        <h3 className="text-2xl font-bold text-slate-800 mb-8 leading-relaxed text-right" dir="auto">
          {currentQuestion.question}
        </h3>

        <div className="space-y-4">
          {currentQuestion.options.map((option, idx) => {
            let btnClass = "w-full p-4 rounded-xl text-lg font-medium text-right border-2 transition-all duration-200 flex justify-between items-center ";
            
            if (isAnswered) {
              if (option === currentQuestion.correctAnswer) {
                btnClass += "bg-green-100 border-green-500 text-green-800 scale-[1.02] shadow-sm";
              } else if (option === selectedOption) {
                btnClass += "bg-red-100 border-red-500 text-red-800 opacity-60";
              } else {
                btnClass += "bg-gray-50 border-gray-100 text-gray-400 opacity-40";
              }
            } else {
              // Interactive state when not answered
              btnClass += "bg-white border-slate-200 text-slate-700 hover:border-sky-300 hover:bg-sky-50 active:scale-95";
            }

            return (
              <button 
                key={idx}
                onClick={() => handleOptionClick(option)}
                className={btnClass}
                disabled={isAnswered}
              >
                <span>{option}</span>
                {isAnswered && option === currentQuestion.correctAnswer && <CheckCircle className="text-green-600" />}
                {isAnswered && selectedOption === option && option !== currentQuestion.correctAnswer && <XCircle className="text-red-500" />}
              </button>
            );
          })}
        </div>

        <div className="mt-8 h-12 flex justify-center items-center">
            {/* Auto-advance logic implies we don't need a next button, but we show a placeholder text if needed */}
            {!isAnswered ? (
                <p className="text-slate-400 text-sm font-medium self-center">בחר את התשובה הנכונה</p>
            ) : (
                <div className="flex items-center gap-2 text-sky-600 animate-pulse">
                    <Loader2 className="animate-spin" size={20} />
                    <span className="font-bold">עובר לשאלה הבאה...</span>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;