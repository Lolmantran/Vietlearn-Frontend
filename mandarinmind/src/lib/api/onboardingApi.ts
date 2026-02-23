import { apiClient } from "./client";
import type {
  PlacementAnswer,
  PlacementTestResult,
  OnboardingGoalsPayload,
  PlacementQuestion,
} from "@/types";

export const onboardingApi = {
  getPlacementQuestions: (): Promise<PlacementQuestion[]> =>
    apiClient.get<PlacementQuestion[]>("/onboarding/placement-test/questions"),

  submitPlacementTest: (answers: PlacementAnswer[]): Promise<PlacementTestResult> =>
    apiClient.post<PlacementTestResult>("/onboarding/placement-test/submit", { answers }),

  saveGoals: (payload: OnboardingGoalsPayload): Promise<void> =>
    apiClient.post<void>("/onboarding/goals", payload),
};
