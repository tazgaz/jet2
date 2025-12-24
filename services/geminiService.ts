import { GoogleGenAI, Type } from "@google/genai";
import { VOCABULARY_LIST } from "../constants";
import { QuizQuestion, OddOneOutQuestion } from "../types";

// Initialize the API client
// Note: process.env.API_KEY is injected by the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = "gemini-3-flash-preview";

export const generateQuizQuestions = async (): Promise<QuizQuestion[]> => {
  try {
    const vocabString = VOCABULARY_LIST.map(v => `${v.english} (${v.hebrew})`).join(", ");

    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Create 5 multiple choice questions for 4th grade English students based on this vocabulary list: [${vocabString}]. 
      
      Mix between:
      1. Translation questions (Example: "What is 'shoes' in Hebrew?")
      2. Sentence completion (Example: "In the summer, the weather is _____ (sunny/boots/old)?")
      
      Ensure the English is simple and suitable for 10-year-olds.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Array of 4 possible answers"
              },
              correctAnswer: { type: Type.STRING, description: "Must be one of the options" },
              type: { type: Type.STRING, enum: ["translation", "sentence-completion"] }
            },
            required: ["id", "question", "options", "correctAnswer", "type"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as QuizQuestion[];
    }
    return [];
  } catch (error) {
    console.error("Error generating quiz:", error);
    // Fallback if API fails
    return [
      {
        id: "1",
        question: "מה הפירוש של המילה 'Pool'?",
        options: ["פארק", "בריכה", "חנות", "כדורגל"],
        correctAnswer: "בריכה",
        type: "translation"
      }
    ];
  }
};

export const generateOddOneOut = async (): Promise<OddOneOutQuestion[]> => {
  try {
    const vocabString = VOCABULARY_LIST.map(v => v.english).join(", ");
    
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Create 5 "Odd One Out" logic puzzles based on this word list: [${vocabString}].
      For each puzzle, provide 4 words where 3 belong to a category (e.g., weather, clothes, pronouns) and 1 does not.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              words: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Array of 4 words"
              },
              oddWord: { type: Type.STRING, description: "The word that does not belong" },
              reason: { type: Type.STRING, description: "Explanation in Hebrew why it is the odd one out (e.g. 'These are clothes, but this is a weather word')" }
            },
            required: ["id", "words", "oddWord", "reason"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as OddOneOutQuestion[];
    }
    return [];

  } catch (error) {
    console.error("Error generating odd one out:", error);
    return [];
  }
}