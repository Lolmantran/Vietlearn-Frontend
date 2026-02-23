import { apiClient } from "./client";
import type {
  SentenceCheckPayload,
  SentenceCheckResult,
  PatternDrillPayload,
  PatternDrillTask,
} from "@/types";

export const sentencesApi = {
  checkSentence: (payload: SentenceCheckPayload): Promise<SentenceCheckResult> =>
    apiClient.post<SentenceCheckResult>("/sentences/check", payload),

  getPatternDrill: (payload: PatternDrillPayload): Promise<PatternDrillTask[]> =>
    apiClient.post<PatternDrillTask[]>("/sentences/pattern-drill", payload),
};
