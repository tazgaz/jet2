export interface VocabWord {
  english: string;
  hebrew: string;
  category: 'verb' | 'noun' | 'adjective' | 'phrase' | 'pronoun' | 'clothing' | 'weather' | 'sport';
  emoji: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  type: 'translation' | 'sentence-completion';
}

export interface OddOneOutQuestion {
  id: string;
  words: string[];
  oddWord: string;
  reason: string;
}

export interface StoryQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Story {
  id: string;
  title: string;
  emoji: string;
  text: string[];
  questions: StoryQuestion[];
}

export enum AppView {
  HOME = 'HOME',
  FLASHCARDS = 'FLASHCARDS',
  MEMORY = 'MEMORY',
  QUIZ = 'QUIZ',
  ODD_ONE_OUT = 'ODD_ONE_OUT',
  SPELLING = 'SPELLING',
  IMAGE_QUIZ = 'IMAGE_QUIZ',
  SENTENCE_BUILDER = 'SENTENCE_BUILDER',
  STORY_READING = 'STORY_READING',
  WORD_INVADERS = 'WORD_INVADERS',
  SHOP = 'SHOP'
}

export interface UserProfile {
  coins: number;
  unlockedLevels: AppView[];
  levelScores: Record<string, number>;
  purchasedItems: Record<string, boolean>;
  avatar: {
    color: string;
    accessory: string;
    background?: string;
    aura?: string;
  };
}