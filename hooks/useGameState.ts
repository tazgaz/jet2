import { useState, useEffect } from 'react';
import { AppView, UserProfile } from '../types';
import { getCookie, setCookie } from '../utils/storage';

const STORAGE_KEY = 'tzamrot_game_state_v2';
const COOKIE_DAYS = 30;

const LEVEL_ORDER = [
    AppView.FLASHCARDS,
    AppView.IMAGE_QUIZ,
    AppView.MEMORY,
    AppView.SPELLING,
    AppView.ODD_ONE_OUT,
    AppView.QUIZ,
    AppView.SENTENCE_BUILDER,
    AppView.STORY_READING
];

const INITIAL_STATE: UserProfile = {
    coins: 0,
    earnedMinutes: 0,
    receivedFirstLevelTime: false,
    unlockedLevels: [LEVEL_ORDER[0]],
    levelScores: {},
    purchasedItems: {
        'accessory-⭐': true,
        'color-bg-amber-400': true
    },
    avatar: {
        color: 'bg-amber-400',
        accessory: '⭐'
    }
};

export const useGameState = () => {
    const [profile, setProfile] = useState<UserProfile>(() => {
        // Try Cookie first, then localStorage
        const savedCookie = getCookie(STORAGE_KEY);
        const savedLocal = localStorage.getItem(STORAGE_KEY);
        const saved = savedCookie || savedLocal;

        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Migration check
                if (!parsed.levelScores) {
                    parsed.levelScores = {};
                }
                if (parsed.earnedMinutes === undefined) {
                    parsed.earnedMinutes = 0;
                }
                if (parsed.receivedFirstLevelTime === undefined) {
                    parsed.receivedFirstLevelTime = false;
                }
                if (!parsed.purchasedItems) {
                    parsed.purchasedItems = {
                        [`accessory-${parsed.avatar?.accessory || '⭐'}`]: true,
                        [`color-${parsed.avatar?.color || 'bg-amber-400'}`]: true
                    };
                }
                return parsed;
            } catch (e) {
                return INITIAL_STATE;
            }
        }
        return INITIAL_STATE;
    });

    useEffect(() => {
        const data = JSON.stringify(profile);
        localStorage.setItem(STORAGE_KEY, data);
        setCookie(STORAGE_KEY, data, COOKIE_DAYS);
    }, [profile]);

    const updateLevelScore = (level: AppView, score: number) => {
        setProfile(prev => {
            const currentBest = prev.levelScores[level] || 0;
            const newLevelScores = { ...prev.levelScores };

            let coinsToAdd = score;
            if (level === LEVEL_ORDER[0]) {
                const currentLevelBest = prev.levelScores[level] || 0;
                // For level 1, only add coins for new high scores, capped at 10 total
                const cappedNewScore = Math.min(score, 10);
                coinsToAdd = Math.max(0, cappedNewScore - currentLevelBest);
            }

            if (score > currentBest) {
                newLevelScores[level] = score;
            }

            const currentIndex = LEVEL_ORDER.indexOf(level);
            const nextLevel = LEVEL_ORDER[currentIndex + 1];

            const newUnlocked = [...prev.unlockedLevels];
            // Only unlock next level if score reaches the threshold (5)
            if (score >= 5 && nextLevel && !newUnlocked.includes(nextLevel)) {
                newUnlocked.push(nextLevel);
            }

            // Reward 10 minutes for completing the first level once
            let addedMinutes = 0;
            let newlyReceivedFirstLevelTime = prev.receivedFirstLevelTime;
            if (level === LEVEL_ORDER[0] && score >= 5 && !prev.receivedFirstLevelTime) {
                addedMinutes = 10;
                newlyReceivedFirstLevelTime = true;
            }

            return {
                ...prev,
                coins: prev.coins + coinsToAdd,
                earnedMinutes: prev.earnedMinutes + addedMinutes,
                receivedFirstLevelTime: newlyReceivedFirstLevelTime,
                levelScores: newLevelScores,
                unlockedLevels: newUnlocked
            };
        });
    };

    const purchaseItem = (type: 'color' | 'accessory', itemId: string, cost: number) => {
        setProfile(prev => {
            if (prev.coins < cost) return prev;

            const key = `${type}-${itemId}`;
            return {
                ...prev,
                coins: prev.coins - cost,
                purchasedItems: { ...prev.purchasedItems, [key]: true },
                avatar: {
                    ...prev.avatar,
                    [type]: itemId
                }
            };
        });
    };

    const selectItem = (type: 'color' | 'accessory', itemId: string) => {
        setProfile(prev => ({
            ...prev,
            avatar: {
                ...prev.avatar,
                [type]: itemId
            }
        }));
    };

    return { profile, updateLevelScore, purchaseItem, selectItem, LEVEL_ORDER };
};
