import React, { useState } from 'react';
import { AppView } from './types';
import Flashcards from './components/Flashcards';
import Quiz from './components/Quiz';
import MemoryGame from './components/MemoryGame';
import OddOneOut from './components/OddOneOut';
import SpellingGame from './components/SpellingGame';
import ImageQuiz from './components/ImageQuiz';
import CountdownTimer from './components/CountdownTimer';
import SentenceBuilder from './components/SentenceBuilder';
import StoryReading from './components/StoryReading';
import GameMap from './components/GameMap';
import DiamondShop from './components/DiamondShop';
import { useGameState } from './hooks/useGameState';
import SuccessModal from './components/SuccessModal';
import { BookOpen, BrainCircuit, GraduationCap, LayoutGrid, Home, Pencil, Image as ImageIcon, Type, BookCheck, Diamond, ShoppingBag, Clock } from 'lucide-react';

const App: React.FC = () => {
  const { profile, updateLevelScore, purchaseItem, selectItem, LEVEL_ORDER } = useGameState();
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastScore, setLastScore] = useState(0);
  const [lastAddedMinutes, setLastAddedMinutes] = useState(0);

  const handleGameComplete = (score: number) => {
    const wasReceivedFirstTime = profile.receivedFirstLevelTime;
    updateLevelScore(currentView, score);
    setLastScore(score);

    // Check if minutes were added (first level reward)
    if (currentView === LEVEL_ORDER[0] && score >= 5 && !wasReceivedFirstTime) {
      setLastAddedMinutes(10);
    } else {
      setLastAddedMinutes(0);
    }

    setShowSuccessModal(true);
  };

  const handleRestart = () => {
    setShowSuccessModal(false);
    // Setting same view will trigger re-mount if we key it
  };

  const handleContinue = () => {
    setShowSuccessModal(false);
    const currentIndex = LEVEL_ORDER.indexOf(currentView);
    const nextLevel = LEVEL_ORDER[currentIndex + 1];

    // If next level is unlocked, go to it, otherwise go home
    if (nextLevel && profile.unlockedLevels.includes(nextLevel)) {
      setCurrentView(nextLevel);
    } else {
      setCurrentView(AppView.HOME);
    }
  };

  const renderView = () => {
    // Add a unique key to game components to force re-render on restart
    const gameKey = `${currentView}-${showSuccessModal ? 'modal' : 'active'}`;

    switch (currentView) {
      case AppView.FLASHCARDS:
        return <Flashcards key={gameKey} onComplete={handleGameComplete} />;
      case AppView.MEMORY:
        return <MemoryGame key={gameKey} onComplete={handleGameComplete} />;
      case AppView.QUIZ:
        return <Quiz key={gameKey} onComplete={handleGameComplete} />;
      case AppView.ODD_ONE_OUT:
        return <OddOneOut key={gameKey} onComplete={handleGameComplete} />;
      case AppView.SPELLING:
        return <SpellingGame key={gameKey} onComplete={handleGameComplete} />;
      case AppView.IMAGE_QUIZ:
        return <ImageQuiz key={gameKey} onComplete={handleGameComplete} />;
      case AppView.SENTENCE_BUILDER:
        return <SentenceBuilder key={gameKey} onComplete={handleGameComplete} />;
      case AppView.STORY_READING:
        return <StoryReading key={gameKey} onComplete={handleGameComplete} />;
      case AppView.SHOP:
        return (
          <DiamondShop
            profile={profile}
            onPurchase={purchaseItem}
            onSelect={selectItem}
            onClose={() => setCurrentView(AppView.HOME)}
          />
        );
      case AppView.HOME:
      default:
        return (
          <div className="flex flex-col gap-6">
            <GameMap
              profile={profile}
              levelOrder={LEVEL_ORDER}
              onSelectLevel={setCurrentView}
            />

            <CountdownTimer />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-10">
      {showSuccessModal && (
        <SuccessModal
          score={lastScore}
          earnedMinutes={lastAddedMinutes}
          onRestart={handleRestart}
          onContinue={handleContinue}
          hasNextLevel={LEVEL_ORDER.indexOf(currentView) < LEVEL_ORDER.length - 1 && profile.unlockedLevels.includes(LEVEL_ORDER[LEVEL_ORDER.indexOf(currentView) + 1])}
        />
      )}

      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between" dir="ltr">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setCurrentView(AppView.HOME)}
          >
            <div className="bg-sky-500 text-white p-2 rounded-lg shadow-sm">
              <GraduationCap size={20} />
            </div>
            <div className="leading-tight">
              <h1 className="text-lg font-bold text-sky-900">Tzamrot Prep</h1>
              <span className="text-[10px] text-sky-600 font-bold block">Class D5 English</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {profile.earnedMinutes > 0 && (
              <div className="flex items-center gap-1.5 bg-sky-50 px-3 py-1.5 rounded-full border border-sky-100 text-sky-700 mx-2 animate-pulse">
                <Clock size={16} />
                <span className="text-sm font-black whitespace-nowrap">{profile.earnedMinutes} ד' בונוס</span>
              </div>
            )}

            {currentView !== AppView.HOME ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView(AppView.SHOP)}
                  className="p-2 text-slate-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors flex items-center gap-2"
                  title="Diamond Shop"
                >
                  <ShoppingBag size={24} />
                </button>
                <button
                  onClick={() => setCurrentView(AppView.HOME)}
                  className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-full transition-colors flex items-center gap-2"
                >
                  <Home size={24} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentView(AppView.SHOP)}
                  className="p-2 text-slate-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors relative group"
                >
                  <ShoppingBag size={24} />
                  <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full ring-2 ring-white animate-pulse" />
                </button>

                <div className="flex items-center gap-3 bg-slate-50 px-4 py-1.5 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Diamond className="text-yellow-500 fill-yellow-500" size={18} />
                    <span className="font-black text-slate-700">{profile.coins}</span>
                  </div>
                  <div className="w-px h-4 bg-slate-200" />
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Lv.</span>
                    <span className="font-black text-sky-600">{profile.unlockedLevels.length}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto mt-4 px-3 max-w-lg">
        {renderView()}
      </main>
    </div>
  );
};

export default App;