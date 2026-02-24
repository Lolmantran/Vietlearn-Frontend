"use client";

import { useState, FormEvent } from "react";
import { Send, Lightbulb } from "lucide-react";
import { Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FeedbackPanel } from "./FeedbackPanel";
import { sentencesApi } from "@/lib/api/sentencesApi";
import type { SentenceCheckResult } from "@/types";

// Mock sentences for practice when backend unavailable
const PRACTICE_SENTENCES = [
  { english: "I want to eat pho.", reference: "Tôi muốn ăn phở." },
  { english: "Where is the bathroom?", reference: "Phòng vệ sinh ở đâu?" },
  { english: "How much does this cost?", reference: "Cái này bao nhiêu tiền?" },
  { english: "I don't understand.", reference: "Tôi không hiểu." },
  { english: "Thank you very much.", reference: "Cảm ơn bạn rất nhiều." },
];

export function TranslationPractice() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState<SentenceCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const current = PRACTICE_SENTENCES[currentIdx];

  const handleCheck = async (e: FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    setIsLoading(true);
    setResult(null);
    try {
      const res = await sentencesApi.checkSentence({
        targetLanguage: "vi",
        userSentence: userInput.trim(),
        referenceSentence: current.reference,
      });
      setResult(res);
    } catch {
      // Mock result
      const isCorrect = userInput.trim().toLowerCase() === current.reference.toLowerCase();
      setResult({
        isCorrect,
        score: isCorrect ? 100 : 60,
        corrections: isCorrect
          ? []
          : [
              {
                original: userInput.trim(),
                corrected: current.reference,
                type: "grammar",
                explanation: "Check word order and tone marks",
                position: { start: 0, end: userInput.length },
              },
            ],
        explanation: isCorrect
          ? "Perfect! Your sentence is exactly right."
          : "Good try! There are some differences from the reference sentence.",
        naturalAlternatives: isCorrect ? [] : [current.reference],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    setCurrentIdx((i) => (i + 1) % PRACTICE_SENTENCES.length);
    setUserInput("");
    setResult(null);
    setShowHint(false);
  };

  return (
    <div className="max-w-2xl">
      <div className="rounded-2xl bg-linear-to-br from-teal-600 to-teal-700 p-6 text-white mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-200 mb-2">
          Translate into Vietnamese
        </p>
        <p className="text-2xl font-bold">{current.english}</p>
        <button
          onClick={() => setShowHint((h) => !h)}
          className="mt-3 flex items-center gap-1.5 text-sm text-teal-200 hover:text-white transition-colors"
        >
          <Lightbulb size={14} />
          {showHint ? "Hide hint" : "Show hint"}
        </button>
        {showHint && (
          <p className="mt-2 text-teal-100 text-sm font-medium border-t border-white/20 pt-2">
            Hint: {current.reference}
          </p>
        )}
      </div>

      <form onSubmit={handleCheck} className="space-y-3">
        <Textarea
          label="Your Vietnamese translation"
          placeholder="Type your Vietnamese answer here…"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          rows={3}
        />
        <div className="flex gap-3">
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={!userInput.trim()}
            leftIcon={<Send size={16} />}
          >
            Check
          </Button>
          {result && (
            <Button variant="outline" onClick={handleNext}>
              Next sentence →
            </Button>
          )}
        </div>
      </form>

      {result && (
        <FeedbackPanel result={result} userSentence={userInput} reference={current.reference} />
      )}
    </div>
  );
}
