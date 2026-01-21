import { SRSLevel } from "@/lib/srs/algorithm";

/**
 * HSK Level type (1-9 following new HSK standard)
 */
export type HSKLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * Difficulty tier
 */
export type DifficultyTier = "beginner" | "intermediate" | "advanced";

/**
 * Vocabulary word interface
 */
export interface Vocabulary {
  id: string;
  chinese: string;
  pinyin: string;
  english: string;
  synonyms?: string[];
  audioUrl?: string;
  exampleSentences?: ExampleSentence[];
  hskLevel?: HSKLevel;
  difficultyTier: DifficultyTier;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Example sentence
 */
export interface ExampleSentence {
  id: string;
  chinese: string;
  pinyin: string;
  english: string;
  audioUrl?: string;
}

/**
 * Word pack/lesson
 */
export interface WordPack {
  id: string;
  name: string;
  description: string;
  category: string;
  hskLevel?: HSKLevel;
  vocabularyIds: string[];
  vocabularyCount: number;
  isLocked: boolean;
  requiredLevel?: number;
  imageUrl?: string;
  createdAt: string;
}

/**
 * User's vocabulary progress
 */
export interface VocabularyProgress {
  id: string;
  userId: string;
  vocabularyId: string;
  srsLevel: SRSLevel;
  lastReviewDate: string;
  nextReviewDate: string;
  correctCount: number;
  incorrectCount: number;
  streak: number;
  isMastered: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Review session record
 */
export interface Review {
  id: string;
  userId: string;
  vocabularyId: string;
  isCorrect: boolean;
  previousSRSLevel: SRSLevel;
  newSRSLevel: SRSLevel;
  reviewType: "flashcard" | "quiz" | "audio";
  timeSpent: number; // in seconds
  createdAt: string;
}

/**
 * Failed word tracking
 */
export interface FailedWord {
  id: string;
  userId: string;
  vocabularyId: string;
  failCount: number;
  lastFailedDate: string;
  reviewType: "flashcard" | "quiz" | "audio";
}
