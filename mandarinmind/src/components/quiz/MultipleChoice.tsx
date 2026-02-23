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
  const optionIds = question.optionIds ?? [];

  return (
    <div>
      <p className="text-base font-medium text-slate-700 mb-4">{question.prompt}</p>
      {question.audioUrl && (
        <audio controls src={question.audioUrl} className="mb-4 w-full rounded-xl" />
      )}
      <div className="space-y-3">
        {choices.map((c, i) => {
          // Use the option ID for selection/comparison if available, otherwise fall back to text
          const optionValue = optionIds[i] ?? c;
          const isSelected = selected === optionValue;
          const hasCorrectAnswer = !!question.correctAnswer;
          const isCorrect = revealed && hasCorrectAnswer && optionValue === question.correctAnswer;
          const isWrong = revealed && hasCorrectAnswer && isSelected && optionValue !== question.correctAnswer;
          const isSelectedRevealed = revealed && !hasCorrectAnswer && isSelected;

          return (
            <button
              key={optionValue}
              disabled={revealed}
              onClick={() => onSelect(optionValue)}
              className={cn(
                "w-full text-left rounded-2xl border-2 px-4 py-3 text-sm font-medium transition-all",
                !revealed && "hover:border-teal-400 hover:bg-teal-50",
                !revealed && !isSelected && "border-slate-200 bg-white text-slate-700",
                !revealed && isSelected && "border-teal-500 bg-teal-50 text-teal-700",
                isSelectedRevealed && "border-teal-500 bg-teal-50 text-teal-700",
                isCorrect && "border-emerald-500 bg-emerald-50 text-emerald-700",
                isWrong && "border-red-400 bg-red-50 text-red-700",
                revealed && !isCorrect && !isWrong && !isSelectedRevealed && "border-slate-200 bg-white text-slate-400"
              )}
            >
              <span className="flex items-center gap-2">
                {isCorrect && <span>✓</span>}
                {isWrong && <span>✗</span>}
                {c}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
