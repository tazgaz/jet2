import React, { useState, useEffect } from 'react';
import { VOCABULARY_LIST } from '../constants';
import { VocabWord } from '../types';
import { RefreshCw, Check, X, ArrowLeft, Lightbulb } from 'lucide-react';

interface ScrambledLetter {
  id: string;
  char: string;
}

interface SpellingGameProps {
  onComplete: (score: number) => void;
}

const SpellingGame: React.FC<SpellingGameProps> = ({ onComplete }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [scrambledLetters, setScrambledLetters] = useState<ScrambledLetter[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<ScrambledLetter[]>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'correct' | 'wrong'>('playing');
  const [wordList, setWordList] = useState<VocabWord[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Shuffle vocabulary list for the game session
    const shuffled = [...VOCABULARY_LIST].sort(() => 0.5 - Math.random());
    setWordList(shuffled);
  }, []);

  useEffect(() => {
    if (wordList.length > 0) {
      loadWord(currentWordIndex);
    }
  }, [wordList, currentWordIndex]);

  const loadWord = (index: number) => {
    const word = wordList[index];
    // Filter out spaces and special chars for the scramble logic, but keep them in mind if needed
    // For simplicity, we just scramble the letters of the english word
    const chars = word.english.split('').map((char, i) => ({
      id: `${char}-${i}-${Math.random()}`,
      char: char
    }));

    // Shuffle letters
    const shuffled = [...chars].sort(() => 0.5 - Math.random());

    setScrambledLetters(shuffled);
    setSelectedLetters([]);
    setGameStatus('playing');
  };

  const handleLetterClick = (letter: ScrambledLetter) => {
    if (gameStatus !== 'playing') return;

    // Move from bank to selected
    const newScrambled = scrambledLetters.filter(l => l.id !== letter.id);
    const newSelected = [...selectedLetters, letter];

    setScrambledLetters(newScrambled);
    setSelectedLetters(newSelected);

    // Check if word is complete
    const currentWord = wordList[currentWordIndex];
    if (newSelected.length === currentWord.english.length) {
      const builtWord = newSelected.map(l => l.char).join('');
      if (builtWord.toLowerCase() === currentWord.english.toLowerCase()) {
        setGameStatus('correct');
        setStreak(prev => prev + 1);
        speak(currentWord.english);
      } else {
        setGameStatus('wrong');
        setStreak(0);
      }
    }
  };

  const handleSelectedLetterClick = (letter: ScrambledLetter) => {
    if (gameStatus === 'correct') return; // Can't undo if already won
    setGameStatus('playing'); // Reset wrong status if undoing

    // Move from selected back to bank
    const newSelected = selectedLetters.filter(l => l.id !== letter.id);
    const newScrambled = [...scrambledLetters, letter];

    setSelectedLetters(newSelected);
    setScrambledLetters(newScrambled);
  };

  const nextWord = () => {
    const nextIndex = currentWordIndex + 1;
    if (nextIndex >= 10 || nextIndex >= wordList.length) {
      // Award 8 gems per word in the streak
      onComplete(streak * 8);
      setCurrentWordIndex(0);
      setStreak(0);
    } else {
      setCurrentWordIndex(nextIndex);
    }
  };

  const resetCurrentWord = () => {
    loadWord(currentWordIndex);
  };

  const giveHint = () => {
    if (gameStatus !== 'playing' || scrambledLetters.length === 0) return;

    // Find the next correct letter needed
    const currentWord = wordList[currentWordIndex];
    const nextCharIndex = selectedLetters.length;
    const correctChar = currentWord.english[nextCharIndex];

    // Find that char in the scrambled pile
    const letterToMove = scrambledLetters.find(l => l.char.toLowerCase() === correctChar.toLowerCase());

    if (letterToMove) {
      handleLetterClick(letterToMove);
    }
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  if (wordList.length === 0) return null;

  const currentWord = wordList[currentWordIndex];

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-4">

      {/* Header / Stats */}
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display font-bold text-pink-600">סדר את האותיות</h2>
        <div className="bg-pink-100 px-4 py-1 rounded-full text-pink-700 font-bold">
          רצף הצלחות: {streak} 🔥
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl w-full p-6 sm:p-8 border-b-8 border-pink-200 relative overflow-hidden">

        {/* The Question Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="text-6xl mb-4 animate-bounce-in">{currentWord.emoji}</div>
          <h3 className="text-2xl font-bold text-slate-700 text-center mb-1" dir="rtl">{currentWord.hebrew}</h3>
          <span className="text-sm text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{currentWord.category}</span>
        </div>

        {/* Selected Letters Area (The Answer) */}
        <div className="flex flex-wrap justify-center gap-2 min-h-[60px] mb-8 p-4 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200" dir="ltr">
          {selectedLetters.map((letter) => (
            <button
              key={letter.id}
              onClick={() => handleSelectedLetterClick(letter)}
              className={`w-10 h-12 sm:w-12 sm:h-14 flex items-center justify-center text-2xl font-bold rounded-lg shadow-sm border-b-4 transition-all active:scale-95 ${gameStatus === 'correct'
                  ? 'bg-green-100 text-green-700 border-green-300'
                  : gameStatus === 'wrong'
                    ? 'bg-red-100 text-red-700 border-red-300'
                    : 'bg-white text-slate-800 border-slate-200'
                }`}
            >
              {letter.char}
            </button>
          ))}
          {/* Placeholders for remaining letters */}
          {Array.from({ length: Math.max(0, currentWord.english.length - selectedLetters.length) }).map((_, i) => (
            <div key={`placeholder-${i}`} className="w-10 h-12 sm:w-12 sm:h-14 bg-slate-100 rounded-lg border-2 border-slate-200 opacity-50" />
          ))}
        </div>

        {/* Status Message */}
        <div className="h-8 mb-4 flex justify-center items-center">
          {gameStatus === 'correct' && (
            <div className="flex items-center gap-2 text-green-600 font-bold animate-pulse">
              <Check size={24} />
              <span>מעולה! תשובה נכונה</span>
            </div>
          )}
          {gameStatus === 'wrong' && (
            <div className="flex items-center gap-2 text-red-500 font-bold">
              <X size={24} />
              <span>נסה שוב...</span>
            </div>
          )}
        </div>

        {/* Scrambled Letters Bank */}
        <div className="flex flex-wrap justify-center gap-2 mb-8" dir="ltr">
          {scrambledLetters.map((letter) => (
            <button
              key={letter.id}
              onClick={() => handleLetterClick(letter)}
              className="w-12 h-12 sm:w-14 sm:h-14 bg-pink-50 text-pink-700 font-bold text-xl rounded-xl shadow-md border-b-4 border-pink-200 hover:bg-pink-100 hover:-translate-y-1 active:translate-y-0 active:border-b-0 transition-all"
            >
              {letter.char}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mt-4 border-t pt-6 border-slate-100">
          <button
            onClick={resetCurrentWord}
            className="p-3 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
            title="אפס מילה"
          >
            <RefreshCw size={24} />
          </button>

          {gameStatus === 'correct' ? (
            <button
              onClick={nextWord}
              className="flex items-center gap-2 bg-pink-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-pink-600 hover:scale-105 transition-all"
            >
              למילה הבאה
              <ArrowLeft size={20} />
            </button>
          ) : (
            <button
              onClick={giveHint}
              disabled={scrambledLetters.length === 0}
              className="flex items-center gap-2 text-orange-500 bg-orange-50 px-4 py-2 rounded-full font-bold hover:bg-orange-100 transition-colors disabled:opacity-50"
            >
              <Lightbulb size={20} />
              רמז
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default SpellingGame;