"use client";

import { useState, useEffect, useCallback } from "react";
import { quizApi } from "@/lib/api/quizApi";
import type { DailyQuiz, QuizAnswer, QuizResult } from "@/types";

export function useQuiz() {
  const [quiz, setQuiz] = useState<DailyQuiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    quizApi
      .getDailyQuiz()
      .then((q) => {
        setQuiz(q);
        setAnswers(q.questions.map((qn) => ({ questionId: qn.id, userAnswer: "" })));
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, []);

  const answerQuestion = useCallback(
    (questionId: string, answer: string) => {
      setAnswers((prev) =>
        prev.map((a) => (a.questionId === questionId ? { ...a, userAnswer: answer } : a))
      );
    },
    []
  );

  const goToNext = useCallback(() => {
    if (!quiz) return;
    setCurrentIndex((i) => Math.min(i + 1, quiz.questions.length - 1));
  }, [quiz]);

  const submit = useCallback(async () => {
    if (!quiz) return;
    setIsSubmitting(true);
    try {
      const res = await quizApi.submitQuiz({ quizId: quiz.id, answers });
      setResult(res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  }, [quiz, answers]);

  return {
    quiz,
    isLoading,
    error,
    currentQuestion: quiz ? quiz.questions[currentIndex] : null,
    currentAnswer: answers[currentIndex]?.userAnswer ?? "",
    currentIndex,
    totalQuestions: quiz?.questions.length ?? 0,
    answers,
    result,
    isSubmitting,
    answerQuestion,
    goToNext,
    submit,
  };
}
