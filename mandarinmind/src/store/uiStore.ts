import { create } from "zustand";

interface UIState {
  // Sidebar
  isSidebarOpen: boolean;
  
  // Modals
  isAchievementModalOpen: boolean;
  currentAchievement: string | null;
  
  // Theme
  theme: "light" | "dark";
  
  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  openAchievementModal: (achievementId: string) => void;
  closeAchievementModal: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isSidebarOpen: true,
  isAchievementModalOpen: false,
  currentAchievement: null,
  theme: "light",

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  
  openAchievementModal: (achievementId) =>
    set({ isAchievementModalOpen: true, currentAchievement: achievementId }),
  
  closeAchievementModal: () =>
    set({ isAchievementModalOpen: false, currentAchievement: null }),
  
  setTheme: (theme) => set({ theme }),
}));
