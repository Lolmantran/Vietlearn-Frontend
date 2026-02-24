"use client";

import { cn } from "@/lib/utils/cn";
import type { TutorMode } from "@/types";

const MODES: { id: TutorMode; label: string; description: string }[] = [
  { id: "explain_everything", label: "Explain everything", description: "Deep explanations for every word and grammatical structure" },
  { id: "correct_me_a_lot", label: "Correct me a lot", description: "Interrupt and correct every mistake, strict teacher mode" },
  { id: "just_chat", label: "Just chat", description: "Casual conversation with minimal corrections" },
];

interface ModeSelectorProps {
  value: TutorMode;
  onChange: (m: TutorMode) => void;
}

export function ModeSelector({ value, onChange }: ModeSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      {MODES.map((m) => (
        <button
          key={m.id}
          onClick={() => onChange(m.id)}
          className={cn(
            "text-left rounded-xl border-2 px-4 py-3 transition-all",
            value === m.id
              ? "border-teal-500 bg-teal-50"
              : "border-slate-200 bg-white hover:border-teal-300"
          )}
        >
          <p className={cn("text-sm font-semibold", value === m.id ? "text-teal-700" : "text-slate-700")}>
            {m.label}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">{m.description}</p>
        </button>
      ))}
    </div>
  );
}
