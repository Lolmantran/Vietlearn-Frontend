"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { tutorApi } from "@/lib/api/tutorApi";
import { TutorSocketClient } from "@/lib/ws/tutorSocket";
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

export function useTutorChat(
  sessionId: string | null,
  userId: string,
  apiBaseUrl: string
) {
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<TutorSocketClient | null>(null);

  // Load history when sessionId changes
  useEffect(() => {
    if (!sessionId) return;
    setIsLoading(true);
    tutorApi
      .getSessionHistory(sessionId)
      .then(setMessages)
      .catch(() => setMessages([]))
      .finally(() => setIsLoading(false));
  }, [sessionId]);

  // Manage WebSocket
  useEffect(() => {
    if (!sessionId) return;

    const client = new TutorSocketClient({
      sessionId,
      userId,
      apiBaseUrl,
      onConnect: () => setIsConnected(true),
      onDisconnect: () => setIsConnected(false),
      onTyping: (typing) => setIsTyping(typing),
      onError: (err) => setError(err),
      onMessage: (payload) => {
        setIsTyping(false);
        const msg: TutorMessage = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          text: payload.text,
          corrections: payload.corrections,
          suggestions: payload.suggestions,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, msg]);
      },
    });

    socketRef.current = client;
    client.connect();

    return () => {
      client.disconnect();
      socketRef.current = null;
    };
  }, [sessionId, userId, apiBaseUrl]);

  const sendMessage = useCallback((text: string) => {
    if (!socketRef.current) return;
    const msg: TutorMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, msg]);
    setIsTyping(true);
    setError(null);
    socketRef.current.sendMessage(text);
  }, []);

  return { messages, isLoading, isTyping, isConnected, error, sendMessage };
}
