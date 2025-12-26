import React, { useState, useEffect } from 'react';
import { Volume2, Check, X, ArrowRight, ArrowLeft, BookOpen, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { STORIES } from '../data/stories';

interface StoryReadingProps {
    onComplete: (score: number) => void;
}

const StoryReading: React.FC<StoryReadingProps> = ({ onComplete }) => {
    const [activeStories, setActiveStories] = useState<typeof STORIES>([]);
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [totalScore, setTotalScore] = useState(0);
    const [currentStoryScore, setCurrentStoryScore] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        // Shuffle and pick 3 random stories
        const shuffled = [...STORIES].sort(() => Math.random() - 0.5);
        setActiveStories(shuffled.slice(0, 3));
    }, []);

    useEffect(() => {
        setIsVisible(true);
    }, [currentStoryIndex]);

    if (activeStories.length === 0) return null;

    const story = activeStories[currentStoryIndex];

    const speakText = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.85;
            window.speechSynthesis.speak(utterance);
        }
    };

    const playSound = (type: 'success' | 'error') => {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'success') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        } else {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, ctx.currentTime);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        }
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
    };

    const handleOptionSelect = (questionId: string, option: string) => {
        if (isSubmitted) return;
        setSelectedAnswers(prev => ({ ...prev, [questionId]: option }));
    };

    const checkAnswers = () => {
        if (Object.keys(selectedAnswers).length < story.questions.length) return;

        let correctCount = 0;
        story.questions.forEach(q => {
            if (selectedAnswers[q.id] === q.correctAnswer) {
                correctCount++;
            }
        });

        setCurrentStoryScore(correctCount);
        setTotalScore(prev => prev + correctCount);
        setIsSubmitted(true);

        if (correctCount === story.questions.length) {
            playSound('success');
            confetti({
                particleCount: 50,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#0ea5e9', '#38bdf8', '#7dd3fc']
            });
        } else {
            playSound('error');
        }
    };

    const nextStory = () => {
        if (currentStoryIndex < activeStories.length - 1) {
            setIsVisible(false);
            setTimeout(() => {
                setCurrentStoryIndex(prev => prev + 1);
                setSelectedAnswers({});
                setIsSubmitted(false);
                setCurrentStoryScore(0);
            }, 300);
        } else {
            // Finished all 3 stories
            setIsFinished(true);
            const finalGems = totalScore * 10;
            // Short delay to show final story result before completing
            setTimeout(() => {
                onComplete(finalGems);
            }, 1500);
        }
    };

    return (
        <div className={`w-full max-w-2xl mx-auto p-4 transition-all duration-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} dir="ltr">
            {/* Progress Header */}
            <div className="mb-6 bg-white p-4 rounded-3xl shadow-sm border border-sky-100">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">
                        Story {currentStoryIndex + 1} of 3
                    </span>
                    <span className="text-xs font-bold text-sky-600">
                        {Math.round(((currentStoryIndex + (isSubmitted ? 1 : 0)) / 3) * 100)}% Complete
                    </span>
                </div>
                <div className="w-full h-3 bg-sky-50 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-sky-500 transition-all duration-500"
                        style={{ width: `${((currentStoryIndex + (isSubmitted ? 1 : 0)) / 3) * 100}%` }}
                    />
                </div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-3xl shadow-sm border border-sky-100">
                <div className="flex-1" />
                <div className="flex flex-col items-center">
                    <h2 className="text-xl font-bold text-sky-900">{story.title}</h2>
                </div>
                <div className="flex-1 flex justify-end">
                    <span className="text-2xl">{story.emoji}</span>
                </div>
            </div>

            {/* Story Card */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden border-b-8 border-sky-100 mb-8">
                <div className="bg-sky-500 p-6 flex items-center justify-between">
                    <BookOpen className="text-white/80" size={24} />
                    <button
                        onClick={() => speakText(story.text.join(' '))}
                        className="p-3 bg-white/20 hover:bg-white/30 text-white rounded-2xl transition-all active:scale-95"
                    >
                        <Volume2 size={24} />
                    </button>
                </div>
                <div className="p-8">
                    <div className="space-y-4">
                        {story.text.map((sentence, idx) => (
                            <p key={idx} className="text-xl md:text-2xl text-slate-700 leading-relaxed font-medium">
                                {sentence}
                            </p>
                        ))}
                    </div>
                </div>
            </div>

            {/* Questions Section */}
            <div className="space-y-8 mb-10">
                {story.questions.map((q, qIdx) => (
                    <div key={q.id} className="bg-white p-6 rounded-3xl shadow-md border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex gap-3">
                            <span className="bg-sky-100 text-sky-600 w-7 h-7 flex items-center justify-center rounded-full text-sm">
                                {qIdx + 1}
                            </span>
                            {q.question}
                        </h3>

                        <div className="grid grid-cols-1 gap-3">
                            {q.options.map((option) => {
                                const isSelected = selectedAnswers[q.id] === option;
                                const isCorrect = option === q.correctAnswer;

                                let buttonClass = "w-full p-4 rounded-2xl text-left font-bold transition-all border-2 ";

                                if (!isSubmitted) {
                                    buttonClass += isSelected
                                        ? "bg-sky-500 border-sky-500 text-white shadow-md transform -translate-y-1"
                                        : "bg-white border-slate-100 text-slate-600 hover:border-sky-200 hover:bg-sky-50";
                                } else {
                                    if (isCorrect) {
                                        buttonClass += "bg-emerald-500 border-emerald-500 text-white shadow-emerald-100";
                                    } else if (isSelected && !isCorrect) {
                                        buttonClass += "bg-rose-500 border-rose-500 text-white shadow-rose-100";
                                    } else {
                                        buttonClass += "bg-slate-50 border-slate-100 text-slate-300";
                                    }
                                }

                                return (
                                    <button
                                        key={option}
                                        onClick={() => handleOptionSelect(q.id, option)}
                                        disabled={isSubmitted}
                                        className={buttonClass}
                                    >
                                        <div className="flex items-center justify-between">
                                            {option}
                                            {isSubmitted && isCorrect && <Check size={20} />}
                                            {isSubmitted && isSelected && !isCorrect && <X size={20} />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Controls */}
            <div className="flex flex-col gap-4">
                {!isSubmitted ? (
                    <button
                        onClick={checkAnswers}
                        disabled={Object.keys(selectedAnswers).length < story.questions.length}
                        className={`w-full py-4 rounded-2xl text-xl font-bold flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-lg ${Object.keys(selectedAnswers).length < story.questions.length
                            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                            : 'bg-sky-500 hover:bg-sky-600 text-white'
                            }`}
                    >
                        <CheckCircle2 size={24} />
                        Check Answers
                    </button>
                ) : (
                    <div className="flex gap-4">
                        <div className="flex-1 bg-white border-2 border-sky-100 rounded-2xl flex items-center justify-center p-4">
                            <p className="text-xl font-bold text-sky-700">
                                Story Score: {currentStoryScore} / {story.questions.length}
                            </p>
                        </div>
                        <button
                            onClick={nextStory}
                            className="flex-[2] py-4 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl text-xl font-bold flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-lg"
                        >
                            {currentStoryIndex < activeStories.length - 1 ? 'Next Story' : 'Finish Activity'}
                            <ArrowRight size={24} />
                        </button>
                    </div>
                )}
            </div>

            {isFinished && (
                <div className="fixed inset-0 bg-sky-500/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-white text-center">
                    <div className="space-y-6 animate-bounce">
                        <div className="text-6xl text-white">🏆</div>
                        <h2 className="text-4xl font-black">All Done!</h2>
                        <p className="text-2xl font-bold">Great job completing 3 stories!</p>
                        <div className="text-xl bg-white/20 p-4 rounded-2xl">
                            Total Coins: {totalScore * 10} 💎
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoryReading;
