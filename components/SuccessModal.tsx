import React from 'react';
import { Trophy, ArrowLeft, RefreshCw, Diamond, Clock } from 'lucide-react';

interface SuccessModalProps {
    score: number;
    earnedMinutes?: number;
    onRestart: () => void;
    onContinue: () => void;
    hasNextLevel: boolean;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
    score,
    earnedMinutes = 0,
    onRestart,
    onContinue,
    hasNextLevel
}) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden transform animate-bounce-in">
                <div className="bg-gradient-to-b from-yellow-400 to-orange-500 p-8 flex flex-col items-center text-white">
                    <div className="bg-white/20 p-4 rounded-full mb-4">
                        <Trophy size={64} className="text-white drop-shadow-lg" />
                    </div>
                    <h2 className="text-3xl font-black mb-1">כל הכבוד!</h2>
                    <p className="opacity-90 font-bold">סיימת את הפעילות בהצלחה</p>
                </div>

                <div className="p-8">
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center">
                            <div className="flex items-center gap-1.5 mb-1">
                                <Diamond size={20} className="text-yellow-500 fill-yellow-500" />
                                <span className="text-sm font-bold text-slate-500">יהלומים</span>
                            </div>
                            <span className="text-2xl font-black text-slate-800">+{score}</span>
                        </div>


                    </div>

                    <div className="flex flex-col gap-3">
                        {hasNextLevel && (
                            <button
                                onClick={onContinue}
                                className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-emerald-200 hover:bg-emerald-600 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                המשך לפעילות הבאה
                                <ArrowLeft size={24} />
                            </button>
                        )}

                        <button
                            onClick={onRestart}
                            className="w-full bg-white border-2 border-slate-100 text-slate-600 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={20} />
                            התחל מחדש
                        </button>

                        <button
                            onClick={onContinue}
                            className={`w-full py-4 font-bold text-slate-400 hover:text-slate-600 transition-colors ${hasNextLevel ? 'hidden' : 'block'}`}
                        >
                            חזרה למפה
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;
