/**
 * Quiz question types
 */
export type QuizType = "meaning" | "reading" | "audio" | "multiple-choice";

/**
 * Quiz question
 */
export interface QuizQuestion {
  id: string;
  vocabularyId: string;
  type: QuizType;
  question: string;
  options?: string[]; // For multiple choice
  correctAnswer: string;
  audioUrl?: string;
  chinese?: string;
  pinyin?: string;
}

/**
 * Quiz session
 */
export interface QuizSession {
  id: string;
  userId: string;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  startTime: string;
  endTime?: string;
  score: number;
  totalQuestions: number;
}

/**
 * Quiz answer
 */
export interface QuizAnswer {
  questionId: string;
  vocabularyId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number; // in seconds
}

/**
 * Flashcard mode type
 */
export type FlashcardMode = "chinese-to-english" | "english-to-chinese";

/**
 * Flashcard session
 */
export interface FlashcardSession {
  id: string;
  userId: string;
  vocabularyIds: string[];
  currentIndex: number;
  mode: FlashcardMode;
  reviewedCount: number;
  masteredCount: number;
  failedCount: number;
}
