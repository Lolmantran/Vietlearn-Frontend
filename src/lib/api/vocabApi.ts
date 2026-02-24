import { apiClient } from "./client";
import type {
  VocabCard,
  Deck,
  DeckType,
  DeckProgress,
  ReviewPayload,
  ReviewResponse,
  EnrollResponse,
  CustomDeckPayload,
  VietnameseLevel,
} from "@/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DECK_EMOJI: Record<string, string> = {
  CORE: "📚", core: "📚",
  TRAVEL: "✈️", travel: "✈️",
  FOOD: "🍜", food: "🍜",
  BUSINESS: "💼", business: "💼",
  CUSTOM: "⭐", custom: "⭐",
};

const DECK_LEVEL: Record<string, VietnameseLevel> = {
  CORE: "beginner", core: "beginner",
  TRAVEL: "beginner", travel: "beginner",
  FOOD: "elementary", food: "elementary",
  BUSINESS: "intermediate", business: "intermediate",
  CUSTOM: "beginner", custom: "beginner",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeDeck(raw: any): Deck {
  const deckType = (raw?.deckType ?? raw?.type ?? "custom") as string;
  const typeKey = deckType.toLowerCase() as DeckType;
  const total = raw?.totalCards ?? raw?.cardCount ?? 0;
  const enrolled = raw?.enrolledCount ?? raw?.learnedCount ?? 0;
  return {
    id: raw?.id ?? "",
    name: raw?.name ?? "Deck",
    description: raw?.description ?? "",
    type: typeKey,
    cardCount: total,
    learnedCount: enrolled,
    totalCards: total,
    enrolledCount: enrolled,
    coverEmoji: raw?.coverEmoji ?? DECK_EMOJI[deckType] ?? "📖",
    level: raw?.level ?? DECK_LEVEL[deckType] ?? "beginner",
    isOwned: raw?.isOwned ?? false,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeCard(raw: any): VocabCard {
  return {
    id: raw?.id ?? raw?.flashcardId ?? "",
    // Backend uses word/meaning; frontend uses vietnamese/english
    vietnamese: raw?.vietnamese ?? raw?.word ?? "",
    english: raw?.english ?? raw?.meaning ?? "",
    pronunciation: raw?.pronunciation ?? "",
    toneMarks: raw?.toneMarks ?? raw?.word ?? "",
    partOfSpeech: raw?.partOfSpeech ?? raw?.pos ?? "",
    exampleVietnamese: raw?.exampleVietnamese ?? raw?.exampleSentence ?? "",
    exampleEnglish: raw?.exampleEnglish ?? "",
    audioUrl: raw?.audioUrl ?? undefined,
    level: raw?.level ?? "beginner",
    tags: Array.isArray(raw?.tags) ? raw.tags : [],
    imageUrl: raw?.imageUrl ?? undefined,
    srsLevel: raw?.srsLevel ?? 0,
    nextReviewAt: raw?.nextReviewAt ?? raw?.next_review_at ?? undefined,
    dueToday: raw?.dueToday ?? raw?.due_today ?? false,
  };
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const vocabApi = {
  // GET /vocab/decks
  getDecks: async (): Promise<Deck[]> => {
    const raw = await apiClient.get<unknown[]>("/vocab/decks");
    return (Array.isArray(raw) ? raw : []).map(normalizeDeck);
  },

  // GET /vocab/deck/:id?page=1&limit=50
  getDeck: async (deckId: string): Promise<{ deck: Deck; cards: VocabCard[] }> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await apiClient.get<any>(`/vocab/deck/${deckId}`, { page: 1, limit: 50 });
    const cards: VocabCard[] = (Array.isArray(raw?.flashcards) ? raw.flashcards : []).map(normalizeCard);
    return { deck: normalizeDeck(raw), cards };
  },

  // GET /vocab/review-queue
  getReviewQueue: async (): Promise<VocabCard[]> => {
    const raw = await apiClient.get<unknown[]>("/vocab/review-queue");
    return (Array.isArray(raw) ? raw : []).map(normalizeCard);
  },

  // POST /vocab/deck/:id/enroll
  enrollDeck: async (deckId: string): Promise<EnrollResponse> => {
    const raw = await apiClient.post<EnrollResponse>(`/vocab/deck/${deckId}/enroll`, {});
    return {
      deckId: raw?.deckId ?? deckId,
      enrolled: raw?.enrolled ?? 0,
      alreadyEnrolled: raw?.alreadyEnrolled ?? 0,
      total: raw?.total ?? 0,
    };
  },

  // GET /vocab/progress — per-deck progress for the current user
  getDeckProgress: async (): Promise<DeckProgress[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await apiClient.get<any[]>("/vocab/progress");
    const arr = Array.isArray(raw) ? raw : [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return arr.map((d: any): DeckProgress => ({
      id: d?.id ?? "",
      name: d?.name ?? "Deck",
      description: d?.description ?? null,
      icon: d?.icon ?? DECK_EMOJI[(d?.deckType ?? "").toLowerCase()] ?? "📖",
      cardCount: d?.cardCount ?? 0,
      enrolledCount: d?.enrolledCount ?? 0,
      masteredCount: d?.masteredCount ?? 0,
      progress: d?.progress ?? 0,
      lastStudiedAt: d?.lastStudiedAt ?? new Date().toISOString(),
    }));
  },

  // POST /vocab/review — backend expects { flashcardId, rating (lowercase) }
  submitReview: async (payload: ReviewPayload): Promise<ReviewResponse> => {
    const raw = await apiClient.post<ReviewResponse>("/vocab/review", {
      flashcardId: payload.cardId,
      rating: payload.rating.toLowerCase(), // "Again" → "again"
    });
    return {
      cardId: (raw as ReviewResponse & { cardId?: string })?.cardId ?? payload.cardId,
      nextReviewAt: raw?.nextReviewAt ?? new Date().toISOString(),
      newSrsLevel: raw?.newSrsLevel,
      interval: raw?.interval,
      xpEarned: raw?.xpEarned ?? 0,
    };
  },

  // GET /vocab/word/:encodedWord
  getWord: async (word: string): Promise<VocabCard> => {
    const raw = await apiClient.get<unknown>(`/vocab/word/${encodeURIComponent(word)}`);
    return normalizeCard(raw);
  },

  // POST /vocab/generate-custom-deck
  generateCustomDeck: async (payload: CustomDeckPayload): Promise<Deck> => {
    const raw = await apiClient.post<unknown>("/vocab/generate-custom-deck", payload);
    return normalizeDeck(raw);
  },
};

