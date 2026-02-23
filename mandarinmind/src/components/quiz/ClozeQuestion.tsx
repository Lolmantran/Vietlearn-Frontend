"use client";

import { FormEvent, useState } from "react";
import { cn } from "@/lib/utils/cn";
import type { QuizQuestion } from "@/types";

interface ClozeQuestionProps {
  question: QuizQuestion;
  onSubmit: (answer: string) => void;
  revealed: boolean;
  submitted: string | null;
}

export function ClozeQuestion({ question, onSubmit, revealed, submitted }: ClozeQuestionProps) {
  const [input, setInput] = useState("");

  // sentence with blank rendered as input slot
  const parts = question.prompt.split("___");
  const isCorrect = revealed && submitted?.trim().toLowerCase() === question.correctAnswer?.toLowerCase();
  const isWrong = revealed && !isCorrect;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSubmit(input.trim());
  };

  return (
    <div>
      <p className="text-sm text-slate-500 mb-3">{question.prompt}</p>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2 flex-wrap text-lg font-medium text-slate-800 mb-4">
          <span>{parts[0]}</span>
          <input
            type="text"
            value={revealed ? (submitted ?? "") : input}
            onChange={(e) => setInput(e.target.value)}
            disabled={revealed}
            placeholder="???"
            className={cn(
              "rounded-xl border-2 px-3 py-1.5 text-base w-36 focus:outline-none transition-colors",
              !revealed && "border-teal-300 focus:border-teal-500",
              isCorrect && "border-emerald-400 bg-emerald-50 text-emerald-700",
              isWrong && "border-red-400 bg-red-50 text-red-700"
            )}
          />
          <span>{parts[1]}</span>
        </div>

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
            type="submit"
            disabled={!input.trim()}
            className="rounded-xl bg-teal-600 text-white px-4 py-2 text-sm font-medium hover:bg-teal-700 disabled:opacity-40 transition-colors"
          >
            Check
          </button>
        )}
      </form>
    </div>
  );
}
