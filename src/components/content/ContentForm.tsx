"use client";

import { useState, FormEvent } from "react";
import { Sparkles, FileText, Tag } from "lucide-react";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import type { VietnameseLevel } from "@/types";

const TOPIC_SUGGESTIONS = [
  { label: "Street food", emoji: "🍜" },
  { label: "Motorbikes", emoji: "🛵" },
  { label: "Family", emoji: "👨‍👩‍👧" },
  { label: "Markets", emoji: "🏪" },
  { label: "Festivals", emoji: "🎉" },
  { label: "Coffee culture", emoji: "☕" },
  { label: "Travel", emoji: "✈️" },
  { label: "Sports", emoji: "⚽" },
];

const LEVELS: VietnameseLevel[] = ["beginner", "elementary", "intermediate", "upper_intermediate", "advanced"];

interface ContentFormProps {
  isLoading: boolean;
  onSubmit: (payload: { type: "text" | "topic"; content: string; level: VietnameseLevel }) => void;
}

export function ContentForm({ isLoading, onSubmit }: ContentFormProps) {
  const [pastedText, setPastedText] = useState("");
  const [topicInput, setTopicInput] = useState("");
  const [level, setLevel] = useState<VietnameseLevel>("beginner");

  const handleTextSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!pastedText.trim()) return;
    onSubmit({ type: "text", content: pastedText.trim(), level });
  };

  const handleTopicSubmit = (topic: string) => {
    onSubmit({ type: "topic", content: topic, level });
  };

  return (
    <div className="max-w-2xl">
      {/* Level selector */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-slate-700 mb-2">My level</p>
        <div className="flex flex-wrap gap-2">
          {LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition-all border-2 ${
                level === l
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-teal-300"
              }`}
            >
              {l.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <Tabs
        tabs={[
          { id: "topic", label: "Choose topic", icon: <Tag size={14} /> },
          { id: "text", label: "Paste text", icon: <FileText size={14} /> },
        ]}
        variant="pills"
      >
        {(active) => (
          <>
            {active === "topic" && (
              <div className="pt-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {TOPIC_SUGGESTIONS.map((t) => (
                    <button
                      key={t.label}
                      disabled={isLoading}
                      onClick={() => handleTopicSubmit(t.label)}
                      className="rounded-2xl border-2 border-slate-200 bg-white p-4 text-center hover:border-teal-400 hover:shadow-sm transition-all disabled:opacity-50"
                    >
                      <span className="text-2xl">{t.emoji}</span>
                      <p className="mt-2 text-xs font-medium text-slate-700">{t.label}</p>
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    placeholder="Or type your own topic…"
                    className="flex-1 rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                  />
                  <Button
                    disabled={!topicInput.trim()}
                    isLoading={isLoading}
                    onClick={() => handleTopicSubmit(topicInput)}
                    leftIcon={<Sparkles size={16} />}
                  >
                    Generate
                  </Button>
                </div>
              </div>
            )}
            {active === "text" && (
              <form onSubmit={handleTextSubmit} className="pt-4 space-y-4">
                <Textarea
                  label="Paste English or Vietnamese text"
                  placeholder="Paste any text you want to learn from — a news article, song lyrics, recipe, anything…"
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  hint="The AI will extract vocabulary and create a custom lesson from your text"
                  rows={6}
                />
                <Button
                  type="submit"
                  isLoading={isLoading}
                  disabled={!pastedText.trim()}
                  leftIcon={<Sparkles size={16} />}
                >
                  Generate lesson
                </Button>
              </form>
            )}
          </>
        )}
      </Tabs>
    </div>
  );
}
