import { create } from "zustand";
import { FlashcardSession } from "@/types/quiz";
import { Vocabulary } from "@/types/vocabulary";

interface LearningState {
  // Flashcard session
  flashcardSession: FlashcardSession | null;
  
  // Current vocabulary being studied
  currentVocabulary: Vocabulary | null;
  
  // Review queue
  reviewQueue: string[]; // vocabulary IDs
  
  // Today's completed reviews
  completedReviewsToday: number;
  
  // Actions
  startFlashcardSession: (session: FlashcardSession) => void;
  endFlashcardSession: () => void;
  setCurrentVocabulary: (vocabulary: Vocabulary | null) => void;
  setReviewQueue: (vocabularyIds: string[]) => void;
  incrementCompletedReviews: () => void;
  resetDailyProgress: () => void;
}

export const useLearningStore = create<LearningState>()((set) => ({
  flashcardSession: null,
  currentVocabulary: null,
  reviewQueue: [],
  completedReviewsToday: 0,

  startFlashcardSession: (session) => set({ flashcardSession: session }),
  
  endFlashcardSession: () => set({ flashcardSession: null, currentVocabulary: null }),
  
  setCurrentVocabulary: (vocabulary) => set({ currentVocabulary: vocabulary }),
  
  setReviewQueue: (vocabularyIds) => set({ reviewQueue: vocabularyIds }),
  
  incrementCompletedReviews: () =>
    set((state) => ({ completedReviewsToday: state.completedReviewsToday + 1 })),
  
  resetDailyProgress: () => set({ completedReviewsToday: 0 }),
}));
