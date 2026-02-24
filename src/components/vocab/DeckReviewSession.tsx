"use client";

import { useState, useCallback } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { FlashCard } from "./FlashCard";
import { RatingButtons } from "./RatingButtons";
import { Progress } from "@/components/ui/Progress";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useDeckCards } from "@/hooks/useVocab";
import { vocabApi } from "@/lib/api/vocabApi";
import type { Deck, SRSRating } from "@/types";

interface DeckReviewSessionProps {
  deck: Deck;
  onBack: () => void;
}

export function DeckReviewSession({ deck, onBack }: DeckReviewSessionProps) {
  const { cards, isLoading, error } = useDeckCards(deck.id);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [totalReviewed, setTotalReviewed] = useState(0);

  const currentCard = cards[currentIndex] ?? null;

  const handleRate = useCallback(
    async (rating: SRSRating) => {
      if (!currentCard) return;
      setIsSubmitting(true);
      try {
        await vocabApi.submitReview({ cardId: currentCard.id, rating });
      } catch {
        // Continue even if submit fails
      } finally {
        setIsSubmitting(false);
      }
      setIsFlipped(false);
      setTotalReviewed((n) => n + 1);
      if (currentIndex + 1 >= cards.length) {
        setSessionComplete(true);
      } else {
        setCurrentIndex((i) => i + 1);
      }
    },
    [currentCard, currentIndex, cards.length]
  );

  // ── Loading / error states ────────────────────────────────────────────────

  if (isLoading) return <Spinner label={`Loading ${deck.name}…`} />;

  if (error) return (
    <div className="text-center py-12">
      <p className="text-red-500 mb-4">Failed to load deck: {error}</p>
      <Button variant="outline" onClick={onBack}>← Back to decks</Button>
    </div>
  );

  if (cards.length === 0) return (
    <div className="text-center py-12">
      <p className="text-slate-500 mb-4">No cards found in this deck.</p>
      <Button variant="outline" onClick={onBack}>← Back to decks</Button>
    </div>
  );

  // ── Session complete ──────────────────────────────────────────────────────

  if (sessionComplete) return (
    <div className="text-center py-12">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 mb-4">
        <CheckCircle2 className="text-emerald-600" size={30} />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">
        {deck.coverEmoji} {deck.name} complete!
      </h3>
      <p className="text-slate-500 mb-6">
        You reviewed {totalReviewed} card{totalReviewed !== 1 ? "s" : ""}. Great work!
      </p>
      <div className="flex gap-3 justify-center">
        <Button variant="outline" onClick={onBack}>Browse decks</Button>
        <Button onClick={() => { setCurrentIndex(0); setSessionComplete(false); setTotalReviewed(0); }}>
          Study again
        </Button>
      </div>
    </div>
  );

  // ── Card view ─────────────────────────────────────────────────────────────

  return (
    <div className="max-w-2xl mx-auto">
      {/* Deck header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={16} />
          Decks
        </button>
        <span className="text-slate-200">/</span>
        <span className="text-sm font-semibold text-slate-700">
          {deck.coverEmoji} {deck.name}
        </span>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-medium text-slate-500">
          {currentIndex + 1} / {cards.length}
        </span>
        <Progress value={currentIndex} max={cards.length} className="flex-1 mx-4" />
        <span className="text-sm text-slate-400">{cards.length - currentIndex - 1} remaining</span>
      </div>

      <FlashCard card={currentCard!} onFlip={setIsFlipped} />

      {/* Rating buttons — visible only when flipped */}
      <div
        className={`mt-8 transition-all duration-300 ${
          isFlipped ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <p className="text-center text-sm text-slate-400 mb-4">How well did you know this?</p>
        <RatingButtons onRate={handleRate} isLoading={isSubmitting} />
      </div>

      {!isFlipped && (
        <p className="text-center text-sm text-slate-400 mt-6">
          Tap the card or press{" "}
          <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">Space</kbd> to reveal
        </p>
      )}
    </div>
  );
}
