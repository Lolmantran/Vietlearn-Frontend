"use client";

import { useState, useEffect } from "react";
import { RefreshCw, Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils/cn";
import { sentencesApi } from "@/lib/api/sentencesApi";
import type { PatternDrillTask } from "@/types";

const TOPIC_OPTIONS = [
  { id: "greetings", label: "Greetings", emoji: "👋" },
  { id: "food", label: "Food", emoji: "🍜" },
  { id: "travel", label: "Travel", emoji: "✈️" },
  { id: "shopping", label: "Shopping", emoji: "🛒" },
  { id: "family", label: "Family", emoji: "👨‍👩‍👧" },
  { id: "work", label: "Work", emoji: "💼" },
];

// Mock tasks for demo
const MOCK_TASKS: PatternDrillTask[] = [
  {
    id: "t1",
    type: "reorder",
    instruction: "Reorder the words to form a correct Vietnamese sentence",
    words: ["Tôi", "muốn", "ăn", "phở"],
    referenceSentence: "Tôi muốn ăn phở.",
    explanation: "'Tôi' = I, 'muốn' = want, 'ăn' = eat, 'phở' = pho",
  },
  {
    id: "t2",
    type: "fill_blank",
    instruction: "Fill in the blank",
    sentence: "Xin ___, bạn có thể giúp tôi không?",
    blank: { position: 1, hint: "Please / excuse me" },
    referenceSentence: "Xin lỗi, bạn có thể giúp tôi không?",
    explanation: "'Xin lỗi' = Excuse me / Sorry",
  },
];

function ReorderTask({ task, onResult }: { task: PatternDrillTask; onResult: (correct: boolean) => void }) {
  const [order, setOrder] = useState<string[]>(() =>
    [...(task.words ?? [])].sort(() => Math.random() - 0.5)
  );
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState<boolean | null>(null);

  const toggleWord = (word: string, fromSelected: boolean) => {
    if (checked !== null) return;
    if (fromSelected) {
      setSelected((s) => s.filter((w) => w !== word));
      setOrder((o) => [...o, word]);
    } else {
      setOrder((o) => o.filter((w) => w !== word));
      setSelected((s) => [...s, word]);
    }
  };

  const checkAnswer = () => {
    const answer = selected.join(" ") + ".";
    const correct = answer === task.referenceSentence;
    setChecked(correct);
    onResult(correct);
  };

  return (
    <div>
      <p className="text-sm font-medium text-slate-600 mb-4">{task.instruction}</p>
      {/* Selected words */}
      <div className="min-h-12 rounded-xl border-2 border-dashed border-teal-300 bg-teal-50 p-3 flex flex-wrap gap-2 mb-4">
        {selected.length === 0 && <span className="text-sm text-slate-400">Tap words below to build the sentence</span>}
        {selected.map((w, i) => (
          <button
            key={`${w}-${i}`}
            onClick={() => toggleWord(w, true)}
            className="rounded-lg bg-teal-600 text-white px-3 py-1.5 text-sm font-medium hover:bg-teal-700 transition-colors"
          >
            {w}
          </button>
        ))}
      </div>
      {/* Word bank */}
      <div className="flex flex-wrap gap-2 mb-4">
        {order.map((w, i) => (
          <button
            key={`${w}-${i}`}
            onClick={() => toggleWord(w, false)}
            className="rounded-lg border-2 border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-teal-400 hover:text-teal-700 transition-all"
          >
            {w}
          </button>
        ))}
      </div>

      {checked === null ? (
        <Button size="sm" onClick={checkAnswer} disabled={selected.length === 0}>Check</Button>
      ) : (
        <div className={cn("flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium",
          checked ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
        )}>
          {checked ? <Check size={16} /> : <X size={16} />}
          {checked ? "Correct!" : `Correct: ${task.referenceSentence}`}
          <span className="ml-2 text-slate-500">— {task.explanation}</span>
        </div>
      )}
    </div>
  );
}

function FillBlankTask({ task, onResult }: { task: PatternDrillTask; onResult: (correct: boolean) => void }) {
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState<boolean | null>(null);
  const parts = task.sentence?.split("___") ?? [];

  const checkAnswer = () => {
    const correct = task.referenceSentence.toLowerCase().includes(answer.trim().toLowerCase());
    setChecked(correct);
    onResult(correct);
  };

  return (
    <div>
      <p className="text-sm font-medium text-slate-600 mb-4">{task.instruction}</p>
      <div className="flex items-center gap-2 flex-wrap text-lg font-medium text-slate-800 mb-4">
        <span>{parts[0]}</span>
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={checked !== null}
          placeholder={task.blank?.hint ?? "…"}
          className="rounded-lg border-2 border-teal-300 px-3 py-1 text-base w-36 focus:outline-none focus:border-teal-500"
        />
        <span>{parts[1]}</span>
      </div>

      {checked === null ? (
        <Button size="sm" onClick={checkAnswer} disabled={!answer.trim()}>Check</Button>
      ) : (
        <div className={cn("flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium",
          checked ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
        )}>
          {checked ? <Check size={16} /> : <X size={16} />}
          {checked ? "Correct!" : `Answer: ${task.referenceSentence}`}
          <span className="ml-2 text-slate-500">— {task.explanation}</span>
        </div>
      )}
    </div>
  );
}

export function PatternDrill() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [tasks, setTasks] = useState<PatternDrillTask[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const loadDrill = async (topic: string) => {
    setSelectedTopic(topic);
    setIsLoading(true);
    setCurrentIdx(0);
    setScore({ correct: 0, total: 0 });
    try {
      const res = await sentencesApi.getPatternDrill({ topic });
      setTasks(res);
    } catch {
      setTasks(MOCK_TASKS);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResult = (correct: boolean) => {
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
  };

  const handleNext = () => {
    setCurrentIdx((i) => i + 1);
  };

  if (!selectedTopic) {
    return (
      <div>
        <h3 className="text-base font-semibold text-slate-700 mb-4">Choose a topic</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TOPIC_OPTIONS.map((t) => (
            <button
              key={t.id}
              onClick={() => loadDrill(t.id)}
              className="rounded-2xl border-2 border-slate-200 bg-white p-4 text-center hover:border-teal-400 hover:shadow-sm transition-all"
            >
              <span className="text-2xl">{t.emoji}</span>
              <p className="mt-2 text-sm font-medium text-slate-700">{t.label}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (isLoading) return <Spinner label="Generating exercises…" />;

  if (currentIdx >= tasks.length && tasks.length > 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">🎉</div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Drill complete!</h3>
        <p className="text-slate-500 mb-6">
          You got {score.correct}/{score.total} correct ({Math.round((score.correct / score.total) * 100)}%)
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => { setSelectedTopic(null); setTasks([]); }}>
            Choose topic
          </Button>
          <Button onClick={() => loadDrill(selectedTopic)} leftIcon={<RefreshCw size={16} />}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const current = tasks[currentIdx];

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" onClick={() => { setSelectedTopic(null); setTasks([]); }}>
          ← Topics
        </Button>
        <span className="text-sm text-slate-500">
          {currentIdx + 1} / {tasks.length}
        </span>
      </div>

      {current && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          {current.type === "reorder" && (
            <ReorderTask task={current} onResult={handleResult} />
          )}
          {current.type === "fill_blank" && (
            <FillBlankTask task={current} onResult={handleResult} />
          )}
          <div className="mt-6 flex justify-end">
            <Button size="sm" variant="ghost" onClick={handleNext}>
              {currentIdx === tasks.length - 1 ? "See results →" : "Next →"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
