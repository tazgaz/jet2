import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, CheckCircle, ArrowRight, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SentenceItem {
    subject: string;
    emoji: string;
    english: string;
}

interface Word {
    id: string;
    text: string;
}

const SENTENCE_POOL: SentenceItem[] = [
    { subject: "Lee", emoji: "🏃‍♀️", english: "Lee can run fast" },
    { subject: "The cat", emoji: "🐱", english: "The cat is on the mat" },
    { subject: "I", emoji: "🍎", english: "I like to eat apples" },
    { subject: "He", emoji: "🐶", english: "He has a small dog" },
    { subject: "She", emoji: "🌸", english: "She picks a pretty flower" },
    { subject: "We", emoji: "🏫", english: "We go to school together" },
    { subject: "The bird", emoji: "🐦", english: "The bird sings a song" },
    { subject: "My dad", emoji: "🚗", english: "My dad drives a blue car" },
    { subject: "They", emoji: "⚽", english: "They play with a big ball" },
    { subject: "The sun", emoji: "☀️", english: "The sun is very hot" },
    { subject: "You", emoji: "👫", english: "You are a good friend" },
    { subject: "The fish", emoji: "🐟", english: "The fish swims in the water" },
    { subject: "The monkey", emoji: "🐒", english: "The monkey likes yellow bananas" },
    { subject: "The elephant", emoji: "🐘", english: "The elephant is very big" },
    { subject: "I", emoji: "🥛", english: "I drink milk every day" },
    { subject: "It", emoji: "🏠", english: "It is a nice house" },
    { subject: "The tree", emoji: "🌳", english: "The tree has green leaves" },
    { subject: "Maria", emoji: "🎨", english: "Maria paints a red heart" },
    { subject: "The frog", emoji: "🐸", english: "The frog can jump high" },
    { subject: "The bee", emoji: "🐝", english: "The bee makes sweet honey" },
    { subject: "Sam", emoji: "🍕", english: "Sam wants to eat pizza" },
    { subject: "The owl", emoji: "🦉", english: "The owl is in the tree" },
    { subject: "The rabbit", emoji: "🐰", english: "The rabbit eats a carrot" },
    { subject: "I", emoji: "📖", english: "I read a fun book" },
    { subject: "The pig", emoji: "🐷", english: "The pig is in the mud" },
    { subject: "The lion", emoji: "🦁", english: "The lion is the king" },
    { subject: "The spider", emoji: "🕷️", english: "The spider has eight legs" },
    { subject: "The snake", emoji: "🐍", english: "The snake is very long" },
    { subject: "The turtle", emoji: "🐢", english: "The turtle is very slow" },
    { subject: "The stars", emoji: "⭐", english: "The stars shine at night" }
];

const SentenceBuilder: React.FC = () => {
    const [gameSession, setGameSession] = useState<SentenceItem[]>([]);
    const [currentRound, setCurrentRound] = useState(0);
    const [bankWords, setBankWords] = useState<Word[]>([]);
    const [constructionArea, setConstructionArea] = useState<Word[]>([]);
    const [gameState, setGameState] = useState<'playing' | 'round-end' | 'game-over'>('playing');
    const [score, setScore] = useState(0);
    const [isShaking, setIsShaking] = useState(false);
    const [feedback, setFeedback] = useState<'none' | 'success' | 'wrong'>('none');

    const shuffleArray = <T,>(array: T[]): T[] => {
        return [...array].sort(() => Math.random() - 0.5);
    };

    const initGame = useCallback(() => {
        const selected = shuffleArray(SENTENCE_POOL).slice(0, 5);
        setGameSession(selected);
        setCurrentRound(0);
        setScore(0);
        loadRound(selected[0]);
        setGameState('playing');
    }, []);

    const loadRound = (item: SentenceItem) => {
        const words = item.english.split(' ').map((word, index) => ({
            id: `${word}-${index}-${Math.random()}`,
            text: word
        }));
        setBankWords(shuffleArray(words));
        setConstructionArea([]);
        setFeedback('none');
        setGameState('playing');
    };

    useEffect(() => {
        initGame();
    }, [initGame]);

    const playSound = (type: 'success' | 'error') => {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'success') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
            osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.1); // C6
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            osc.start();
            osc.stop(ctx.currentTime + 0.3);
        } else {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, ctx.currentTime);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            osc.start();
            osc.stop(ctx.currentTime + 0.3);
        }
    };

    const speakSentence = (text: string) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleWordClick = (word: Word, from: 'bank' | 'construction') => {
        if (gameState !== 'playing') return;

        if (from === 'bank') {
            setBankWords(prev => prev.filter(w => w.id !== word.id));
            setConstructionArea(prev => [...prev, word]);
        } else {
            setConstructionArea(prev => prev.filter(w => w.id !== word.id));
            setBankWords(prev => [...prev, word]);
        }
    };

    const checkAnswer = () => {
        const userAnswer = constructionArea.map(w => w.text).join(' ');
        const targetAnswer = gameSession[currentRound].english;

        if (userAnswer === targetAnswer) {
            setFeedback('success');
            setScore(prev => prev + 1);
            setGameState('round-end');
            playSound('success');
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#0d9488', '#0ea5e9', '#facc15']
            });
            speakSentence(targetAnswer);

            setTimeout(() => {
                if (currentRound < 4) {
                    const nextRound = currentRound + 1;
                    setCurrentRound(nextRound);
                    loadRound(gameSession[nextRound]);
                } else {
                    setGameState('game-over');
                }
            }, 2500);
        } else {
            setFeedback('wrong');
            playSound('error');
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);
        }
    };

    if (gameSession.length === 0) return null;

    if (gameState === 'game-over') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-white rounded-3xl shadow-xl border-4 border-teal-100 animate-in fade-in zoom-in duration-300">
                <div className="bg-yellow-100 p-6 rounded-full mb-6">
                    <Trophy className="w-16 h-16 text-yellow-500" />
                </div>
                <h2 className="text-4xl font-bold text-teal-800 mb-2 font-display">Game Over!</h2>
                <p className="text-xl text-slate-600 mb-8 font-medium">
                    You built {score} out of 5 sentences!
                </p>
                <button
                    onClick={initGame}
                    className="flex items-center gap-2 px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white rounded-2xl text-xl font-bold transition-all transform hover:scale-105 shadow-lg active:scale-95"
                >
                    <RefreshCw className="w-6 h-6" />
                    Play Again
                </button>
            </div>
        );
    }

    const currentItem = gameSession[currentRound];

    return (
        <div className="w-full max-w-2xl mx-auto p-4 md:p-8" dir="ltr">
            {/* Progress Header */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex gap-2">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className={`w-10 h-3 rounded-full transition-all duration-300 ${i < currentRound
                                    ? 'bg-teal-500'
                                    : i === currentRound
                                        ? 'bg-sky-400 animate-pulse'
                                        : 'bg-slate-200'
                                }`}
                        />
                    ))}
                </div>
                <span className="text-teal-700 font-bold font-display text-lg">
                    Round {currentRound + 1} / 5
                </span>
            </div>

            {/* Visual Cue */}
            <div className="bg-white rounded-3xl shadow-md p-6 mb-8 border-b-8 border-sky-100 flex flex-col items-center gap-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 to-sky-400" />
                <span className="text-7xl mb-2 hover:scale-110 transition-transform duration-300">
                    {currentItem.emoji}
                </span>
                <h3 className="text-3xl font-bold text-slate-700 font-display">
                    {currentItem.subject}
                </h3>
            </div>

            {/* Construction Area */}
            <div
                className={`min-h-[120px] bg-sky-50 rounded-2xl border-4 border-dashed border-sky-200 p-4 mb-4 flex flex-wrap gap-2 items-center justify-center transition-all ${isShaking ? 'animate-shake border-red-300 bg-red-50' : ''
                    } ${feedback === 'success' ? 'border-teal-400 bg-teal-50' : ''}`}
            >
                {constructionArea.length === 0 && !isShaking && (
                    <p className="text-sky-300 font-medium italic">Tap words to build the sentence...</p>
                )}
                {constructionArea.map((word) => (
                    <button
                        key={word.id}
                        onClick={() => handleWordClick(word, 'construction')}
                        className={`px-4 py-2 rounded-xl text-lg font-bold shadow-sm transition-all transform hover:-translate-y-1 active:scale-95 ${feedback === 'success'
                                ? 'bg-teal-500 text-white cursor-default'
                                : 'bg-white text-teal-700 hover:bg-teal-50 border-2 border-teal-100'
                            }`}
                    >
                        {word.text}
                    </button>
                ))}
            </div>

            {/* Word Bank */}
            <div className="mb-8 p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 min-h-[100px] flex flex-wrap gap-3 items-center justify-center">
                {bankWords.map((word) => (
                    <button
                        key={word.id}
                        onClick={() => handleWordClick(word, 'bank')}
                        className="px-5 py-3 bg-white text-slate-700 border-2 border-slate-200 rounded-2xl text-lg font-bold shadow-sm hover:border-sky-400 hover:text-sky-600 transition-all transform hover:-translate-y-1 active:scale-95"
                    >
                        {word.text}
                    </button>
                ))}
            </div>

            {/* Controls */}
            <div className="flex gap-4">
                <button
                    onClick={() => {
                        setBankWords(shuffleArray([...bankWords, ...constructionArea]));
                        setConstructionArea([]);
                        setFeedback('none');
                    }}
                    disabled={gameState !== 'playing'}
                    className="p-4 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-2xl transition-colors disabled:opacity-50"
                    title="Reset"
                >
                    <RefreshCw className="w-6 h-6" />
                </button>

                <button
                    onClick={checkAnswer}
                    disabled={gameState !== 'playing' || constructionArea.length === 0}
                    className={`flex-1 py-4 rounded-2xl text-xl font-bold flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-lg ${constructionArea.length === 0 || gameState !== 'playing'
                            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                            : 'bg-teal-500 hover:bg-teal-600 text-white'
                        }`}
                >
                    {gameState === 'round-end' ? (
                        <>
                            <CheckCircle className="w-6 h-6" />
                            Correct!
                        </>
                    ) : (
                        <>
                            <ArrowRight className="w-6 h-6" />
                            Check Answer
                        </>
                    )}
                </button>
            </div>

            {/* Instructions / Feedback Text */}
            <div className="mt-6 text-center">
                {feedback === 'wrong' && (
                    <p className="text-red-500 font-bold animate-bounce">Not quite! Try another order. 🤔</p>
                )}
                {feedback === 'success' && (
                    <p className="text-teal-600 font-bold">Excellent job! 🌟</p>
                )}
            </div>
        </div>
    );
};

export default SentenceBuilder;
