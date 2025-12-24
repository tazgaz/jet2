import React, { useState } from 'react';
import { AppView } from './types';
import Flashcards from './components/Flashcards';
import Quiz from './components/Quiz';
import MemoryGame from './components/MemoryGame';
import OddOneOut from './components/OddOneOut';
import SpellingGame from './components/SpellingGame';
import ImageQuiz from './components/ImageQuiz';
import CountdownTimer from './components/CountdownTimer';
import { BookOpen, BrainCircuit, GraduationCap, LayoutGrid, Home, Pencil, Image as ImageIcon } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);

  const renderView = () => {
    switch (currentView) {
      case AppView.FLASHCARDS:
        return <Flashcards />;
      case AppView.MEMORY:
        return <MemoryGame />;
      case AppView.QUIZ:
        return <Quiz />;
      case AppView.ODD_ONE_OUT:
        return <OddOneOut />;
      case AppView.SPELLING:
        return <SpellingGame />;
      case AppView.IMAGE_QUIZ:
        return <ImageQuiz />;
      case AppView.HOME:
      default:
        return <HomeMenu setView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-10">
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

            {currentView !== AppView.HOME && (
                 <button 
                 onClick={() => setCurrentView(AppView.HOME)}
                 className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-full transition-colors"
               >
                 <Home size={24} />
               </button>
            )}
        </div>
      </header>

      <main className="container mx-auto mt-4 px-3 max-w-lg">
        {renderView()}
      </main>
    </div>
  );
};

const HomeMenu: React.FC<{ setView: (view: AppView) => void }> = ({ setView }) => {
    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
                <MenuButton 
                    title="כרטיסיות" 
                    icon={<BookOpen size={28} />} 
                    color="bg-sky-500" 
                    borderColor="border-sky-100"
                    onClick={() => setView(AppView.FLASHCARDS)} 
                />
                
                <MenuButton 
                    title="זיהוי תמונות" 
                    icon={<ImageIcon size={28} />} 
                    color="bg-indigo-500" 
                    borderColor="border-indigo-100"
                    onClick={() => setView(AppView.IMAGE_QUIZ)} 
                />

                <MenuButton 
                    title="משחק הזיכרון" 
                    icon={<LayoutGrid size={28} />} 
                    color="bg-purple-500" 
                    borderColor="border-purple-100"
                    onClick={() => setView(AppView.MEMORY)} 
                />

                <MenuButton 
                    title="סדר את האותיות" 
                    icon={<Pencil size={28} />} 
                    color="bg-pink-500" 
                    borderColor="border-pink-100"
                    onClick={() => setView(AppView.SPELLING)} 
                />

                <MenuButton 
                    title="יוצא דופן" 
                    icon={<BrainCircuit size={28} />} 
                    color="bg-orange-400" 
                    borderColor="border-orange-100"
                    onClick={() => setView(AppView.ODD_ONE_OUT)} 
                />

                <MenuButton 
                    title="מבחן אמריקאי" 
                    icon={<GraduationCap size={28} />} 
                    color="bg-green-500" 
                    borderColor="border-green-100"
                    onClick={() => setView(AppView.QUIZ)} 
                />
            </div>
            
            {/* Main Timer below buttons */}
            <CountdownTimer />
        </div>
    )
}

const MenuButton: React.FC<{
    title: string;
    icon: React.ReactNode;
    color: string;
    borderColor: string;
    onClick: () => void;
}> = ({ title, icon, color, borderColor, onClick }) => {
    return (
        <button 
            onClick={onClick}
            className={`w-full bg-white p-4 rounded-2xl shadow-sm border-2 ${borderColor} flex flex-col items-center justify-center gap-3 hover:shadow-md hover:border-current hover:scale-[1.02] transition-all active:scale-95 group h-32`}
        >
            <div className={`${color} text-white p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <h3 className="text-lg font-bold text-slate-700 group-hover:text-sky-600 transition-colors leading-none">{title}</h3>
        </button>
    )
}

export default App;