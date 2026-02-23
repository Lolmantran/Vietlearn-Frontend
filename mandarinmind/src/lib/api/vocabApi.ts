import { apiClient } from "./client";
import type {
  VocabCard,
  Deck,
  DeckType,
  ReviewPayload,
  ReviewResponse,
  CustomDeckPayload,
} from "@/types";

export const vocabApi = {
  getDeck: (deckType: DeckType, deckId?: string): Promise<VocabCard[]> =>
    apiClient.get<VocabCard[]>("/vocab/deck", {
      deckType,
      ...(deckId ? { deckId } : {}),
    }),

  getDecks: (): Promise<Deck[]> => apiClient.get<Deck[]>("/vocab/decks"),

  getReviewQueue: (): Promise<VocabCard[]> => apiClient.get<VocabCard[]>("/vocab/review-queue"),

  submitReview: (payload: ReviewPayload): Promise<ReviewResponse> =>
    apiClient.post<ReviewResponse>("/vocab/review", payload),

  generateCustomDeck: (payload: CustomDeckPayload): Promise<Deck> =>
    apiClient.post<Deck>("/vocab/generate-custom-deck", payload),
};
