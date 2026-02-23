"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { onboardingApi } from "@/lib/api/onboardingApi";
import { formatLevel } from "@/lib/utils/format";
import type { LearningGoal, VietnameseLevel, PlacementTestResult } from "@/types";
import { cn } from "@/lib/utils/cn";

// ─── Mock placement questions (replaced by API when available) ────────────────
const PLACEMENT_QUESTIONS = [
  {
    id: "q1",
    text: "What does 'Xin chào' mean?",
    options: [
      { id: "a", text: "Goodbye" },
      { id: "b", text: "Hello" },
      { id: "c", text: "Thank you" },
      { id: "d", text: "Please" },
    ],
  },
  {
    id: "q2",
    text: "How do you say 'thank you' in Vietnamese?",
    options: [
      { id: "a", text: "Xin lỗi" },
      { id: "b", text: "Không" },
      { id: "c", text: "Cảm ơn" },
      { id: "d", text: "Vâng" },
    ],
  },
  {
    id: "q3",
    text: "Which sentence means 'I am learning Vietnamese'?",
    options: [
      { id: "a", text: "Tôi ăn cơm" },
      { id: "b", text: "Tôi học tiếng Việt" },
      { id: "c", text: "Tôi đi học" },
      { id: "d", text: "Tôi không biết" },
    ],
  },
  {
    id: "q4",
    text: "What does 'ăn' mean?",
    options: [
      { id: "a", text: "Drink" },
      { id: "b", text: "Sleep" },
      { id: "c", text: "Eat" },
      { id: "d", text: "Go" },
    ],
  },
];

const GOALS: { id: LearningGoal; emoji: string; label: string; desc: string }[] = [
  { id: "travel", emoji: "✈️", label: "Travel", desc: "Navigate Vietnam with confidence" },
  { id: "daily_conversation", emoji: "💬", label: "Daily Conversation", desc: "Chat with Vietnamese friends" },
  { id: "business", emoji: "💼", label: "Business", desc: "Professional Vietnamese communication" },
  { id: "exam", emoji: "📝", label: "Exam Prep", desc: "VSTEP or other certifications" },
  { id: "culture", emoji: "🎭", label: "Culture & Media", desc: "Enjoy Vietnamese movies and music" },
  { id: "heritage", emoji: "🏡", label: "Heritage Speaker", desc: "Reconnect with your roots" },
];

const DAILY_GOALS = [
  { minutes: 5, label: "5 min", desc: "Casual" },
  { minutes: 10, label: "10 min", desc: "Regular" },
  { minutes: 20, label: "20 min", desc: "Serious" },
  { minutes: 30, label: "30 min", desc: "Intensive" },
];

// ─── Step components ──────────────────────────────────────────────────────────

function GoalsStep({
  selectedGoals,
  toggleGoal,
  dailyGoal,
  setDailyGoal,
}: {
  selectedGoals: LearningGoal[];
  toggleGoal: (g: LearningGoal) => void;
  dailyGoal: number;
  setDailyGoal: (m: number) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">What are your goals?</h2>
      <p className="text-sm text-slate-500 mb-6">Select all that apply — we&apos;ll personalise your path.</p>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {GOALS.map((g) => {
          const active = selectedGoals.includes(g.id);
          return (
            <button
              key={g.id}
              onClick={() => toggleGoal(g.id)}
              className={cn(
                "flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition-all",
                active
                  ? "border-teal-500 bg-teal-50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              )}
            >
              <span className="text-2xl">{g.emoji}</span>
              <div>
                <p className={cn("text-sm font-semibold", active ? "text-teal-700" : "text-slate-700")}>
                  {g.label}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{g.desc}</p>
              </div>
              {active && (
                <div className="ml-auto shrink-0 h-5 w-5 rounded-full bg-teal-500 flex items-center justify-center">
                  <Check size={12} className="text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-sm font-medium text-slate-700 mb-3">Daily study goal</p>
      <div className="grid grid-cols-4 gap-2">
        {DAILY_GOALS.map((dg) => (
          <button
            key={dg.minutes}
            onClick={() => setDailyGoal(dg.minutes)}
            className={cn(
              "rounded-xl border-2 py-3 text-center transition-all",
              dailyGoal === dg.minutes
                ? "border-teal-500 bg-teal-50 text-teal-700"
                : "border-slate-200 text-slate-600 hover:border-slate-300"
            )}
          >
            <p className="text-base font-bold">{dg.label}</p>
            <p className="text-xs text-slate-400">{dg.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function PlacementStep({
  answers,
  onAnswer,
  currentQ,
}: {
  answers: Record<string, string>;
  onAnswer: (qId: string, optId: string) => void;
  currentQ: number;
}) {
  const q = PLACEMENT_QUESTIONS[currentQ];
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Quick placement check</h2>
      <p className="text-sm text-slate-500 mb-6">
        Question {currentQ + 1} of {PLACEMENT_QUESTIONS.length} — skip any you&apos;re unsure about
      </p>
      <Progress value={(currentQ / PLACEMENT_QUESTIONS.length) * 100} className="mb-6" />
      <p className="text-base font-semibold text-slate-800 mb-4">{q.text}</p>
      <div className="space-y-3">
        {q.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onAnswer(q.id, opt.id)}
            className={cn(
              "w-full flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all",
              answers[q.id] === opt.id
                ? "border-teal-500 bg-teal-50 text-teal-700"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            )}
          >
            <span className="h-6 w-6 shrink-0 rounded-full border-2 border-current text-xs flex items-center justify-center uppercase">
              {opt.id}
            </span>
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
}

function ResultStep({
  result,
  isLoading,
}: {
  result: PlacementTestResult | null;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100 mb-4">
          <Sparkles className="text-teal-600 animate-pulse" size={28} />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Analysing your answers…</h2>
        <p className="text-slate-500 text-sm">This takes just a moment</p>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div>
      <div className="text-center mb-8">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-100 mb-4">
          <Sparkles className="text-teal-600" size={30} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-1">You&apos;re all set! 🎉</h2>
        <p className="text-slate-500">Here&apos;s your personalised starting point</p>
      </div>

      <div className="rounded-2xl bg-teal-50 border border-teal-100 p-5 mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-500 mb-1">
          Estimated level
        </p>
        <p className="text-xl font-bold text-teal-800">{formatLevel(result.estimatedLevel)}</p>
        <p className="text-sm text-teal-600 mt-1">{result.suggestedPath}</p>
      </div>

      <div className="rounded-2xl bg-amber-50 border border-amber-100 p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-2">
          Suggested goals
        </p>
        <div className="flex flex-wrap gap-2">
          {result.suggestedGoals.map((g) => {
            const goal = GOALS.find((x) => x.id === g);
            return goal ? (
              <span key={g} className="rounded-full bg-amber-100 text-amber-700 px-3 py-1 text-sm font-medium">
                {goal.emoji} {goal.label}
              </span>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main onboarding page ─────────────────────────────────────────────────────

type Step = "goals" | "placement" | "result";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("goals");
  const [selectedGoals, setSelectedGoals] = useState<LearningGoal[]>([]);
  const [dailyGoal, setDailyGoal] = useState(10);
  const [placementAnswers, setPlacementAnswers] = useState<Record<string, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [testResult, setTestResult] = useState<PlacementTestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<VietnameseLevel>("beginner");

  const toggleGoal = (g: LearningGoal) => {
    setSelectedGoals((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  };

  const handlePlacementAnswer = (qId: string, optId: string) => {
    setPlacementAnswers((prev) => ({ ...prev, [qId]: optId }));
    if (currentQuestion < PLACEMENT_QUESTIONS.length - 1) {
      setCurrentQuestion((c) => c + 1);
    }
  };

  const submitPlacement = async () => {
    setStep("result");
    setIsLoading(true);
    try {
      const answers = Object.entries(placementAnswers).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption,
      }));
      const result = await onboardingApi.submitPlacementTest(answers);
      setTestResult(result);
      setSelectedLevel(result.estimatedLevel);
    } catch {
      // Mock result if backend not available
      setTestResult({
        estimatedLevel: "beginner",
        score: 2,
        suggestedGoals: selectedGoals.length > 0 ? selectedGoals : ["travel", "daily_conversation"],
        suggestedPath: "Start with core vocabulary and basic greetings. Build up to simple conversations over 4 weeks.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = async () => {
    setIsLoading(true);
    try {
      await onboardingApi.saveGoals({
        goals: selectedGoals.length > 0 ? selectedGoals : ["daily_conversation"],
        level: selectedLevel,
        dailyGoalMinutes: dailyGoal,
      });
    } catch {
      // Non-fatal: proceed anyway
    } finally {
      setIsLoading(false);
      router.push("/dashboard");
    }
  };

  const STEP_META: Record<Step, { label: string; index: number }> = {
    goals: { label: "Your goals", index: 0 },
    placement: { label: "Placement", index: 1 },
    result: { label: "Your path", index: 2 },
  };

  const currentMeta = STEP_META[step];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-950 via-teal-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Stepper header */}
        <div className="mb-6 text-center">
          <span className="text-teal-300 text-sm font-medium">
            Step {currentMeta.index + 1} of 3 — {currentMeta.label}
          </span>
          <div className="mt-3 flex gap-2 justify-center">
            {(["goals", "placement", "result"] as Step[]).map((s, i) => (
              <div
                key={s}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  currentMeta.index >= i ? "bg-teal-400 w-10" : "bg-white/20 w-6"
                )}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white shadow-2xl p-8">
          {step === "goals" && (
            <GoalsStep
              selectedGoals={selectedGoals}
              toggleGoal={toggleGoal}
              dailyGoal={dailyGoal}
              setDailyGoal={setDailyGoal}
            />
          )}
          {step === "placement" && (
            <PlacementStep
              answers={placementAnswers}
              onAnswer={handlePlacementAnswer}
              currentQ={currentQuestion}
            />
          )}
          {step === "result" && (
            <ResultStep result={testResult} isLoading={isLoading} />
          )}

          {/* Actions */}
          <div className="mt-8 flex gap-3">
            {step !== "goals" && step !== "result" && (
              <Button
                variant="ghost"
                onClick={() => {
                  if (step === "placement") setStep("goals");
                }}
                leftIcon={<ArrowLeft size={16} />}
              >
                Back
              </Button>
            )}
            <div className="flex-1" />
            {step === "goals" && (
              <Button
                onClick={() => setStep("placement")}
                disabled={selectedGoals.length === 0}
                rightIcon={<ArrowRight size={16} />}
              >
                Continue
              </Button>
            )}
            {step === "placement" && (
              <Button
                onClick={submitPlacement}
                disabled={Object.keys(placementAnswers).length === 0}
                rightIcon={<ArrowRight size={16} />}
              >
                {Object.keys(placementAnswers).length < PLACEMENT_QUESTIONS.length
                  ? `Continue (${Object.keys(placementAnswers).length}/${PLACEMENT_QUESTIONS.length})`
                  : "See my level"}
              </Button>
            )}
            {step === "result" && !isLoading && testResult && (
              <Button onClick={handleFinish} isLoading={isLoading} rightIcon={<ArrowRight size={16} />}>
                Start learning
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
