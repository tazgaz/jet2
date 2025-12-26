import React from 'react';
import { AppView, UserProfile } from '../types';
import {
    Lock,
    BookOpen,
    ImageIcon,
    LayoutGrid,
    Pencil,
    BrainCircuit,
    GraduationCap,
    Type,
    BookCheck,
    Diamond
} from 'lucide-react';

interface GameMapProps {
    profile: UserProfile;
    levelOrder: AppView[];
    onSelectLevel: (level: AppView) => void;
}

const LEVEL_METADATA: Record<string, { title: string, icon: any, color: string, borderColor: string }> = {
    [AppView.FLASHCARDS]: { title: 'כרטיסיות', icon: BookOpen, color: 'bg-sky-500', borderColor: 'border-sky-200' },
    [AppView.IMAGE_QUIZ]: { title: 'זיהוי תמונות', icon: ImageIcon, color: 'bg-indigo-500', borderColor: 'border-indigo-200' },
    [AppView.MEMORY]: { title: 'משחק הזיכרון', icon: LayoutGrid, color: 'bg-purple-500', borderColor: 'border-purple-200' },
    [AppView.SPELLING]: { title: 'סדר אותיות', icon: Pencil, color: 'bg-pink-500', borderColor: 'border-pink-200' },
    [AppView.ODD_ONE_OUT]: { title: 'יוצא דופן', icon: BrainCircuit, color: 'bg-orange-400', borderColor: 'border-orange-200' },
    [AppView.QUIZ]: { title: 'מבחן', icon: GraduationCap, color: 'bg-green-500', borderColor: 'border-green-200' },
    [AppView.SENTENCE_BUILDER]: { title: 'בניית משפטים', icon: Type, color: 'bg-teal-500', borderColor: 'border-teal-200' },
    [AppView.STORY_READING]: { title: 'הבנת הנקרא', icon: BookCheck, color: 'bg-sky-500', borderColor: 'border-sky-200' },
};

const GameMap: React.FC<GameMapProps> = ({ profile, levelOrder, onSelectLevel }) => {
    const cols = 3;

    const getCoordinates = (index: number) => {
        const row = Math.floor(index / cols);
        let col = index % cols;

        // Winding logic: reverse Every second row
        if (row % 2 === 1) {
            col = (cols - 1) - col;
        }

        return { row, col };
    };

    const latestUnlockedIndex = Math.max(0, ...profile.unlockedLevels.map(l => levelOrder.indexOf(l)));

    // Generate curvy path data
    const generatePath = () => {
        let path = "";
        for (let i = 0; i < levelOrder.length; i++) {
            const { row, col } = getCoordinates(i);
            const x = col * 100 + 50;
            const y = row * 140 + 70;

            if (i === 0) {
                path += `M ${x} ${y}`;
            } else {
                const prev = getCoordinates(i - 1);
                const prevX = prev.col * 100 + 50;
                const prevY = prev.row * 140 + 70;

                if (prev.row === row) {
                    path += ` L ${x} ${y}`;
                } else {
                    const midY = (prevY + y) / 2;
                    path += ` C ${prevX} ${midY}, ${x} ${midY}, ${x} ${y}`;
                }
            }
        }
        return path;
    };

    return (
        <div className="relative w-full max-w-md mx-auto py-16 px-4" dir="ltr">
            {/* SVG Path Background */}
            <div className="absolute inset-0 z-0 overflow-visible pointer-events-none">
                <svg
                    className="w-full h-full min-h-[600px]"
                    viewBox={`0 0 ${cols * 100} ${Math.ceil(levelOrder.length / cols) * 140}`}
                    preserveAspectRatio="xMidYMin meet"
                >
                    <defs>
                        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="100%" stopColor="#0ea5e9" />
                        </linearGradient>
                    </defs>

                    <path
                        d={generatePath()}
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="16"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    <path
                        d={generatePath()}
                        fill="none"
                        stroke="url(#pathGradient)"
                        strokeWidth="6"
                        strokeDasharray="15 15"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="animate-[dash_30s_linear_infinite]"
                    />

                    {/* Connection Dots */}
                    {levelOrder.map((_, i) => {
                        const { row, col } = getCoordinates(i);
                        return (
                            <circle
                                key={`dot-${i}`}
                                cx={col * 100 + 50}
                                cy={row * 140 + 70}
                                r="5"
                                fill="#0ea5e9"
                                stroke="white"
                                strokeWidth="2"
                            />
                        );
                    })}
                </svg>
            </div>

            {/* Level Nodes */}
            <div
                className="grid gap-y-20 relative z-10"
                style={{
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                    direction: 'ltr'
                }}
            >
                {levelOrder.map((level, index) => {
                    const { row, col } = getCoordinates(index);
                    const meta = LEVEL_METADATA[level];
                    const isUnlocked = profile.unlockedLevels.includes(level);
                    const isCurrent = index === latestUnlockedIndex;
                    const score = profile.levelScores[level] || 0;

                    return (
                        <div
                            key={level}
                            className="relative flex flex-col items-center justify-center p-2 h-16 sm:h-20"
                            style={{
                                gridRow: row + 1,
                                gridColumn: col + 1
                            }}
                        >
                            {/* Avatar on Current Level */}
                            {isCurrent && (
                                <div className="absolute -top-16 z-20 animate-bounce">
                                    <div className={`relative ${profile.avatar.aura && profile.avatar.aura !== 'none' ? profile.avatar.aura : ''} rounded-full transition-all`}>
                                        <div className={`${profile.avatar.color} ${profile.avatar.background || ''} w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-3xl shadow-xl border-4 border-white transition-all`}>
                                            {profile.avatar.accessory}
                                        </div>
                                    </div>
                                    <div className="w-4 h-2 bg-black/20 rounded-full blur-[2px] mx-auto mt-1" />
                                </div>
                            )}

                            {/* Node Button Container */}
                            <div className="relative group">
                                <button
                                    onClick={() => isUnlocked && onSelectLevel(level)}
                                    className={`relative z-10 w-14 h-14 sm:w-18 sm:h-18 rounded-3xl flex items-center justify-center transition-all transform active:scale-90 shadow-lg border-4 ${isUnlocked
                                        ? `${meta.color} ${meta.borderColor} hover:scale-110 hover:shadow-xl hover:rotate-6`
                                        : 'bg-slate-100 border-slate-200 cursor-not-allowed opacity-90'
                                        }`}
                                >
                                    {isUnlocked ? (
                                        <meta.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                    ) : (
                                        <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300" />
                                    )}

                                    {/* Gem Badge */}
                                    {isUnlocked && score > 0 && (
                                        <div className="absolute -top-2 -right-4 bg-yellow-400 text-yellow-900 rounded-lg px-2 py-0.5 text-[10px] font-black flex items-center gap-0.5 shadow-md border border-yellow-200 z-20">
                                            <Diamond className="w-3 h-3 fill-yellow-600" />
                                            {score}
                                        </div>
                                    )}
                                </button>
                            </div>

                            <div className="mt-2 px-2 py-0.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-white/50">
                                <span className={`text-[10px] sm:text-xs font-black text-center uppercase tracking-tight max-w-[85px] leading-tight block ${isUnlocked ? 'text-slate-800' : 'text-slate-400'}`}>
                                    {meta.title}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <style>{`
                @keyframes dash {
                    to {
                        stroke-dashoffset: -1000;
                    }
                }
            `}</style>
        </div>
    );
};

export default GameMap;
