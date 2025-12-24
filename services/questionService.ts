import { QuizQuestion, OddOneOutQuestion } from "../types";
import { STATIC_QUIZ_QUESTIONS, STATIC_ODD_ONE_OUT } from "../data/staticQuestions";

// Helper to shuffle array
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const getQuizQuestions = async (): Promise<QuizQuestion[]> => {
  // Return a random set of 10 questions
  // We simulate async to keep interface consistent, but it's instant
  const shuffled = shuffleArray(STATIC_QUIZ_QUESTIONS);
  return Promise.resolve(shuffled.slice(0, 10));
};

export const getOddOneOutPuzzles = async (): Promise<OddOneOutQuestion[]> => {
  // Return a random set of 5 puzzles
  const shuffled = shuffleArray(STATIC_ODD_ONE_OUT);
  return Promise.resolve(shuffled.slice(0, 5));
};