import { apiClient } from "./client";
import type { ContentGeneratePayload, GeneratedLesson, VietnameseLevel } from "@/types";

// Raw shape returned by the backend
interface BackendVocabItem {
  word: string;
  pronunciation: string;
  meaning: string;
}
interface BackendExercise {
  type: "translate" | "cloze" | "shuffle";
  prompt: string;
  answer: string;
}
interface BackendLessonResponse {
  id: string;
  vocab: BackendVocabItem[];
  examples: string[];
  exercises: BackendExercise[];
}

function transformLesson(raw: BackendLessonResponse, payload: ContentGeneratePayload): GeneratedLesson {
  const topic = payload.topic ?? payload.text ?? "Lesson";

  const vocabulary = (raw.vocab ?? []).map((v, i) => ({
    vietnamese: v.word,
    pronunciation: v.pronunciation,
    english: v.meaning,
    exampleSentence: raw.examples?.[i] ?? "",
  }));

  const practiceTasks = (raw.exercises ?? []).map((e) => ({
    type: (e.type === "cloze" ? "fill_blank" : "translate") as "translate" | "fill_blank" | "multiple_choice",
    prompt: e.prompt,
    answer: e.answer,
  }));

  return {
    id: raw.id,
    title: `${topic} — Vietnamese Lesson`,
    topic,
    level: (payload.level ?? "beginner") as VietnameseLevel,
    vocabulary,
    dialogue: [],
    practiceTasks,
  };
}

export const contentApi = {
  generateLesson: async (payload: ContentGeneratePayload): Promise<GeneratedLesson> => {
    const raw = await apiClient.post<BackendLessonResponse>("/content/generate", payload);
    return transformLesson(raw, payload);
  },
};
