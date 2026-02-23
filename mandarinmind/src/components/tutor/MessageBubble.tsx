"use client";

import { cn } from "@/lib/utils/cn";
import { formatRelativeTime } from "@/lib/utils/format";
import type { TutorMessage } from "@/types";

interface MessageBubbleProps {
  message: TutorMessage;
  showTime?: boolean;
}

export function MessageBubble({ message, showTime }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3 max-w-3xl", isUser ? "ml-auto flex-row-reverse" : "")}>
      {/* Avatar */}
      {!isUser && (
        <div className="shrink-0 w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-bold">
          AI
        </div>
      )}

      <div className={cn("flex flex-col gap-1", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm max-w-prose",
            isUser
              ? "bg-teal-600 text-white rounded-tr-sm"
              : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm"
          )}
        >
          {/* Render corrections inline */}
          {message.corrections && message.corrections.length > 0 && !isUser ? (
            <div className="space-y-2">
              <p className="whitespace-pre-wrap">{message.text}</p>
              <div className="border-t border-amber-200 pt-2 mt-2 space-y-1">
                {message.corrections.map((c, i) => (
                  <div key={i} className="text-xs">
                    <span className="bg-red-100 text-red-700 rounded px-1 line-through mr-1">{c.original}</span>
                    <span className="text-slate-400 mr-1">→</span>
                    <span className="bg-green-100 text-green-700 rounded px-1 mr-2">{c.corrected}</span>
                    <span className="text-slate-500">{c.explanation}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{message.text}</p>
          )}
        </div>
        {showTime && (
          <span className="text-xs text-slate-400">{formatRelativeTime(message.timestamp)}</span>
        )}
      </div>
    </div>
  );
}
