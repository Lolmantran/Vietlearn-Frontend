"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewApi } from "@/lib/api";

/**
 * Hook to fetch due reviews
 */
export function useDueReviews() {
  return useQuery({
    queryKey: ["reviews", "due"],
    queryFn: () => reviewApi.getDueReviews(),
    // Refetch every 5 minutes to keep queue updated
    refetchInterval: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch review history
 */
export function useReviewHistory(params?: {
  page?: number;
  pageSize?: number;
  vocabularyId?: string;
}) {
  return useQuery({
    queryKey: ["reviews", "history", params],
    queryFn: () => reviewApi.getHistory(params),
  });
}

/**
 * Hook to fetch failed words
 */
export function useFailedWords() {
  return useQuery({
    queryKey: ["reviews", "failed"],
    queryFn: () => reviewApi.getFailedWords(),
  });
}

/**
 * Hook to fetch review statistics
 */
export function useReviewStats(timeRange: "week" | "month" | "year") {
  return useQuery({
    queryKey: ["reviews", "stats", timeRange],
    queryFn: () => reviewApi.getStats(timeRange),
  });
}
