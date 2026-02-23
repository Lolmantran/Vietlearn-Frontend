"use client";

import { useRef, useEffect, FormEvent, useState } from "react";
import { Send, Wifi, WifiOff } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { cn } from "@/lib/utils/cn";
import type { TutorMessage } from "@/types";

interface ChatWindowProps {
  messages: TutorMessage[];
  isTyping: boolean;
  isConnected: boolean;
  sessionId: string | null;
  onSend: (text: string) => void;
  placeholder?: string;
}

export function ChatWindow({
  messages,
  isTyping,
  isConnected,
  sessionId,
  onSend,
  placeholder = "Type a message in English or Vietnamese…",
}: ChatWindowProps) {
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || !sessionId) return;
    onSend(draft.trim());
    setDraft("");
  };

  if (!sessionId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="text-5xl mb-3">🤖</div>
          <p className="text-lg font-semibold text-slate-700 mb-1">Start a conversation</p>
          <p className="text-sm text-slate-400">Select a session or create a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Connection status */}
      <div
        className={cn(
          "flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium",
          isConnected ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
        )}
      >
        {isConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
        {isConnected ? "Connected" : "Connecting…"}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-slate-50">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-slate-400">Say something to start the conversation!</p>
          </div>
        )}
        {messages.map((m, i) => (
          <MessageBubble key={m.id} message={m} showTime={i === messages.length - 1} />
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3 max-w-xs">
            <div className="shrink-0 w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-bold">
              AI
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-white border border-slate-200 px-4 py-3 shadow-sm">
              <span className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="px-4 py-3 bg-white border-t border-slate-200 flex gap-3 items-end"
      >
        <textarea
          rows={1}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e as unknown as FormEvent);
            }
          }}
          placeholder={placeholder}
          className="flex-1 resize-none rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 max-h-32 scrollbar-thin"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="shrink-0 rounded-xl bg-teal-600 text-white p-2.5 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
