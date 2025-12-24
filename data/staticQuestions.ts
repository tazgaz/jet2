import { QuizQuestion, OddOneOutQuestion } from "../types";

export const STATIC_QUIZ_QUESTIONS: QuizQuestion[] = [
  // Translations - English to Hebrew
  {
    id: "t1",
    question: "מה הפירוש של המילה 'Pool'?",
    options: ["חנות", "בריכה", "פארק", "כדור"],
    correctAnswer: "בריכה",
    type: "translation"
  },
  {
    id: "t2",
    question: "מה הפירוש של המילה 'Cloud'?",
    options: ["שמש", "ענן", "גשם", "חם"],
    correctAnswer: "ענן",
    type: "translation"
  },
  {
    id: "t3",
    question: "מה הפירוש של המילה 'Boots'?",
    options: ["נעליים", "גרביים", "מגפיים", "חולצה"],
    correctAnswer: "מגפיים",
    type: "translation"
  },
  {
    id: "t4",
    question: "מה הפירוש של המילה 'Dress'?",
    options: ["שמלה", "חצאית", "מעיל", "מכנסיים"],
    correctAnswer: "שמלה",
    type: "translation"
  },
  {
    id: "t5",
    question: "מה הפירוש של המילה 'Ice cream'?",
    options: ["קרח", "עוגה", "גלידה", "סוכריה"],
    correctAnswer: "גלידה",
    type: "translation"
  },
  {
    id: "t6",
    question: "מה הפירוש של המילה 'Store'?",
    options: ["סיפור", "חנות", "כוכב", "רחוב"],
    correctAnswer: "חנות",
    type: "translation"
  },
  {
    id: "t7",
    question: "מה הפירוש של המילה 'Sunny'?",
    options: ["מעונן", "שמשי", "גשום", "קר"],
    correctAnswer: "שמשי",
    type: "translation"
  },
  {
    id: "t8",
    question: "מה הפירוש של המילה 'Warm'?",
    options: ["קר", "חמים", "רטוב", "יבש"],
    correctAnswer: "חמים",
    type: "translation"
  },
  {
    id: "t9",
    question: "מה הפירוש של המילה 'Children'?",
    options: ["ילד", "ילדים", "הורים", "אנשים"],
    correctAnswer: "ילדים",
    type: "translation"
  },
  {
    id: "t10",
    question: "מה הפירוש של המילה 'Play'?",
    options: ["ללכת", "לשחק", "לישון", "לאכול"],
    correctAnswer: "לשחק",
    type: "translation"
  },
  {
    id: "t11",
    question: "מה הפירוש של המילה 'Wear'?",
    options: ["לנעול", "ללבוש", "לקנות", "למכור"],
    correctAnswer: "ללבוש",
    type: "translation"
  },
  {
    id: "t12",
    question: "מה הפירוש של המילה 'Socks'?",
    options: ["גרביים", "נעליים", "מגפיים", "כפפות"],
    correctAnswer: "גרביים",
    type: "translation"
  },
  {
    id: "t13",
    question: "מה הפירוש של המילה 'Game'?",
    options: ["שם", "משחק", "גן", "לבוא"],
    correctAnswer: "משחק",
    type: "translation"
  },
  {
    id: "t14",
    question: "מה הפירוש של המילה 'Shirt'?",
    options: ["חולצה", "מכנס", "כובע", "מעיל"],
    correctAnswer: "חולצה",
    type: "translation"
  },
  {
    id: "t15",
    question: "איך אומרים 'הם' או 'הן' באנגלית?",
    options: ["We", "They", "He", "She"],
    correctAnswer: "They",
    type: "translation"
  },
  {
    id: "t16",
    question: "איך אומרים 'אנחנו' באנגלית?",
    options: ["They", "We", "I", "You"],
    correctAnswer: "We",
    type: "translation"
  },

  // Sentence Completion
  {
    id: "s1",
    question: "It is raining. Put on your ______.",
    options: ["boots", "sunny", "ice cream", "game"],
    correctAnswer: "boots",
    type: "sentence-completion"
  },
  {
    id: "s2",
    question: "In the summer, the weather is ______.",
    options: ["boots", "sunny", "old", "shirt"],
    correctAnswer: "sunny",
    type: "sentence-completion"
  },
  {
    id: "s3",
    question: "We play ______ in the park.",
    options: ["football", "dress", "pool", "socks"],
    correctAnswer: "football",
    type: "sentence-completion"
  },
  {
    id: "s4",
    question: "I want to buy candy at the ______.",
    options: ["store", "cloud", "socks", "football"],
    correctAnswer: "store",
    type: "sentence-completion"
  },
  {
    id: "s5",
    question: "Look at the sky! There is a big ______.",
    options: ["cloud", "dress", "game", "shoe"],
    correctAnswer: "cloud",
    type: "sentence-completion"
  },
  {
    id: "s6",
    question: "Can you ______ a cake?",
    options: ["make", "wear", "he", "sunny"],
    correctAnswer: "make",
    type: "sentence-completion"
  },
  {
    id: "s7",
    question: "It is hot. Let's go to the ______.",
    options: ["pool", "boots", "coat", "socks"],
    correctAnswer: "pool",
    type: "sentence-completion"
  },
  {
    id: "s8",
    question: "She is wearing a beautiful ______.",
    options: ["dress", "game", "cloud", "pool"],
    correctAnswer: "dress",
    type: "sentence-completion"
  },
  {
    id: "s9",
    question: "I like to eat chocolate ______.",
    options: ["ice cream", "boots", "shirt", "socks"],
    correctAnswer: "ice cream",
    type: "sentence-completion"
  },
  {
    id: "s10",
    question: "Put your shoes and ______ on your feet.",
    options: ["socks", "shirt", "hat", "cloud"],
    correctAnswer: "socks",
    type: "sentence-completion"
  }
];

export const STATIC_ODD_ONE_OUT: OddOneOutQuestion[] = [
  {
    id: "o1",
    words: ["boots", "dress", "shirt", "cloud"],
    oddWord: "cloud",
    reason: "Cloud is weather, the others are clothes."
  },
  {
    id: "o2",
    words: ["sunny", "warm", "cloud", "shoes"],
    oddWord: "shoes",
    reason: "Shoes are clothing, the others describe weather."
  },
  {
    id: "o3",
    words: ["he", "she", "we", "store"],
    oddWord: "store",
    reason: "Store is a place, the others are pronouns (גופים)."
  },
  {
    id: "o4",
    words: ["football", "basketball", "game", "dress"],
    oddWord: "dress",
    reason: "Dress is clothing, the others are related to sports and games."
  },
  {
    id: "o5",
    words: ["ice cream", "store", "park", "he"],
    oddWord: "he",
    reason: "'He' is a pronoun, the others are nouns (things or places)."
  },
  {
    id: "o6",
    words: ["make", "come", "play", "sunny"],
    oddWord: "sunny",
    reason: "Sunny is an adjective, the others are verbs (פעולות)."
  },
  {
    id: "o7",
    words: ["boots", "shoes", "socks", "cloud"],
    oddWord: "cloud",
    reason: "Cloud is in the sky, the others go on your feet."
  },
  {
    id: "o8",
    words: ["sunny", "warm", "cloud", "football"],
    oddWord: "football",
    reason: "Football is a sport, the others are weather words."
  },
  {
    id: "o9",
    words: ["pool", "park", "store", "she"],
    oddWord: "she",
    reason: "'She' is a person word (pronoun), the others are places."
  },
  {
    id: "o10",
    words: ["Good for you", "Can you", "I can", "Pool"],
    oddWord: "Pool",
    reason: "Pool is a noun (place), the others are phrases."
  }
];