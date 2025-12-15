"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vocabularyApi } from "@/lib/api";
import { Vocabulary, VocabularyProgress } from "@/types/vocabulary";

/**
 * Hook to fetch vocabulary by ID
 */
export function useVocabulary(id: string) {
  return useQuery({
    queryKey: ["vocabulary", id],
    queryFn: () => vocabularyApi.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to fetch vocabulary list
 */
export function useVocabularyList(params?: {
  page?: number;
  pageSize?: number;
  hskLevel?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: ["vocabulary", "list", params],
    queryFn: () => vocabularyApi.getList(params),
  });
}

/**
 * Hook to fetch word packs
 */
export function useWordPacks() {
  return useQuery({
    queryKey: ["vocabulary", "packs"],
    queryFn: () => vocabularyApi.getWordPacks(),
  });
}

/**
 * Hook to fetch vocabulary by word pack
 */
export function useWordPackVocabulary(packId: string) {
  return useQuery({
    queryKey: ["vocabulary", "pack", packId],
    queryFn: () => vocabularyApi.getByWordPack(packId),
    enabled: !!packId,
  });
}

/**
 * Hook to fetch user's vocabulary progress
 */
export function useVocabularyProgress(vocabularyId: string) {
  return useQuery({
    queryKey: ["vocabulary", "progress", vocabularyId],
    queryFn: () => vocabularyApi.getUserProgress(vocabularyId),
    enabled: !!vocabularyId,
  });
}

/**
 * Hook to fetch all user's vocabulary progress
 */
export function useAllVocabularyProgress() {
  return useQuery({
    queryKey: ["vocabulary", "progress", "all"],
    queryFn: () => vocabularyApi.getAllUserProgress(),
  });
}

/**
 * Hook to update vocabulary progress
 */
export function useUpdateVocabularyProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      vocabularyId,
      data,
    }: {
      vocabularyId: string;
      data: {
        isCorrect: boolean;
        reviewType: "flashcard" | "quiz" | "audio";
        timeSpent: number;
      };
    }) => vocabularyApi.updateProgress(vocabularyId, data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch progress queries
      queryClient.invalidateQueries({ queryKey: ["vocabulary", "progress"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["user", "stats"] });
    },
  });
}
