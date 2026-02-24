"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { CheckCircle2, BookOpen, ArrowRight, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/Progress";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { vocabApi } from "@/lib/api/vocabApi";
import { cn } from "@/lib/utils/cn";
import { PosBadge } from "./PosBadge";
import type { VocabCard, SRSRating } from "@/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Build 4 shuffled choices: 1 correct + 3 distractors from nearest neighbours. */
function buildChoices(queue: VocabCard[], index: number): string[] {
  const correct = queue[index].english;
  const distractors: string[] = [];

  for (let offset = 1; distractors.length < 3 && offset < queue.length; offset++) {
    for (const idx of [index + offset, index - offset]) {
      if (distractors.length >= 3) break;
      const card = queue[idx];
      if (card && card.english !== correct && !distractors.includes(card.english)) {
        distractors.push(card.english);
      }
    }
  }

  return shuffle([correct, ...distractors.slice(0, 3)]);
}

// ─── Choice button ────────────────────────────────────────────────────────────

type ChoiceState = "idle" | "correct" | "wrong" | "reveal";

interface ChoiceButtonProps {
  label: string;
  state: ChoiceState;
  disabled: boolean;
  onClick: () => void;
}

function ChoiceButton({ label, state, disabled, onClick }: ChoiceButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "w-full rounded-2xl border-2 px-5 py-3.5 text-left text-sm font-medium transition-all duration-150",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500",
        state === "idle" && !disabled &&
          "border-slate-200 bg-white text-slate-700 hover:border-teal-400 hover:bg-teal-50",
        state === "idle" && disabled &&
          "border-slate-200 bg-white text-slate-400 cursor-not-allowed",
        state === "correct" && "border-emerald-500 bg-emerald-50 text-emerald-800",
        state === "wrong"   && "border-red-400 bg-red-50 text-red-700",
        state === "reveal"  && "border-emerald-400 bg-emerald-50 text-emerald-700",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span>{label}</span>
        {state === "correct" && <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />}
        {state === "wrong"   && <XCircle      size={18} className="shrink-0 text-red-500" />}
        {state === "reveal"  && <CheckCircle2 size={18} className="shrink-0 text-emerald-500" />}
      </div>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ReviewSession() {
  const [queue, setQueue]               = useState<VocabCard[]>([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [choices, setChoices]           = useState<string[]>([]);
  const [selected, setSelected]         = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalXP, setTotalXP]           = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);

  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load on mount
  useEffect(() => {
    vocabApi
      .getReviewQueue()
      .then((cards) => setQueue(shuffle(cards)))
      .catch((e: Error) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, []);

  // Rebuild choices when card changes
  useEffect(() => {
    if (queue.length > 0 && currentIndex < queue.length) {
      setChoices(buildChoices(queue, currentIndex));
      setSelected(null);
      if (autoAdvanceTimer.current) {
        clearTimeout(autoAdvanceTimer.current);
        autoAdvanceTimer.current = null;
      }
    }
  }, [queue, currentIndex]);

  // Cleanup on unmount
  useEffect(() => () => {
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
  }, []);

  const advance = useCallback(() => {
    setCurrentIndex((i) => {
      const next = i + 1;
      if (next >= queue.length) { setSessionComplete(true); return i; }
      return next;
    });
  }, [queue.length]);

  const handleSelect = useCallback(async (choice: string) => {
    if (!queue[currentIndex] || selected !== null || isSubmitting) return;
    const card = queue[currentIndex];
    const isCorrect = choice === card.english;

    setSelected(choice);
    if (isCorrect) setCorrectCount((c) => c + 1);

    const rating: SRSRating = isCorrect ? "Good" : "Again";
    setIsSubmitting(true);
    try {
      const res = await vocabApi.submitReview({ cardId: card.id, rating });
      setTotalXP((xp) => xp + (res.xpEarned ?? 0));
    } catch { /* non-fatal */ } finally {
      setIsSubmitting(false);
    }

    autoAdvanceTimer.current = setTimeout(advance, 1500);
  }, [queue, currentIndex, selected, isSubmitting, advance]);

  const handleNext = useCallback(() => {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
    advance();
  }, [advance]);

  // ── States ────────────────────────────────────────────────────────────────
  if (isLoading) return <Spinner label="Loading your review queue…" />;

  if (error) return (
    <div className="text-center py-12 text-red-500">
      <p>Failed to load review queue: {error}</p>
    </div>
  );

  if (queue.length === 0) return (
    <div className="text-center py-12">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-100 mb-4">
        <BookOpen className="text-teal-600" size={30} />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">No reviews due!</h3>
      <p className="text-slate-500 mb-6">Come back later or browse a deck to learn new words.</p>
      <Link href="/learn/vocab"><Button variant="outline">Browse decks</Button></Link>
    </div>
  );

  if (sessionComplete) return (
    <div className="text-center py-12 max-w-sm mx-auto">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 mb-4">
        <CheckCircle2 className="text-emerald-600" size={30} />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-1">Session complete! 🎉</h3>
      <p className="text-slate-500 mb-6 text-sm">Great work keeping up your streak.</p>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: "Reviewed",  value: queue.length },
          { label: "Correct",   value: `${correctCount} / ${queue.length}` },
          { label: "XP earned", value: `+${totalXP} ⭐` },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-3">
            <p className="text-lg font-bold text-slate-800">{s.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 justify-center">
        <Link href="/dashboard"><Button variant="outline">Dashboard</Button></Link>
        <Link href="/tutor">
          <Button rightIcon={<ArrowRight size={14} />}>Practice with tutor</Button>
        </Link>
      </div>
    </div>
  );

  // ── Active card ───────────────────────────────────────────────────────────
  const currentCard  = queue[currentIndex];
  const correctAnswer = currentCard.english;

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs font-semibold text-slate-500 shrink-0">
          Card {currentIndex + 1} / {queue.length}
        </span>
        <Progress value={currentIndex} max={queue.length} size="sm" color="teal" className="flex-1" />
        <span className="text-xs text-slate-400 shrink-0">
          {queue.length - currentIndex - 1} left
        </span>
      </div>

      {/* Vietnamese word */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center mb-6 shadow-sm">
        <p className="text-4xl sm:text-5xl font-bold text-slate-800 mb-2 tracking-wide">
          {currentCard.vietnamese}
        </p>
        <PosBadge pos={currentCard.partOfSpeech} className="mb-2" />
        {currentCard.pronunciation && (
          <p className="text-sm text-slate-400">{currentCard.pronunciation}</p>
        )}
      </div>

      {/* Feedback banner */}
      {selected !== null && (
        <div className={cn(
          "mb-4 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium border",
          selected === correctAnswer
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-red-50 text-red-700 border-red-200",
        )}>
          {selected === correctAnswer ? (
            <><CheckCircle2 size={16} /> Correct!</>
          ) : (
            <><XCircle size={16} /> The correct answer is &ldquo;{correctAnswer}&rdquo;</>
          )}
        </div>
      )}

      {/* 4 answer choices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {choices.map((choice) => {
          let state: ChoiceState = "idle";
          if (selected !== null) {
            if (choice === correctAnswer) {
              state = selected === correctAnswer ? "correct" : "reveal";
            } else if (choice === selected) {
              state = "wrong";
            }
          }
          return (
            <ChoiceButton
              key={choice}
              label={choice}
              state={state}
              disabled={selected !== null}
              onClick={() => handleSelect(choice)}
            />
          );
        })}
      </div>

      {/* Next / Finish button */}
      {selected !== null && (
        <div className="mt-6 flex justify-end">
          <Button
            size="sm"
            onClick={handleNext}
            rightIcon={<ArrowRight size={14} />}
            disabled={isSubmitting}
          >
            {currentIndex + 1 >= queue.length ? "Finish" : "Next →"}
          </Button>
        </div>
      )}
    </div>
  );
}
