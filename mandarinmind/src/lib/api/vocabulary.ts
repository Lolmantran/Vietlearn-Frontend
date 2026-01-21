import { apiClient, handleApiResponse } from "./client";
import { Vocabulary, VocabularyProgress, WordPack } from "@/types/vocabulary";
import { PaginatedResponse } from "@/types/api";

/**
 * Vocabulary API endpoints
 */
export const vocabularyApi = {
  /**
   * Get vocabulary by ID
   */
  getById: async (id: string): Promise<Vocabulary> => {
    return handleApiResponse(apiClient.get(`/vocabulary/${id}`));
  },

  /**
   * Get vocabulary list with pagination
   */
  getList: async (params?: {
    page?: number;
    pageSize?: number;
    hskLevel?: number;
    search?: string;
  }): Promise<PaginatedResponse<Vocabulary>> => {
    return handleApiResponse(apiClient.get("/vocabulary", { params }));
  },

  /**
   * Get word packs
   */
  getWordPacks: async (): Promise<WordPack[]> => {
    return handleApiResponse(apiClient.get("/vocabulary/packs"));
  },

  /**
   * Get vocabulary by word pack
   */
  getByWordPack: async (packId: string): Promise<Vocabulary[]> => {
    return handleApiResponse(apiClient.get(`/vocabulary/packs/${packId}/words`));
  },

  /**
   * Get user's vocabulary progress
   */
  getUserProgress: async (vocabularyId: string): Promise<VocabularyProgress> => {
    return handleApiResponse(apiClient.get(`/vocabulary/${vocabularyId}/progress`));
  },

  /**
   * Get all user's vocabulary progress
   */
  getAllUserProgress: async (): Promise<VocabularyProgress[]> => {
    return handleApiResponse(apiClient.get("/vocabulary/progress"));
  },

  /**
   * Update vocabulary progress after review
   */
  updateProgress: async (
    vocabularyId: string,
    data: {
      isCorrect: boolean;
      reviewType: "flashcard" | "quiz" | "audio";
      timeSpent: number;
    }
  ): Promise<VocabularyProgress> => {
    return handleApiResponse(apiClient.post(`/vocabulary/${vocabularyId}/review`, data));
  },
};
