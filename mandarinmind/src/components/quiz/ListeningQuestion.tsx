"use client";

import { useState } from "react";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { QuizQuestion } from "@/types";

interface ListeningQuestionProps {
  question: QuizQuestion;
  onSubmit: (answer: string) => void;
  revealed: boolean;
  submitted: string | null;
}

export function ListeningQuestion({ question, onSubmit, revealed, submitted }: ListeningQuestionProps) {
  const [input, setInput] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const audioUrl = question.audioUrl ?? null;
  const isCorrect = revealed && submitted?.trim().toLowerCase() === question.correctAnswer?.toLowerCase();
  const isWrong = revealed && !isCorrect;

  const playAudio = () => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audio.play();
    setIsPlaying(true);
    audio.onended = () => setIsPlaying(false);
  };

  return (
    <div>
      <p className="text-sm text-slate-500 mb-4">{question.prompt}</p>

      {/* Audio play button */}
      <button
        onClick={playAudio}
        className="flex items-center gap-3 rounded-2xl border-2 border-teal-200 bg-teal-50 px-6 py-4 hover:bg-teal-100 transition-colors mb-6"
      >
        <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center">
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-teal-800">Play audio</p>
          <p className="text-xs text-teal-500">Click to hear the Vietnamese sentence</p>
        </div>
      </button>

      <div className="space-y-3">
        <input
          type="text"
          value={revealed ? (submitted ?? "") : input}
          onChange={(e) => setInput(e.target.value)}
          disabled={revealed}
          placeholder="Type what you hear…"
          className={cn(
            "w-full rounded-xl border-2 px-4 py-3 text-sm focus:outline-none transition-colors",
            !revealed && "border-slate-300 focus:border-teal-500",
            isCorrect && "border-emerald-400 bg-emerald-50",
            isWrong && "border-red-400 bg-red-50"
          )}
        />

        {revealed ? (
          <div
            className={cn(
              "rounded-xl px-4 py-2.5 text-sm font-medium border",
              isCorrect ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"
            )}
          >
            {isCorrect ? "✓ Correct!" : `✗ Answer: ${question.correctAnswer}`}
          </div>
        ) : (
          <button
            disabled={!input.trim()}
            onClick={() => onSubmit(input.trim())}
            className="rounded-xl bg-teal-600 text-white px-4 py-2 text-sm font-medium hover:bg-teal-700 disabled:opacity-40 transition-colors"
          >
            Check
          </button>
        )}
      </div>
    </div>
  );
}
