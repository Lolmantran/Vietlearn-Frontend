/**
 * Spaced Repetition System (SRS) Algorithm
 * Based on SM-2 algorithm with custom intervals
 */

export type SRSLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * SRS interval mapping (in days)
 * Level 0: New/Failed (review today)
 * Level 1: 1 day
 * Level 2: 2 days
 * Level 3: 4 days
 * Level 4: 7 days (1 week)
 * Level 5: 14 days (2 weeks)
 * Level 6: 30 days (1 month)
 * Level 7: 60 days (2 months)
 * Level 8: 120 days (4 months)
 * Level 9: Burned (mastered)
 */
export const SRS_INTERVALS: Record<SRSLevel, number> = {
  0: 0,    // Review today
  1: 1,
  2: 2,
  3: 4,
  4: 7,
  5: 14,
  6: 30,
  7: 60,
  8: 120,
  9: -1,   // Burned (no more reviews)
};

/**
 * Calculate next review date based on SRS level
 */
export function calculateNextReviewDate(currentLevel: SRSLevel, isCorrect: boolean): {
  nextLevel: SRSLevel;
  nextReviewDate: Date;
} {
  let nextLevel: SRSLevel;

  if (isCorrect) {
    // Progress to next level (max level 9)
    nextLevel = Math.min(currentLevel + 1, 9) as SRSLevel;
  } else {
    // Failed: drop to level 0
    nextLevel = 0;
  }

  const intervalDays = SRS_INTERVALS[nextLevel];
  const nextReviewDate = new Date();
  
  if (intervalDays >= 0) {
    nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays);
  }

  return { nextLevel, nextReviewDate };
}

/**
 * Check if a review is due
 */
export function isReviewDue(nextReviewDate: Date | string): boolean {
  return new Date(nextReviewDate) <= new Date();
}

/**
 * Get SRS level name
 */
export function getSRSLevelName(level: SRSLevel): string {
  const names: Record<SRSLevel, string> = {
    0: "Apprentice I",
    1: "Apprentice II",
    2: "Apprentice III",
    3: "Apprentice IV",
    4: "Guru I",
    5: "Guru II",
    6: "Master",
    7: "Enlightened I",
    8: "Enlightened II",
    9: "Burned",
  };
  return names[level];
}

/**
 * Calculate forgetting probability based on time since last review
 * Higher probability = more urgent to review
 */
export function calculateForgettingProbability(
  lastReviewDate: Date | string,
  nextReviewDate: Date | string
): number {
  const now = new Date().getTime();
  const lastReview = new Date(lastReviewDate).getTime();
  const nextReview = new Date(nextReviewDate).getTime();

  const totalInterval = nextReview - lastReview;
  const timePassed = now - lastReview;

  if (totalInterval <= 0) return 0;

  const probability = Math.min((timePassed / totalInterval) * 100, 100);
  return Math.round(probability);
}
