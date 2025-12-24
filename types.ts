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

export enum AppView {
  HOME = 'HOME',
  FLASHCARDS = 'FLASHCARDS',
  MEMORY = 'MEMORY',
  QUIZ = 'QUIZ',
  ODD_ONE_OUT = 'ODD_ONE_OUT',
  SPELLING = 'SPELLING',
  IMAGE_QUIZ = 'IMAGE_QUIZ'
}