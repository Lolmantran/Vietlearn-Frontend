"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { cn } from "@/lib/utils/cn";
import type { QuizResult } from "@/types";

interface QuizResultsProps {
  result: QuizResult;
  onRetake: () => void;
}

export function QuizResults({ result, onRetake }: QuizResultsProps) {
  const pct = result.percentage;
  const grade = pct >= 90 ? "Excellent!" : pct >= 70 ? "Good job!" : pct >= 50 ? "Keep practicing" : "Need more review";
  const gradeColor = pct >= 90 ? "text-emerald-600" : pct >= 70 ? "text-teal-600" : pct >= 50 ? "text-amber-600" : "text-red-600";

  return (
    <div className="max-w-xl mx-auto py-6">
      {/* Score summary */}
      <div className="text-center mb-8">
        <div className={cn("text-6xl font-black mb-2", gradeColor)}>{pct}%</div>
        <p className={cn("text-xl font-semibold mb-1", gradeColor)}>{grade}</p>
        <p className="text-slate-500 text-sm">
          {result.feedback.filter((f) => f.isCorrect).length} / {result.feedback.length} correct · {result.xpEarned} XP earned
        </p>
        <Progress value={pct} color={pct >= 70 ? "teal" : pct >= 50 ? "amber" : "rose"} className="mt-4" />
      </div>

      {/* Feedback per question */}
      {result.feedback.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden mb-6">
          <div className="px-4 py-3 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700">Question review</h3>
          </div>
          <ul className="divide-y divide-slate-100">
            {result.feedback.map((fb, i) => (
              <li key={i} className="px-4 py-3 flex items-start gap-3">
                <span className={cn("shrink-0 text-lg mt-0.5 font-bold", fb.isCorrect ? "text-emerald-500" : "text-red-500")}>
                  {fb.isCorrect ? "✓" : "✗"}
                </span>
                <div className="text-sm">
                  <p className="font-medium text-slate-700">Q{i + 1}</p>
                  {!fb.isCorrect && (
                    <>
                      <p className="text-red-600 text-xs">Your answer: {fb.userAnswer}</p>
                      <p className="text-emerald-600 text-xs">Correct: {fb.correctAnswer}</p>
                    </>
                  )}
                  {fb.explanation && <p className="text-slate-500 text-xs mt-1">{fb.explanation}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-center flex-wrap">
        <Button variant="outline" onClick={onRetake} leftIcon={<RotateCcw size={16} />}>
          Retake
        </Button>
      </div>
    </div>
  );
}
