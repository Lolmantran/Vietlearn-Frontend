"use client";

import { cn } from "@/lib/utils/cn";
import type { QuizQuestion } from "@/types";

interface MultipleChoiceProps {
  question: QuizQuestion;
  selected: string | null;
  revealed: boolean;
  onSelect: (choice: string) => void;
}

export function MultipleChoice({ question, selected, revealed, onSelect }: MultipleChoiceProps) {
  const choices = question.options ?? [];

  return (
    <div>
      <p className="text-base font-medium text-slate-700 mb-4">{question.prompt}</p>
      {question.audioUrl && (
        <audio controls src={question.audioUrl} className="mb-4 w-full rounded-xl" />
      )}
      <div className="space-y-3">
        {choices.map((c) => {
          const isSelected = selected === c;
          const isCorrect = revealed && c === question.correctAnswer;
          const isWrong = revealed && isSelected && c !== question.correctAnswer;

          return (
            <button
              key={c}
              disabled={revealed}
              onClick={() => onSelect(c)}
              className={cn(
                "w-full text-left rounded-2xl border-2 px-4 py-3 text-sm font-medium transition-all",
                !revealed && "hover:border-teal-400 hover:bg-teal-50",
                !revealed && !isSelected && "border-slate-200 bg-white text-slate-700",
                !revealed && isSelected && "border-teal-500 bg-teal-50 text-teal-700",
                isCorrect && "border-emerald-500 bg-emerald-50 text-emerald-700",
                isWrong && "border-red-400 bg-red-50 text-red-700",
                revealed && !isCorrect && !isWrong && "border-slate-200 bg-white text-slate-400"
              )}
            >
              <span className="flex items-center gap-2">
                {revealed && isCorrect && <span>✓</span>}
                {revealed && isWrong && <span>✗</span>}
                {c}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
