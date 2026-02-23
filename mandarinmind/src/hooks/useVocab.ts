"use client";

import { useState, useEffect, useCallback } from "react";
import { vocabApi } from "@/lib/api/vocabApi";
import type { VocabCard, Deck, DeckType, SRSRating } from "@/types";

export function useReviewQueue() {
  const [cards, setCards] = useState<VocabCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    vocabApi
      .getReviewQueue()
      .then(setCards)
      .catch((e: Error) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, []);

  const submitRating = useCallback(
    async (cardId: string, rating: SRSRating) => {
      await vocabApi.submitReview({ cardId, rating });
      const nextIndex = currentIndex + 1;
      if (nextIndex >= cards.length) {
        setSessionComplete(true);
      } else {
        setCurrentIndex(nextIndex);
      }
    },
    [currentIndex, cards.length]
  );

  return {
    cards,
    currentCard: cards[currentIndex] ?? null,
    currentIndex,
    totalCards: cards.length,
    isLoading,
    error,
    sessionComplete,
    submitRating,
  };
}

export function useDecks() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    vocabApi
      .getDecks()
      .then(setDecks)
      .catch((e: Error) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, []);

  return { decks, isLoading, error };
}

export function useDeckCards(deckType: DeckType, deckId?: string) {
  const [cards, setCards] = useState<VocabCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setIsLoading(true);
    setError(null);
    vocabApi
      .getDeck(deckType, deckId)
      .then(setCards)
      .catch((e: Error) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, [deckType, deckId]);

  useEffect(() => {
    load();
  }, [load]);

  return { cards, isLoading, error, reload: load };
}
