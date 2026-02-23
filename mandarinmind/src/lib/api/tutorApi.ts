import { apiClient } from "./client";
import type { TutorSession, TutorMessage, CreateSessionPayload } from "@/types";

export const tutorApi = {
  createSession: (payload: CreateSessionPayload): Promise<TutorSession> =>
    apiClient.post<TutorSession>("/tutor/session", payload),

  getSessions: (): Promise<TutorSession[]> => apiClient.get<TutorSession[]>("/tutor/sessions"),

  getSessionHistory: (sessionId: string): Promise<TutorMessage[]> =>
    apiClient.get<TutorMessage[]>(`/tutor/session/${sessionId}/history`),

  deleteSession: (sessionId: string): Promise<void> =>
    apiClient.delete<void>(`/tutor/session/${sessionId}`),
};
