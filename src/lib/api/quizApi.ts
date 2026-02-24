import { apiClient } from "./client";
import type { DailyQuiz, QuizQuestion, QuizSubmitPayload, QuizResult } from "@/types";

interface BackendOption {
  id: string;
  text: string;
}

interface BackendQuestion {
  id: string;
  type: string;
  prompt: string;
  options?: BackendOption[];
  audioUrl?: string;
}

interface BackendDailyQuiz {
  quizId: string;
  questions: BackendQuestion[];
}

function normalizeDailyQuiz(raw: BackendDailyQuiz): DailyQuiz {
  const questions: QuizQuestion[] = (raw.questions ?? []).map((q) => ({
    id: q.id,
    type: q.type as QuizQuestion["type"],
    prompt: q.prompt,
    audioUrl: q.audioUrl,
    options: (q.options ?? []).map((o) => o.text),
    optionIds: (q.options ?? []).map((o) => o.id),
    correctAnswer: "",
    explanation: "",
  }));

  return {
    id: raw.quizId,
    questions,
    totalPoints: questions.length * 10,
    estimatedMinutes: Math.ceil(questions.length * 0.5),
  };
}

export const quizApi = {
  getDailyQuiz: async (): Promise<DailyQuiz> => {
    const raw = await apiClient.get<BackendDailyQuiz>("/quiz/daily");
    return normalizeDailyQuiz(raw);
  },

  submitQuiz: async (payload: QuizSubmitPayload): Promise<QuizResult> => {
    const raw = await apiClient.post<Record<string, unknown>>("/quiz/submit", payload);
    const feedback = Array.isArray(raw.feedback)
      ? raw.feedback
      : Array.isArray(raw.detailedFeedback)
      ? raw.detailedFeedback
      : Array.isArray(raw.answers)
      ? raw.answers
      : [];
    const totalPoints = (raw.totalPoints ?? raw.total ?? payload.answers.length * 10) as number;
    const score = (raw.score ?? feedback.filter((f: Record<string, unknown>) => f.isCorrect).length) as number;
    const percentage = (raw.percentage ?? raw.percent ?? Math.round((score / Math.max(payload.answers.length, 1)) * 100)) as number;
    return {
      score,
      totalPoints,
      percentage,
      xpEarned: (raw.xpEarned ?? raw.xp ?? score * 10) as number,
      feedback: feedback.map((f: Record<string, unknown>) => ({
        questionId: (f.questionId ?? f.id ?? "") as string,
        isCorrect: (f.isCorrect ?? false) as boolean,
        userAnswer: (f.selectedOptionId ?? f.userAnswer ?? f.answer ?? "") as string,
        correctAnswer: (f.correctOptionId ?? f.correctAnswer ?? f.correct ?? "") as string,
        explanation: (f.explanation ?? "") as string,
      })),
      timeSpentSeconds: (raw.timeSpentSeconds ?? 0) as number,
    };
  },
};
