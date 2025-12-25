import React, { useState, useEffect } from 'react';
import { VOCABULARY_LIST } from '../constants';
import { VocabWord } from '../types';
import { Check, X, ArrowRight, Image as ImageIcon, Volume2, Trophy, RefreshCw } from 'lucide-react';

interface ImageQuizProps {
  onComplete: (score: number) => void;
}

const ImageQuiz: React.FC<ImageQuizProps> = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [options, setOptions] = useState<VocabWord[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<VocabWord | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  // We'll select 10 random questions for a "round"
  const [quizQueue, setQuizQueue] = useState<VocabWord[]>([]);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const shuffledVocab = [...VOCABULARY_LIST].sort(() => 0.5 - Math.random());
    const queue = shuffledVocab.slice(0, 10); // Game of 10 questions
    setQuizQueue(queue);
    setCurrentQuestionIndex(0);
    setScore(0);
    setGameComplete(false);
    generateQuestion(queue[0]);
  };

  const generateQuestion = (target: VocabWord) => {
    if (!target) return;

    setCorrectAnswer(target);
    setSelectedOption(null);
    setIsAnswered(false);

    // Pick 3 distractors
    const distractors = VOCABULARY_LIST
      .filter(w => w.english !== target.english)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    // Combine and shuffle options
    const allOptions = [target, ...distractors].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
  };

  const handleOptionClick = (word: VocabWord) => {
    if (isAnswered) return;

    setSelectedOption(word.english);
    setIsAnswered(true);

    if (word.english === correctAnswer?.english) {
      setScore(prev => prev + 1);
      speak("Correct! " + word.english);
    } else {
      speak("Try again");
    }
  };

  const nextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < quizQueue.length) {
      setCurrentQuestionIndex(nextIndex);
      generateQuestion(quizQueue[nextIndex]);
    } else {
      setGameComplete(true);
      // Award 5 gems per correct answer
      onComplete(score * 5);
    }
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  if (!correctAnswer && !gameComplete) return null;

  if (gameComplete) {
    return (
      <div className="flex flex-col items-center justify-center max-w-lg mx-auto p-8 bg-white rounded-3xl shadow-lg text-center mt-10">
        <div className="bg-yellow-100 p-4 rounded-full mb-6 animate-bounce">
          <Trophy size={64} className="text-yellow-500" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">כל הכבוד!</h2>
        <p className="text-xl text-slate-600 mb-8">
          הציון שלך: <span className="font-bold text-indigo-600">{score}</span> מתוך <span className="font-bold text-indigo-600">{quizQueue.length}</span>
        </p>
        <button
          onClick={startNewGame}
          className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold text-xl shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
        >
          <RefreshCw size={24} />
          משחק חדש
        </button>
      </div>
    );
  }

  const progress = ((currentQuestionIndex) / quizQueue.length) * 100;

  return (
    <div className="max-w-xl mx-auto w-full p-2 sm:p-4">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs sm:text-sm text-gray-500 font-bold mb-1">
          <span>שאלה {currentQuestionIndex + 1} מתוך {quizQueue.length}</span>
          <span>ניקוד: {score}</span>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-4 border-b-8 border-indigo-200">

        {/* Header Title */}
        <div className="flex items-center justify-center gap-2 mb-2 text-indigo-600">
          <ImageIcon size={20} />
          <h2 className="text-lg font-bold">מה בתמונה?</h2>
        </div>

        {/* The Image (Emoji) + Hebrew Word */}
        <div className="flex flex-col items-center mb-4 bg-slate-50 rounded-xl p-4 border-2 border-dashed border-slate-200 min-h-[160px] justify-center">
          <div className="text-7xl sm:text-8xl leading-none filter drop-shadow-xl animate-bounce-in transform hover:scale-110 transition-transform duration-300 cursor-default select-none">
            {correctAnswer?.emoji}
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-700 mt-3" dir="rtl">
            {correctAnswer?.hebrew}
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {options.map((option, idx) => {
            let btnClass = "h-16 sm:h-20 rounded-xl text-lg sm:text-xl font-bold transition-all duration-200 flex flex-col items-center justify-center border-b-4 ";

            if (isAnswered) {
              if (option.english === correctAnswer?.english) {
                btnClass += "bg-green-100 text-green-700 border-green-300";
              } else if (option.english === selectedOption) {
                btnClass += "bg-red-100 text-red-700 border-red-300 opacity-60";
              } else {
                btnClass += "bg-slate-50 text-slate-400 border-slate-200 opacity-50";
              }
            } else {
              btnClass += "bg-white text-slate-700 border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 hover:shadow-md active:scale-95 active:border-b-0 active:translate-y-1";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(option)}
                className={btnClass}
                disabled={isAnswered}
              >
                <span>{option.english}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback / Next Button Area - Fixed height to prevent jumpiness */}
        <div className="h-14 flex items-center justify-center">
          {isAnswered ? (
            <button
              onClick={nextQuestion}
              className={`w-full flex items-center justify-center gap-3 px-6 py-3 rounded-2xl font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 ${selectedOption === correctAnswer?.english ? 'bg-green-500 hover:bg-green-600' : 'bg-slate-800 hover:bg-slate-900'
                }`}
            >
              <span>{selectedOption === correctAnswer?.english ? 'מצוין! המשך' : 'המשך לשאלה הבאה'}</span>
              <ArrowRight size={20} />
            </button>
          ) : (
            <p className="text-slate-400 text-sm font-medium animate-pulse">בחר את המילה באנגלית המתאימה לתמונה ולמילה</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default ImageQuiz;