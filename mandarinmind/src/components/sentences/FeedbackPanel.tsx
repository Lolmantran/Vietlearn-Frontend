"use client";

import { cn } from "@/lib/utils/cn";
import type { SentenceCheckResult } from "@/types";

interface FeedbackPanelProps {
  result: SentenceCheckResult;
  userSentence: string;
  reference?: string;
}

export function FeedbackPanel({ result, userSentence, reference }: FeedbackPanelProps) {
  const scoreColor =
    result.score >= 80 ? "text-emerald-600" : result.score >= 50 ? "text-amber-600" : "text-red-600";
  const scoreBg =
    result.score >= 80 ? "bg-emerald-50 border-emerald-100" : result.score >= 50 ? "bg-amber-50 border-amber-100" : "bg-red-50 border-red-100";

  return (
    <div className="space-y-4 mt-6">
      {/* Score */}
      <div className={cn("rounded-2xl border p-4 flex items-center gap-4", scoreBg)}>
        <div className={cn("text-4xl font-black", scoreColor)}>{result.score}%</div>
        <div>
          <p className={cn("font-semibold", scoreColor)}>
            {result.isCorrect ? "Correct! ✓" : result.score >= 80 ? "Almost perfect!" : result.score >= 50 ? "Good attempt" : "Needs work"}
          </p>
          <p className="text-sm text-slate-500">{result.explanation}</p>
        </div>
      </div>

      {/* Your answer vs reference */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Your answer</p>
          <p className="text-sm font-medium text-slate-700">{userSentence}</p>
        </div>
        {reference && (
          <div className="border-t border-slate-100 pt-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Reference</p>
            <p className="text-sm font-medium text-teal-700">{reference}</p>
          </div>
        )}
      </div>

      {/* Corrections */}
      {(result.corrections?.length ?? 0) > 0 && (
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-3">Corrections</p>
          <div className="space-y-3">
            {result.corrections?.map((c, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="shrink-0 rounded-lg bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 capitalize h-fit mt-0.5">
                  {c.type}
                </span>
                <div>
                  <span className="line-through text-red-500 mr-2">{c.original}</span>
                  <span className="text-emerald-600 font-medium mr-2">{c.corrected}</span>
                  <span className="text-slate-500">— {c.explanation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Natural alternatives */}
      {(result.naturalAlternatives?.length ?? 0) > 0 && (
        <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4">
          <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-2">Natural alternatives</p>
          <ul className="space-y-1">
            {result.naturalAlternatives?.map((alt, i) => (
              <li key={i} className="text-sm text-teal-700 font-medium">• {alt}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
