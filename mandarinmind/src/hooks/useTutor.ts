"use client";

import { useState, useEffect, useCallback } from "react";
import { tutorApi } from "@/lib/api/tutorApi";
import type { TutorSession, TutorMessage, TutorMode } from "@/types";

export function useTutorSessions() {
  const [sessions, setSessions] = useState<TutorSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    setIsLoading(true);
    tutorApi
      .getSessions()
      .then(setSessions)
      .catch(() => setSessions([]))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createSession = useCallback(
    async (topic: string, mode: TutorMode): Promise<TutorSession> => {
      const session = await tutorApi.createSession({ topic, mode });
      setSessions((prev) => [session, ...prev]);
      return session;
    },
    []
  );

  const deleteSession = useCallback(async (id: string) => {
    await tutorApi.deleteSession(id);
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return { sessions, isLoading, refresh, createSession, deleteSession };
}

// _userId and _apiBaseUrl are kept for API compatibility but REST needs neither
export function useTutorChat(
  sessionId: string | null,
  _userId?: string,
  _apiBaseUrl?: string
) {
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load history whenever the active session changes
  useEffect(() => {
    if (!sessionId) {
      setMessages([]);
      return;
    }
    setIsLoading(true);
    tutorApi
      .getSessionHistory(sessionId)
      .then(setMessages)
      .catch(() => setMessages([]))
      .finally(() => setIsLoading(false));
  }, [sessionId]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!sessionId) return;

      // Optimistically add the user message immediately
      const optimisticUser: TutorMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        text,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimisticUser]);
      setIsTyping(true);
      setError(null);

      try {
        const { assistantMessage } = await tutorApi.sendMessage(sessionId, text);
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to send message";
        setError(msg);
      } finally {
        setIsTyping(false);
      }
    },
    [sessionId]
  );

  // REST is always "connected" when a session is active
  const isConnected = !!sessionId;

  return { messages, isLoading, isTyping, isConnected, error, sendMessage };
}
