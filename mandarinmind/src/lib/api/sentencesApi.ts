import { apiClient } from "./client";
import type {
  SentenceCheckPayload,
  SentenceCheckResult,
  PatternDrillPayload,
  PatternDrillTask,
} from "@/types";

function normalizeSentenceCheckResult(raw: Record<string, unknown>): SentenceCheckResult {
  return {
    isCorrect: (raw.isCorrect ?? raw.is_correct ?? false) as boolean,
    score: (raw.score ?? 0) as number,
    explanation: (raw.explanation ?? raw.feedback ?? "") as string,
    corrections: (Array.isArray(raw.corrections) ? raw.corrections : []) as SentenceCheckResult["corrections"],
    naturalAlternatives: (Array.isArray(raw.naturalAlternatives)
      ? raw.naturalAlternatives
      : Array.isArray(raw.alternatives)
      ? raw.alternatives
      : []) as string[],
  };
}

interface BackendDrillTask {
  type: "shuffle" | "cloze" | "translate";
  prompt: string;
  answer: string;
  hint?: string;
}

function normalizePatternDrillTasks(raw: BackendDrillTask[]): PatternDrillTask[] {
  return raw.map((item, i) => {
    const base = {
      id: `task-${i}`,
      referenceSentence: item.answer,
      explanation: item.hint ?? "",
    };

    if (item.type === "shuffle") {
      return {
        ...base,
        type: "reorder" as const,
        instruction: "Reorder the words to form a correct Vietnamese sentence",
        words: item.prompt.replace(/[.!?]$/, "").split(" "),
      };
    }

    if (item.type === "cloze") {
      // Backend uses _____ (5 underscores), component splits on ___
      const sentence = item.prompt.replace(/_+/g, "___");
      return {
        ...base,
        type: "fill_blank" as const,
        instruction: "Fill in the blank",
        sentence,
        blank: { position: 0, hint: item.hint ?? "…" },
      };
    }

    // translate
    return {
      ...base,
      type: "translate" as const,
      instruction: item.prompt,
    };
  });
}

export const sentencesApi = {
  checkSentence: async (payload: SentenceCheckPayload): Promise<SentenceCheckResult> => {
    const raw = await apiClient.post<Record<string, unknown>>("/sentences/check", payload);
    return normalizeSentenceCheckResult(raw);
  },

  getPatternDrill: async (payload: PatternDrillPayload): Promise<PatternDrillTask[]> => {
    const raw = await apiClient.post<BackendDrillTask[]>("/sentences/pattern-drill", payload);
    return normalizePatternDrillTasks(Array.isArray(raw) ? raw : []);
  },
};
