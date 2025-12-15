"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/lib/api";
import { useUserStore } from "@/store/userStore";

/**
 * Hook to fetch user profile
 */
export function useUserProfile() {
  const setUser = useUserStore((state) => state.setUser);

  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: async () => {
      const user = await userApi.getProfile();
      setUser(user);
      return user;
    },
  });
}

/**
 * Hook to update user profile
 */
export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  const setUser = useUserStore((state) => state.setUser);

  return useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: (data) => {
      setUser(data);
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
    },
  });
}

/**
 * Hook to fetch user statistics
 */
export function useUserStats() {
  const setStats = useUserStore((state) => state.setStats);

  return useQuery({
    queryKey: ["user", "stats"],
    queryFn: async () => {
      const stats = await userApi.getStats();
      setStats(stats);
      return stats;
    },
  });
}

/**
 * Hook to fetch user streak
 */
export function useUserStreak() {
  const setStreak = useUserStore((state) => state.setStreak);

  return useQuery({
    queryKey: ["user", "streak"],
    queryFn: async () => {
      const streak = await userApi.getStreak();
      setStreak(streak);
      return streak;
    },
  });
}

/**
 * Hook to fetch achievements
 */
export function useAchievements() {
  return useQuery({
    queryKey: ["achievements"],
    queryFn: () => userApi.getAchievements(),
  });
}

/**
 * Hook to fetch user's unlocked achievements
 */
export function useUserAchievements() {
  return useQuery({
    queryKey: ["user", "achievements"],
    queryFn: () => userApi.getUserAchievements(),
  });
}

/**
 * Hook to update daily activity
 */
export function useUpdateDailyActivity() {
  const queryClient = useQueryClient();
  const setStreak = useUserStore((state) => state.setStreak);

  return useMutation({
    mutationFn: () => userApi.updateDailyActivity(),
    onSuccess: (data) => {
      setStreak(data);
      queryClient.invalidateQueries({ queryKey: ["user", "streak"] });
    },
  });
}
