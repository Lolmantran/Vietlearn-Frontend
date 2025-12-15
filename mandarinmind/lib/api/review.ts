import { apiClient, handleApiResponse } from "./client";
import { Review, FailedWord } from "@/types/vocabulary";

/**
 * Review API endpoints
 */
export const reviewApi = {
  /**
   * Get due reviews for today
   */
  getDueReviews: async (): Promise<string[]> => {
    // Returns array of vocabulary IDs
    return handleApiResponse(apiClient.get("/reviews/due"));
  },

  /**
   * Get review history
   */
  getHistory: async (params?: {
    page?: number;
    pageSize?: number;
    vocabularyId?: string;
  }): Promise<Review[]> => {
    return handleApiResponse(apiClient.get("/reviews/history", { params }));
  },

  /**
   * Get failed words
   */
  getFailedWords: async (): Promise<FailedWord[]> => {
    return handleApiResponse(apiClient.get("/reviews/failed"));
  },

  /**
   * Get review statistics
   */
  getStats: async (timeRange: "week" | "month" | "year"): Promise<{
    totalReviews: number;
    accuracy: number;
    averageTimePerReview: number;
    reviewsByDay: Array<{ date: string; count: number }>;
  }> => {
    return handleApiResponse(apiClient.get("/reviews/stats", { params: { timeRange } }));
  },
};
