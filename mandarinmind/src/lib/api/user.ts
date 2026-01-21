import { apiClient, handleApiResponse } from "./client";
import { User, UserStats, Streak, Achievement, UserAchievement } from "@/types/user";

/**
 * User API endpoints
 */
export const userApi = {
  /**
   * Get current user profile
   */
  getProfile: async (): Promise<User> => {
    return handleApiResponse(apiClient.get("/user/profile"));
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: Partial<User>): Promise<User> => {
    return handleApiResponse(apiClient.patch("/user/profile", data));
  },

  /**
   * Get user statistics
   */
  getStats: async (): Promise<UserStats> => {
    return handleApiResponse(apiClient.get("/user/stats"));
  },

  /**
   * Get user streak
   */
  getStreak: async (): Promise<Streak> => {
    return handleApiResponse(apiClient.get("/user/streak"));
  },

  /**
   * Get all achievements
   */
  getAchievements: async (): Promise<Achievement[]> => {
    return handleApiResponse(apiClient.get("/achievements"));
  },

  /**
   * Get user's unlocked achievements
   */
  getUserAchievements: async (): Promise<UserAchievement[]> => {
    return handleApiResponse(apiClient.get("/user/achievements"));
  },

  /**
   * Update daily activity (for streak tracking)
   */
  updateDailyActivity: async (): Promise<Streak> => {
    return handleApiResponse(apiClient.post("/user/activity"));
  },
};
