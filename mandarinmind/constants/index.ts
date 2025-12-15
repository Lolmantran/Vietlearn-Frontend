/**
 * HSK Levels configuration
 */
export const HSK_LEVELS = [
  { level: 1, name: "HSK 1", wordCount: 300, color: "#22c55e" },
  { level: 2, name: "HSK 2", wordCount: 600, color: "#84cc16" },
  { level: 3, name: "HSK 3", wordCount: 900, color: "#eab308" },
  { level: 4, name: "HSK 4", wordCount: 1200, color: "#f97316" },
  { level: 5, name: "HSK 5", wordCount: 1500, color: "#ef4444" },
  { level: 6, name: "HSK 6", wordCount: 2500, color: "#dc2626" },
  { level: 7, name: "HSK 7", wordCount: 3000, color: "#c026d3" },
  { level: 8, name: "HSK 8", wordCount: 4000, color: "#9333ea" },
  { level: 9, name: "HSK 9", wordCount: 5000, color: "#7c3aed" },
] as const;

/**
 * XP rewards configuration
 */
export const XP_REWARDS = {
  VOCABULARY_LEARNED: 10,
  QUIZ_CORRECT: 5,
  QUIZ_PERFECT: 50, // All questions correct
  FLASHCARD_REVIEWED: 2,
  DAILY_GOAL_COMPLETED: 100,
  STREAK_MILESTONE: 25, // Per week
  WORD_MASTERED: 20,
  ACHIEVEMENT_UNLOCKED: 50,
} as const;

/**
 * Level progression thresholds
 */
export const LEVEL_XP_THRESHOLDS = [
  0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 11000, 15000, 20000, 26000, 33000,
  41000, 50000, 60000, 71000, 83000, 96000, 110000,
];

/**
 * Streak leniency window (in hours)
 */
export const STREAK_LENIENCY_HOURS = 48;

/**
 * Default daily goals
 */
export const DEFAULT_DAILY_GOALS = {
  REVIEWS: 20,
  XP: 100,
  NEW_WORDS: 5,
} as const;

/**
 * Quiz configuration
 */
export const QUIZ_CONFIG = {
  MULTIPLE_CHOICE_OPTIONS: 4,
  MINIMUM_QUESTIONS: 5,
  MAXIMUM_QUESTIONS: 50,
  TIME_PER_QUESTION: 30, // seconds
} as const;

/**
 * Audio playback settings
 */
export const AUDIO_CONFIG = {
  DEFAULT_LANGUAGE: "zh-CN",
  SLOW_SPEED_RATE: 0.75,
  NORMAL_SPEED_RATE: 1.0,
  PRELOAD_COUNT: 3, // Number of audio files to preload
} as const;
