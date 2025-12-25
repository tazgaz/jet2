import React, { useState, useEffect } from 'react';
import { getOddOneOutPuzzles } from '../services/questionService';
import { OddOneOutQuestion } from '../types';
import { Loader2, HelpCircle, AlertCircle, ArrowRight } from 'lucide-react';

interface OddOneOutProps {
    onComplete: (score: number) => void;
}

const OddOneOut: React.FC<OddOneOutProps> = ({ onComplete }) => {
    const [puzzles, setPuzzles] = useState<OddOneOutQuestion[]>([]);
    const [score, setScore] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedWord, setSelectedWord] = useState<string | null>(null);
    const [showReason, setShowReason] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPuzzles();
    }, []);

    const loadPuzzles = async () => {
        setLoading(true);
        const data = await getOddOneOutPuzzles();
        setPuzzles(data);
        setLoading(false);
    };

    const handleWordSelect = (word: string) => {
        if (showReason) return;
        setSelectedWord(word);
        setShowReason(true);
        if (word === puzzles[currentIndex].oddWord) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < puzzles.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedWord(null);
            setShowReason(false);
        } else {
            // Award 15 gems per correct answer
            onComplete(score * 15);
            // Reset
            setLoading(true);
            setPuzzles([]);
            setCurrentIndex(0);
            setSelectedWord(null);
            setShowReason(false);
            setScore(0);
            loadPuzzles();
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-orange-500">
                <Loader2 className="animate-spin mb-4" size={48} />
                <p className="text-xl font-bold">טוען משחק...</p>
            </div>
        );
    }

    if (puzzles.length === 0) {
        return (
            <div className="flex flex-col items-center text-center p-8">
                <AlertCircle className="text-red-400 mb-2" size={40} />
                <p>לא הצלחנו לטעון את המשחק כרגע.</p>
                <button onClick={loadPuzzles} className="mt-4 text-sky-600 font-bold underline">נסה שוב</button>
            </div>
        )
    }

    const currentPuzzle = puzzles[currentIndex];
    const isCorrect = selectedWord === currentPuzzle.oddWord;

    return (
        <div className="max-w-xl mx-auto w-full p-4">
            <div className="bg-white rounded-3xl shadow-xl border-b-8 border-orange-100 overflow-hidden">
                <div className="bg-orange-400 p-6 text-white text-center">
                    <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                        <HelpCircle />
                        מי יוצא דופן?
                    </h2>
                    <p className="opacity-90 mt-2">בחר את המילה שלא שייכת לקבוצה</p>
                </div>

                <div className="p-6 grid grid-cols-2 gap-4">
                    {currentPuzzle.words.map((word, idx) => {
                        let btnStyle = "h-24 rounded-xl text-xl font-bold border-2 transition-all flex items-center justify-center shadow-sm ";

                        if (showReason) {
                            if (word === currentPuzzle.oddWord) {
                                btnStyle += "bg-green-100 border-green-500 text-green-800 scale-105";
                            } else if (word === selectedWord) {
                                btnStyle += "bg-red-100 border-red-500 text-red-800 opacity-60";
                            } else {
                                btnStyle += "bg-gray-50 border-gray-100 text-gray-400 opacity-40";
                            }
                        } else {
                            btnStyle += "bg-white border-slate-200 text-slate-700 hover:border-orange-300 hover:shadow-md active:scale-95";
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleWordSelect(word)}
                                className={btnStyle}
                                disabled={showReason}
                            >
                                {word}
                            </button>
                        );
                    })}
                </div>

                {showReason && (
                    <div className="px-6 pb-6 animate-fade-in">
                        <div className={`p-4 rounded-xl mb-4 ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-orange-50 text-orange-800'}`}>
                            <p className="font-bold text-lg mb-1">{isCorrect ? 'נכון מאוד!' : 'לא בדיוק...'}</p>
                            <p>{currentPuzzle.reason}</p>
                        </div>
                        <button
                            onClick={handleNext}
                            className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-900"
                        >
                            {currentIndex < puzzles.length - 1 ? 'לחידה הבאה' : 'משחק חדש'}
                            <ArrowRight size={20} />
                        </button>
                    </div>
                )}
            </div>

            <p className="text-center text-gray-400 mt-4 text-sm font-medium">
                חידה {currentIndex + 1} מתוך {puzzles.length}
            </p>
        </div>
    );
};

export default OddOneOut;