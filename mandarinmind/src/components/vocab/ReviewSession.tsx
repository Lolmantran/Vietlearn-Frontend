"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, BookOpen } from "lucide-react";
import { FlashCard } from "./FlashCard";
import { RatingButtons } from "./RatingButtons";
import { Progress } from "@/components/ui/Progress";
import { Button } from "@/components/ui/Button";
import { useReviewQueue } from "@/hooks/useVocab";
import { Spinner } from "@/components/ui/Spinner";

export function ReviewSession() {
  const {
    currentCard,
    currentIndex,
    totalCards,
    isLoading,
    error,
    sessionComplete,
    submitRating,
  } = useReviewQueue();

  const [isFlipped, setIsFlipped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) return <Spinner label="Loading your review queue…" />;
  if (error) return (
    <div className="text-center py-12 text-red-500">
      <p>Failed to load review queue: {error}</p>
    </div>
  );
  if (totalCards === 0) return (
    <div className="text-center py-12">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-100 mb-4">
        <BookOpen className="text-teal-600" size={30} />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">No reviews due!</h3>
      <p className="text-slate-500 mb-6">Come back later or browse a deck to learn new words.</p>
      <Link href="/learn/vocab"><Button variant="outline">Browse decks</Button></Link>
    </div>
  );

  if (sessionComplete || !currentCard) return (
    <div className="text-center py-12">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 mb-4">
        <CheckCircle2 className="text-emerald-600" size={30} />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">Session complete! 🎉</h3>
      <p className="text-slate-500 mb-6">
        You reviewed {totalCards} cards. Great work!
      </p>
      <div className="flex gap-3 justify-center">
        <Link href="/dashboard"><Button variant="outline">Dashboard</Button></Link>
        <Link href="/tutor"><Button>Practice with AI tutor</Button></Link>
      </div>
    </div>
  );

  const handleRate = async (rating: import("@/types").SRSRating) => {
    setIsSubmitting(true);
    await submitRating(currentCard.id, rating);
    setIsFlipped(false);
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-medium text-slate-500">
          {currentIndex + 1} / {totalCards}
        </span>
        <Progress value={currentIndex} max={totalCards} className="flex-1 mx-4" />
        <span className="text-sm text-slate-400">{totalCards - currentIndex - 1} remaining</span>
      </div>

      <FlashCard card={currentCard} onFlip={setIsFlipped} />

      {/* Rating buttons — only show when flipped */}
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
          Tap the card or press <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">Space</kbd> to reveal
        </p>
      )}
    </div>
  );
}
