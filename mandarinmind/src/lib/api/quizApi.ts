import { apiClient } from "./client";
import type { DailyQuiz, QuizSubmitPayload, QuizResult } from "@/types";

export const quizApi = {
  getDailyQuiz: (): Promise<DailyQuiz> => apiClient.get<DailyQuiz>("/quiz/daily"),

  submitQuiz: (payload: QuizSubmitPayload): Promise<QuizResult> =>
    apiClient.post<QuizResult>("/quiz/submit", payload),
};
