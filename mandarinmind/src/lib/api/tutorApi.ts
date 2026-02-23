import { apiClient } from "./client";
import type { TutorSession, TutorMessage, TutorCorrection, CreateSessionPayload } from "@/types";

// ─── Normalizers ─────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeSession(raw: any): TutorSession {
  return {
    id: raw?.id ?? "",
    topic: raw?.topic ?? "Conversation",
    // Backend may return "free" or other strings — keep as-is for display; cast to TutorMode for compatibility
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mode: (raw?.mode ?? "just_chat") as any,
    createdAt: raw?.createdAt ?? raw?.created_at ?? new Date().toISOString(),
    lastMessageAt:
      raw?.lastMessageAt ??
      raw?.last_message_at ??
      raw?.updatedAt ??
      raw?.updated_at ??
      raw?.createdAt ??
      new Date().toISOString(),
    messageCount: raw?.messageCount ?? raw?.message_count ?? 0,
    previewText: raw?.previewText ?? raw?.preview_text ?? raw?.lastMessage ?? "",
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeMessage(raw: any): TutorMessage {
  const corrections: TutorCorrection[] = Array.isArray(raw?.corrections)
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      raw.corrections.map((c: any) => ({
        original: c?.original ?? "",
        corrected: c?.corrected ?? "",
        explanation: c?.explanation ?? "",
      }))
    : [];

  return {
    id: raw?.id ?? `msg-${Date.now()}-${Math.random()}`,
    role: raw?.role === "user" ? "user" : "assistant",
    text: raw?.text ?? raw?.content ?? raw?.message ?? "",
    corrections: corrections.length ? corrections : undefined,
    suggestions: Array.isArray(raw?.suggestions) ? raw.suggestions : undefined,
    timestamp: raw?.timestamp ?? raw?.createdAt ?? raw?.created_at ?? new Date().toISOString(),
  };
}

// ─── API ─────────────────────────────────────────────────────────────────────

export const tutorApi = {
  createSession: async (payload: CreateSessionPayload): Promise<TutorSession> => {
    const raw = await apiClient.post<unknown>("/tutor/session", payload);
    return normalizeSession(raw);
  },

  getSessions: async (): Promise<TutorSession[]> => {
    const raw = await apiClient.get<unknown[]>("/tutor/sessions");
    return (Array.isArray(raw) ? raw : []).map(normalizeSession);
  },

  getSessionHistory: async (sessionId: string): Promise<TutorMessage[]> => {
    const raw = await apiClient.get<unknown[]>(`/tutor/session/${sessionId}/history`);
    return (Array.isArray(raw) ? raw : []).map(normalizeMessage);
  },

  // POST /tutor/session/:id/message
  // returns { userMessage, assistantMessage, reply: { text } }
  sendMessage: async (
    sessionId: string,
    text: string
  ): Promise<{ userMessage: TutorMessage; assistantMessage: TutorMessage }> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await apiClient.post<any>(`/tutor/session/${sessionId}/message`, { text });

    // Extract assistant reply — backend returns it in assistantMessage or reply
    const assistantRaw = raw?.assistantMessage ?? raw?.reply ?? raw;
    const userRaw = raw?.userMessage ?? { role: "user", text };

    return {
      userMessage: normalizeMessage({ ...userRaw, role: "user" }),
      assistantMessage: normalizeMessage({ ...assistantRaw, role: "assistant" }),
    };
  },

  deleteSession: (sessionId: string): Promise<void> =>
    apiClient.delete<void>(`/tutor/session/${sessionId}`),
};

