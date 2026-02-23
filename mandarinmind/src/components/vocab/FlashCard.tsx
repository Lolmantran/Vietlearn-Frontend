"use client";

import { useState, useEffect, useCallback } from "react";
import { Volume2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { VocabCard } from "@/types";
import { Badge } from "@/components/ui/Badge";

interface FlashCardProps {
  card: VocabCard;
  onFlip?: (isFlipped: boolean) => void;
}

export function FlashCard({ card, onFlip }: FlashCardProps) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(false);
  }, [card.id]);

  const handleFlip = useCallback(() => {
    setFlipped((f) => {
      const next = !f;
      onFlip?.(next);
      return next;
    });
  }, [onFlip]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleFlip();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleFlip]);

  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (card.audioUrl) {
      const audio = new Audio(card.audioUrl);
      audio.play().catch(() => {});
    }
  };

  return (
    <div className="perspective cursor-pointer w-full max-w-lg mx-auto" onClick={handleFlip}>
      <div
        className={cn(
          "preserve-3d relative w-full transition-transform duration-500",
          flipped && "rotate-y-180"
        )}
        style={{ height: "300px" }}
      >
        {/* Front */}
        <div className="backface-hidden absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-white border-2 border-slate-200 shadow-lg p-8">
          <Badge variant="teal" className="mb-4">{card.partOfSpeech}</Badge>
          <h2 className="text-4xl font-black text-slate-900 text-center">{card.english}</h2>
          <p className="mt-4 text-sm text-slate-400">Tap or press Space to reveal Vietnamese</p>
          <div className="absolute top-4 right-4 flex items-center gap-1 text-slate-300 text-xs">
            <RotateCcw size={12} />
            flip
          </div>
        </div>

        {/* Back */}
        <div className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-teal-600 to-teal-700 shadow-lg p-8 text-white">
          <h2 className="text-4xl font-black text-center mb-1">{card.vietnamese}</h2>
          <p className="text-teal-200 text-lg font-medium">{card.toneMarks}</p>
          <p className="text-teal-100/80 text-sm mt-1">[{card.pronunciation}]</p>

          {(card.exampleEnglish || card.exampleVietnamese) && (
            <div className="mt-5 w-full rounded-xl bg-white/10 border border-white/20 p-4 text-center">
              <p className="text-sm text-white font-medium">{card.exampleVietnamese}</p>
              <p className="text-xs text-teal-200 mt-1">{card.exampleEnglish}</p>
            </div>
          )}

          {card.audioUrl && (
            <button
              onClick={playAudio}
              className="mt-4 flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/20 transition-colors"
            >
              <Volume2 size={16} />
              Play pronunciation
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
