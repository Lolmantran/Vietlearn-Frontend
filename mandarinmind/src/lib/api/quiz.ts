import { apiClient, handleApiResponse } from "./client";
import { QuizQuestion } from "@/types/quiz";

/**
 * Quiz API endpoints
 */
export const quizApi = {
  /**
   * Generate quiz questions
   */
  generateQuiz: async (params: {
    vocabularyIds?: string[];
    count?: number;
    type?: "meaning" | "reading" | "audio" | "multiple-choice" | "mixed";
    hskLevel?: number;
  }): Promise<QuizQuestion[]> => {
    return handleApiResponse(apiClient.post("/quiz/generate", params));
  },

  /**
   * Submit quiz results
   */
  submitResults: async (data: {
    answers: Array<{
      vocabularyId: string;
      isCorrect: boolean;
      timeSpent: number;
    }>;
    totalScore: number;
    totalTimeSpent: number;
  }): Promise<{ xpEarned: number; newLevel?: number }> => {
    return handleApiResponse(apiClient.post("/quiz/submit", data));
  },
};
