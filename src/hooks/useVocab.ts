"use client";

import { useState, useEffect, useCallback } from "react";
import { vocabApi } from "@/lib/api/vocabApi";
import type { VocabCard, Deck, DeckProgress, SRSRating } from "@/types";

export function useReviewQueue() {
  const [cards, setCards] = useState<VocabCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

export function useDeckProgress() {
  const [progress, setProgress] = useState<DeckProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    vocabApi
      .getDeckProgress()
      .then(setProgress)
      .catch((e: Error) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, []);

  return { progress, isLoading, error };
}

export function useDecks() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setIsLoading(true);
    vocabApi
      .getDecks()
      .then(setDecks)
      .catch((e: Error) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  const enrollDeck = useCallback(
    async (deckId: string) => {
      const result = await vocabApi.enrollDeck(deckId);
      // Update enrolledCount on the matching deck
      setDecks((prev) =>
        prev.map((d) =>
          d.id === deckId
            ? { ...d, learnedCount: result.enrolled, enrolledCount: result.enrolled }
            : d
        )
      );
      return result;
    },
    []
  );

  const addDeck = useCallback((deck: import("@/types").Deck) => {
    setDecks((prev) => [deck, ...prev]);
  }, []);

  const replaceDeck = useCallback((tempId: string, deck: import("@/types").Deck) => {
    setDecks((prev) => prev.map((d) => d.id === tempId ? deck : d));
  }, []);

  const removeDeck = useCallback((id: string) => {
    setDecks((prev) => prev.filter((d) => d.id !== id));
  }, []);

  return { decks, isLoading, error, refresh, enrollDeck, addDeck, replaceDeck, removeDeck };
}

export function useDeckCards(deckId: string | null) {
  const [cards, setCards] = useState<VocabCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!deckId) return;
    setIsLoading(true);
    setError(null);
    vocabApi
      .getDeck(deckId)
      .then(({ cards }) => setCards(cards))
      .catch((e: Error) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, [deckId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  return { cards, isLoading, error, reload: load };
}
