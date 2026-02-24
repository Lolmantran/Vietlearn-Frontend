"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MultipleChoice } from "@/components/quiz/MultipleChoice";
import { ClozeQuestion } from "@/components/quiz/ClozeQuestion";
import { ListeningQuestion } from "@/components/quiz/ListeningQuestion";
import { QuizResults } from "@/components/quiz/QuizResults";
import { Progress } from "@/components/ui/Progress";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { useQuiz } from "@/hooks/useQuiz";
import type { DailyQuiz, QuizResult } from "@/types";
import { ArrowRight } from "lucide-react";

// Mock quiz for display when API unavailable
const MOCK_QUIZ: DailyQuiz = {
  id: "mock-daily",
  totalPoints: 200,
  estimatedMinutes: 5,
  questions: [
    {
      id: "q1",
      type: "multiple_choice",
      prompt: "What does 'Xin chào' mean?",
      options: ["Goodbye", "Hello", "Thank you", "Sorry"],
      correctAnswer: "Hello",
      explanation: "'Xin chào' is the standard Vietnamese greeting meaning Hello.",
    },
    {
      id: "q2",
      type: "cloze",
      prompt: "Complete: Tôi ___ phở. (I eat pho)",
      options: [],
      correctAnswer: "ăn",
      explanation: "'ăn' means 'to eat' in Vietnamese.",
    },
    {
      id: "q3",
      type: "multiple_choice",
      prompt: "Which word means 'beautiful'?",
      options: ["đẹp", "xấu", "to", "nhỏ"],
      correctAnswer: "đẹp",
      explanation: "'đẹp' means beautiful. 'xấu' = ugly, 'to' = big, 'nhỏ' = small.",
    },
    {
      id: "q4",
      type: "multiple_choice",
      prompt: "How do you say 'I love you' in Vietnamese?",
      options: ["Tôi ghét bạn", "Tôi yêu bạn", "Cảm ơn bạn", "Xin lỗi bạn"],
      correctAnswer: "Tôi yêu bạn",
      explanation: "'Tôi yêu bạn' = I love you. Literally: I (tôi) love (yêu) you (bạn).",
    },
    {
      id: "q5",
      type: "cloze",
      prompt: "Complete: ___ ơi! (Hey [name]!)",
      options: [],
      correctAnswer: "Bạn",
      explanation: "In Vietnamese, '[name] ơi' is used to call someone.",
    },
  ],
};

export default function QuizPage() {
  const { quiz: apiQuiz, isLoading, error: quizError, result: apiResult, currentIndex, answers, answerQuestion, goToNext, submit, isSubmitting } = useQuiz();

  // Use API quiz or mock fallback
  const quiz = apiQuiz ?? MOCK_QUIZ;

  // Local revealed state for each question
  const [revealedIdx, setRevealedIdx] = useState<Set<number>>(new Set());
  const [localAnswers, setLocalAnswers] = useState<string[]>(Array(MOCK_QUIZ.questions.length).fill(""));
  const [mockResult, setMockResult] = useState<QuizResult | null>(null);
  const [mockIdx, setMockIdx] = useState(0);

  const isUsingMock = !apiQuiz;
  const idx = isUsingMock ? mockIdx : currentIndex;
  const total = quiz.questions.length;
  const result = isUsingMock ? mockResult : apiResult;
  const current = quiz.questions[idx];
  // For the real API path, read selected answer from the hook's answers array
  const currentSelectedAnswer = isUsingMock
    ? (localAnswers[idx] || null)
    : (answers[idx]?.userAnswer || null);

  const handleAnswer = (answer: string) => {
    if (isUsingMock) {
      const next = [...localAnswers];
      next[idx] = answer;
      setLocalAnswers(next);
      setRevealedIdx((s) => new Set([...s, idx]));
    } else {
      answerQuestion(current.id, answer);
      setRevealedIdx((s) => new Set([...s, idx]));
    }
  };

  const handleNext = () => {
    if (isUsingMock) {
      setMockIdx((i) => i + 1);
    } else {
      goToNext();
    }
    // Don't carry revealed state to next question
  };

  const handleSubmit = async () => {
    if (isUsingMock) {
      const correct = localAnswers.filter((a, i) => a === quiz.questions[i].correctAnswer).length;
      setMockResult({
        score: correct,
        totalPoints: quiz.totalPoints,
        percentage: Math.round((correct / total) * 100),
        xpEarned: correct * 10,
        feedback: quiz.questions.map((q, i) => ({
          questionId: q.id,
          isCorrect: localAnswers[i] === q.correctAnswer,
          userAnswer: localAnswers[i],
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
        })),
        timeSpentSeconds: 0,
      });
    } else {
      try {
        await submit();
      } catch {
        // error is stored in quizError state from the hook
      }
    }
  };

  const handleRetake = () => {
    setMockResult(null);
    setMockIdx(0);
    setLocalAnswers(Array(quiz.questions.length).fill(""));
    setRevealedIdx(new Set());
  };

  if (isLoading) return (
    <AppLayout title="Daily Quiz">
      <Spinner label="Loading today's quiz…" />
    </AppLayout>
  );

  if (result) {
    return (
      <AppLayout title="Quiz Results">
        <QuizResults result={result} onRetake={handleRetake} />
      </AppLayout>
    );
  }

  const isRevealed = revealedIdx.has(idx);
  const isLast = idx === total - 1;

  return (
    <AppLayout title="Daily Quiz">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Daily Quiz</p>
          <h1 className="text-xl font-bold text-slate-800">Question {idx + 1} / {total}</h1>
        </div>
        <p className="text-sm font-semibold text-teal-600">{quiz.totalPoints} pts total</p>
      </div>
      <Progress value={((idx + 1) / total) * 100} color="teal" size="sm" className="mb-8" />

      {/* Question card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 max-w-2xl mb-6">
        {current.type === "multiple_choice" && (
          <MultipleChoice
            question={current}
            selected={currentSelectedAnswer}
            revealed={isRevealed}
            onSelect={(a) => handleAnswer(a)}
          />
        )}
        {current.type === "cloze" && (
          <ClozeQuestion
            question={current}
            onSubmit={(a) => handleAnswer(a)}
            revealed={isRevealed}
            submitted={currentSelectedAnswer}
          />
        )}
        {current.type === "listening" && (
          <ListeningQuestion
            question={current}
            onSubmit={(a) => handleAnswer(a)}
            revealed={isRevealed}
            submitted={currentSelectedAnswer}
          />
        )}
      </div>

      {/* Navigation */}
      {isRevealed && (
        <div className="space-y-3">
          {quizError && !isUsingMock && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-600">
              {quizError} — please try again.
            </div>
          )}
          <div className="flex gap-3">
            {isLast ? (
              <Button onClick={handleSubmit} isLoading={isSubmitting}>
                Finish quiz →
              </Button>
            ) : (
              <Button onClick={handleNext} rightIcon={<ArrowRight size={16} />}>
                Next question
              </Button>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
