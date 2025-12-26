import React, { useState, useEffect, useRef, useCallback } from 'react';
import { VOCABULARY_LIST } from '../constants';
import { VocabWord } from '../types';
import { Heart, Rocket, Target, Play, RotateCcw, Home, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSound, speakWord } from '../utils/gameEffects';

interface WordInvadersProps {
    onComplete: (score: number) => void;
}

interface FallingWord {
    id: number;
    word: VocabWord;
    x: number;
    y: number;
    speed: number;
    isCorrect: boolean;
}

interface Projectile {
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    progress: number;
}

const SPAWN_INTERVAL = 2500;
const WIN_SCORE = 15;
const MAX_LIVES = 3;

const WordInvaders: React.FC<WordInvadersProps> = ({ onComplete }) => {
    const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER' | 'VICTORY'>('START');
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(MAX_LIVES);
    const [targetWord, setTargetWord] = useState<VocabWord | null>(null);
    const [words, setWords] = useState<FallingWord[]>([]);
    const [laser, setLaser] = useState<Projectile | null>(null);

    const gameContainerRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>();
    const lastSpawnTime = useRef<number>(0);
    const scoreRef = useRef(0);
    const livesRef = useRef(MAX_LIVES);
    const wordsRef = useRef<FallingWord[]>([]);
    const nextId = useRef(0);

    const pickNewTarget = useCallback(() => {
        const randomWord = VOCABULARY_LIST[Math.floor(Math.random() * VOCABULARY_LIST.length)];
        setTargetWord(randomWord);
        return randomWord;
    }, []);

    const spawnWord = useCallback((currentTarget: VocabWord) => {
        const isCorrectSpawn = Math.random() > 0.6; // 40% chance of spawning the correct word
        let wordToSpawn = currentTarget;

        if (!isCorrectSpawn) {
            wordToSpawn = VOCABULARY_LIST[Math.floor(Math.random() * VOCABULARY_LIST.length)];
        }

        const newWord: FallingWord = {
            id: nextId.current++,
            word: wordToSpawn,
            x: Math.random() * 80 + 10, // 10% to 90% width
            y: -10,
            speed: 0.3 + Math.min(scoreRef.current * 0.03, 1.2), // Slower base speed and scaling
            isCorrect: wordToSpawn.english === currentTarget.english
        };

        wordsRef.current = [...wordsRef.current, newWord];
        setWords([...wordsRef.current]);
    }, []);

    const updateGame = useCallback((time: number) => {
        if (gameState !== 'PLAYING') return;

        if (time - lastSpawnTime.current > Math.max(SPAWN_INTERVAL - (scoreRef.current * 50), 800)) {
            if (targetWord) {
                spawnWord(targetWord);
            }
            lastSpawnTime.current = time;
        }

        const containerHeight = gameContainerRef.current?.clientHeight || 600;
        let livesLost = 0;

        const updatedWords = wordsRef.current.map(w => ({
            ...w,
            y: w.y + w.speed
        })).filter(w => {
            if (w.y > 100) {
                if (w.isCorrect) {
                    livesLost++;
                }
                return false;
            }
            return true;
        });

        if (livesLost > 0) {
            playSound('error');
            livesRef.current -= livesLost;
            setLives(livesRef.current);
            if (livesRef.current <= 0) {
                setGameState('GAMEOVER');
            }
        }

        wordsRef.current = updatedWords;
        setWords(updatedWords);

        requestRef.current = requestAnimationFrame(updateGame);
    }, [gameState, spawnWord, targetWord]);

    useEffect(() => {
        if (gameState === 'PLAYING') {
            requestRef.current = requestAnimationFrame(updateGame);
        } else {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [gameState, updateGame]);

    const startGame = () => {
        const firstTarget = pickNewTarget();
        setScore(0);
        scoreRef.current = 0;
        setLives(MAX_LIVES);
        livesRef.current = MAX_LIVES;
        wordsRef.current = [];
        setWords([]);
        setGameState('PLAYING');
        lastSpawnTime.current = performance.now();
    };

    const handleWordClick = (clickedWord: FallingWord, e: React.MouseEvent) => {
        if (gameState !== 'PLAYING') return;

        // Visual feedback: Laser
        const rect = gameContainerRef.current?.getBoundingClientRect();
        if (rect) {
            setLaser({
                x: 50, // center %
                y: 95, // near bottom %
                targetX: clickedWord.x,
                targetY: clickedWord.y,
                progress: 0
            });
            setTimeout(() => setLaser(null), 200);
        }

        if (clickedWord.isCorrect) {
            playSound('success');
            speakWord(clickedWord.word.english);
            const newScore = score + 1;
            setScore(newScore);
            scoreRef.current = newScore;

            // Remove the clicked word
            wordsRef.current = wordsRef.current.filter(w => w.id !== clickedWord.id);
            setWords([...wordsRef.current]);

            if (newScore >= WIN_SCORE) {
                setGameState('VICTORY');
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            } else {
                pickNewTarget();
            }
        } else {
            playSound('error');
            const newLives = lives - 1;
            setLives(newLives);
            livesRef.current = newLives;

            // Flash red or something? Maybe just remove the wrong word to prevent double loss
            wordsRef.current = wordsRef.current.filter(w => w.id !== clickedWord.id);
            setWords([...wordsRef.current]);

            if (newLives <= 0) {
                setGameState('GAMEOVER');
            }
        }
    };

    return (
        <div
            ref={gameContainerRef}
            className="relative w-full h-[600px] bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-slate-800"
            dir="ltr"
        >
            {/* Stars Background */}
            <div className="absolute inset-0 opacity-30">
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    />
                ))}
            </div>

            {/* HUD */}
            <div className="absolute top-6 left-0 w-full px-8 flex justify-between items-center z-20">
                <div className="bg-slate-800/80 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-3 border border-slate-700">
                    <Target className="text-sky-400" size={20} />
                    <span className="text-white font-black text-xl">{score}</span>
                </div>
                <div className="flex gap-2">
                    {[...Array(MAX_LIVES)].map((_, i) => (
                        <Heart
                            key={i}
                            size={24}
                            className={i < lives ? "text-rose-500 fill-rose-500" : "text-slate-600"}
                        />
                    ))}
                </div>
            </div>

            {/* Start Screen */}
            {gameState === 'START' && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm p-8 text-center">
                    <div className="bg-sky-500 p-6 rounded-full mb-8 shadow-[0_0_50px_rgba(14,165,233,0.5)] animate-pulse">
                        <Rocket size={64} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase">Word Invaders</h1>
                    <p className="text-slate-400 font-bold mb-8 max-w-xs uppercase text-sm tracking-widest">
                        Shoot the English words that match the Hebrew target! Don't let the correct words reach the ground.
                    </p>
                    <button
                        onClick={startGame}
                        className="bg-white text-slate-900 px-12 py-5 rounded-3xl font-black text-2xl hover:bg-sky-400 hover:text-white transition-all transform active:scale-95 shadow-xl flex items-center gap-3"
                    >
                        <Play fill="currentColor" /> START MISSION
                    </button>
                </div>
            )}

            {/* Game Over Screen */}
            {gameState === 'GAMEOVER' && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm p-8 text-center animate-fade-in">
                    <div className="text-7xl mb-6">🛸</div>
                    <h2 className="text-5xl font-black text-white mb-2 tracking-tighter uppercase italic">Mission Failed!</h2>
                    <p className="text-slate-400 font-bold mb-8 uppercase tracking-widest">The invaders have taken over!</p>
                    <div className="bg-slate-800 p-6 rounded-3xl mb-8 w-full max-w-[200px]">
                        <div className="text-slate-400 text-xs font-black uppercase mb-1">Final Score</div>
                        <div className="text-4xl font-black text-white">{score}</div>
                    </div>
                    <div className="flex flex-col gap-4 w-full max-w-[240px]">
                        <button
                            onClick={startGame}
                            className="w-full bg-sky-500 text-white py-4 rounded-2xl font-black text-xl shadow-lg hover:bg-sky-600 transition-all flex items-center justify-center gap-2"
                        >
                            <RotateCcw size={20} /> TRY AGAIN
                        </button>
                        <button
                            onClick={() => onComplete(0)}
                            className="w-full text-slate-400 font-bold py-2 hover:text-white transition-colors flex items-center justify-center gap-2"
                        >
                            <Home size={18} /> BACK TO MAP
                        </button>
                    </div>
                </div>
            )}

            {/* Victory Screen */}
            {gameState === 'VICTORY' && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm p-8 text-center animate-fade-in">
                    <div className="text-7xl mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">🎖️</div>
                    <h2 className="text-5xl font-black text-white mb-2 tracking-tighter uppercase italic">Galaxy Saved!</h2>
                    <p className="text-sky-400 font-bold mb-8 uppercase tracking-widest">Master of English Vocab</p>
                    <div className="bg-sky-500/20 border-2 border-sky-500/30 p-6 rounded-3xl mb-8 w-full max-w-[200px]">
                        <div className="text-sky-300 text-xs font-black uppercase mb-1">Victory Bonus</div>
                        <div className="text-4xl font-black text-sky-400">+{score * 5} 💎</div>
                    </div>
                    <button
                        onClick={() => onComplete(score)}
                        className="w-full max-w-[240px] bg-emerald-500 text-white py-4 rounded-2xl font-black text-xl shadow-lg shadow-emerald-900/40 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                    >
                        COLLECT REWARDS <Home size={20} />
                    </button>
                </div>
            )}

            {/* Game Canvas / Active Stage */}
            <div className="relative w-full h-full">
                {/* Laser Effect */}
                {laser && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
                        <line
                            x1={`${laser.x}%`}
                            y1={`${laser.y}%`}
                            x2={`${laser.targetX}%`}
                            y2={`${laser.targetY}%`}
                            stroke="#38bdf8"
                            strokeWidth="4"
                            strokeLinecap="round"
                            className="animate-pulse"
                            style={{ filter: 'drop-shadow(0 0 8px #0ea5e9)' }}
                        />
                    </svg>
                )}

                {/* Falling Words */}
                {words.map((w) => (
                    <button
                        key={w.id}
                        onClick={(e) => handleWordClick(w, e)}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-shadow"
                        style={{
                            left: `${w.x}%`,
                            top: `${w.y}%`,
                        }}
                    >
                        <div className="group relative">
                            <div className="absolute -inset-2 bg-sky-500 rounded-2xl blur-md opacity-0 group-hover:opacity-50 transition-opacity" />
                            <div className="relative bg-slate-800 border-2 border-slate-700 px-6 py-4 rounded-3xl shadow-xl flex flex-col items-center group-hover:border-sky-400 group-active:scale-95 transition-all">
                                <span className="text-white font-black text-lg uppercase tracking-wider">{w.word.english}</span>
                            </div>
                        </div>
                    </button>
                ))}

                {/* Bottom Cannon and Target */}
                <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col items-center">
                    <div className="relative w-full max-w-xs bg-slate-800/80 backdrop-blur-md rounded-3xl border-4 border-sky-500/50 p-6 shadow-[0_-10px_30px_rgba(14,165,233,0.2)]">
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                            {/* Cannon Shape */}
                            <div className="w-8 h-12 bg-gradient-to-t from-sky-400 to-sky-600 rounded-t-lg shadow-lg relative">
                                <Zap className="absolute top-1 left-1/2 -translate-x-1/2 text-white/50" size={12} />
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-slate-400 text-[10px] font-black uppercase mb-1 tracking-widest">Current Target</div>
                            <div className="text-3xl font-black text-white" dir="rtl">
                                {targetWord?.hebrew || '...'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WordInvaders;
