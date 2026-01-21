/**
 * User interface
 */
export interface User {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  level: number;
  xp: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * User statistics
 */
export interface UserStats {
  userId: string;
  totalWordsLearned: number;
  totalWordsMastered: number;
  totalReviews: number;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  averageAccuracy: number;
  totalStudyTime: number; // in minutes
  lastStudyDate?: string;
}

/**
 * Learning streak
 */
export interface Streak {
  id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  streakStartDate: string;
}

/**
 * Achievement/Badge
 */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "learning" | "streak" | "mastery" | "speed" | "perfect";
  requirement: number;
  xpReward: number;
}

/**
 * User achievement
 */
export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: string;
  achievement?: Achievement;
}

/**
 * Daily goal
 */
export interface DailyGoal {
  id: string;
  userId: string;
  targetReviews: number;
  completedReviews: number;
  targetXP: number;
  earnedXP: number;
  date: string;
  isCompleted: boolean;
}
