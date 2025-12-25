import React, { useState, useEffect } from 'react';
import { VOCABULARY_LIST } from '../constants';
import { ArrowLeft, ArrowRight, RotateCw, Volume2, Eye } from 'lucide-react';

interface FlashcardsProps {
  onComplete: (score: number) => void;
}

const Flashcards: React.FC<FlashcardsProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewedCount, setViewedCount] = useState(new Set([0]));
  const [isFlipped, setIsFlipped] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  const currentWord = VOCABULARY_LIST[currentIndex];

  useEffect(() => {
    // Reset translation visibility when card changes
    setShowTranslation(false);
    setViewedCount(prev => new Set(prev).add(currentIndex));
  }, [currentIndex]);

  const handleNext = () => {
    setIsFlipped(false);
    setShowTranslation(false);
    setCurrentIndex((prev) => (prev + 1) % VOCABULARY_LIST.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setShowTranslation(false);
    setCurrentIndex((prev) => (prev === 0 ? VOCABULARY_LIST.length - 1 : prev - 1));
  };

  const handleFinish = () => {
    // Award gems based on unique cards viewed (e.g. 1 gem per card)
    onComplete(viewedCount.size);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const speakWord = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card flip when clicking audio
    const utterance = new SpeechSynthesisUtterance(currentWord.english);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const toggleTranslationReveal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTranslation(!showTranslation);
  };

  // Always English on Front, Hebrew on Back
  const frontContent = {
    text: currentWord.english,
    label: 'אנגלית',
    lang: 'en',
    isEnglish: true,
    translation: currentWord.hebrew,
    emoji: currentWord.emoji
  };

  const backContent = {
    text: currentWord.hebrew,
    label: 'עברית',
    lang: 'he',
    isEnglish: false,
    emoji: currentWord.emoji
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between w-full mb-6">
        <h2 className="text-3xl font-display font-bold text-sky-600">כרטיסיות מילים</h2>
        <button
          onClick={handleFinish}
          className="bg-emerald-500 text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-emerald-600 active:scale-95 transition-all text-sm"
        >
          סיימתי! +{viewedCount.size} 💎
        </button>
      </div>

      <div className="w-full h-96 perspective-1000 cursor-pointer group" onClick={handleFlip}>
        <div className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>

          {/* Front Face (English) */}
          <div className="absolute w-full h-full bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center backface-hidden border-b-8 border-sky-400 p-4">
            <span className="text-sm text-gray-400 absolute top-4 right-4">{frontContent.label}</span>

            {/* Main Word */}
            <h3 className="text-4xl sm:text-5xl font-bold text-slate-800 text-center mb-4" dir="ltr">
              {frontContent.text}
            </h3>

            {/* Audio Button */}
            <button
              onClick={speakWord}
              className="mb-4 p-3 bg-sky-100 text-sky-600 rounded-full hover:bg-sky-200 transition-colors hover:scale-110 active:scale-95"
              title="שמע הגייה"
            >
              <Volume2 size={24} />
            </button>

            {/* Category Tag */}
            <span className="mb-6 px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-sm font-medium">
              {currentWord.category}
            </span>

            {/* Show Translation Button Area */}
            <div className="w-full flex flex-col items-center justify-center min-h-[100px]">
              {!showTranslation ? (
                <button
                  onClick={toggleTranslationReveal}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200 font-bold transition-all text-sm sm:text-base"
                >
                  <Eye size={20} />
                  הצג תרגום
                </button>
              ) : (
                <div className="flex flex-col items-center animate-fade-in bg-yellow-50 p-4 rounded-xl w-full">
                  <div className="text-4xl mb-2">{frontContent.emoji}</div>
                  <div className="text-xl font-bold text-slate-700" dir="rtl">
                    {frontContent.translation}
                  </div>
                </div>
              )}
            </div>

            <p className="absolute bottom-4 text-gray-400 text-sm opacity-50">לחץ להפוך כרטיס</p>
          </div>

          {/* Back Face (Hebrew) */}
          <div className="absolute w-full h-full bg-sky-50 rounded-2xl shadow-xl flex flex-col items-center justify-center backface-hidden rotate-y-180 border-b-8 border-yellow-400 p-4">
            <span className="text-sm text-gray-400 absolute top-4 right-4">{backContent.label}</span>

            <div className="text-6xl mb-6">{backContent.emoji}</div>

            <h3 className="text-4xl sm:text-5xl font-bold text-slate-800 text-center px-4" dir="rtl">
              {backContent.text}
            </h3>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between w-full mt-8 px-4">
        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 text-slate-600 rounded-full hover:bg-slate-50 font-bold transition-all hover:scale-105 active:scale-95"
        >
          <ArrowRight size={24} />
          הבא
        </button>

        <span className="text-lg font-medium text-slate-500">
          {currentIndex + 1} / {VOCABULARY_LIST.length}
        </span>

        <button
          onClick={handlePrev}
          className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 text-slate-600 rounded-full hover:bg-slate-50 font-bold transition-all hover:scale-105 active:scale-95"
        >
          הקודם
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* Quick Navigation helper - Shuffle */}
      <button
        onClick={() => {
          const random = Math.floor(Math.random() * VOCABULARY_LIST.length);
          setIsFlipped(false);
          setShowTranslation(false);
          setCurrentIndex(random);
        }}
        className="mt-6 flex items-center gap-2 text-sky-600 hover:text-sky-800 font-medium"
      >
        <RotateCw size={20} />
        מילה אקראית
      </button>
    </div>
  );
};

export default Flashcards;