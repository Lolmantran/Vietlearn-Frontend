import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, UserStats, Streak } from "@/types/user";

interface UserState {
  user: User | null;
  stats: UserStats | null;
  streak: Streak | null;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: User) => void;
  setStats: (stats: UserStats) => void;
  setStreak: (streak: Streak) => void;
  updateXP: (xpGained: number) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      stats: null,
      streak: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: true }),
      
      setStats: (stats) => set({ stats }),
      
      setStreak: (streak) => set({ streak }),
      
      updateXP: (xpGained) =>
        set((state) => {
          if (!state.user || !state.stats) return state;

          const newXP = state.user.xp + xpGained;
          const newTotalXP = state.stats.totalXP + xpGained;

          return {
            user: { ...state.user, xp: newXP },
            stats: { ...state.stats, totalXP: newTotalXP },
          };
        }),
      
      logout: () => set({ user: null, stats: null, streak: null, isAuthenticated: false }),
    }),
    {
      name: "user-storage",
    }
  )
);
