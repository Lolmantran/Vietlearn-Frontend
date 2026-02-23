import { apiClient } from "./client";
import type { ContentGeneratePayload, GeneratedLesson } from "@/types";

export const contentApi = {
  generateLesson: (payload: ContentGeneratePayload): Promise<GeneratedLesson> =>
    apiClient.post<GeneratedLesson>("/content/generate", payload),
};
