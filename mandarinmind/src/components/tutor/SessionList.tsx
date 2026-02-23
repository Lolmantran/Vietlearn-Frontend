"use client";

import { Bot, MessageSquare, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { formatRelativeTime } from "@/lib/utils/format";
import type { TutorSession } from "@/types";

interface SessionListProps {
  sessions: TutorSession[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function SessionList({
  sessions,
  activeId,
  onSelect,
  onNew,
  onDelete,
  isLoading,
}: SessionListProps) {
  return (
    <aside className="w-72 shrink-0 flex flex-col border-r border-slate-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Bot size={20} className="text-teal-600" />
          <span className="font-semibold text-slate-800 text-sm">AI Tutor</span>
        </div>
        <Button size="sm" onClick={onNew} leftIcon={<Plus size={14} />}>
          New
        </Button>
      </div>

      {/* Session list */}
      <div className="flex-1 overflow-y-auto py-2">
        {isLoading ? (
          <div className="space-y-2 px-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 py-10">
            <MessageSquare size={32} className="text-slate-300 mb-2" />
            <p className="text-sm text-slate-400">No sessions yet. Start chatting!</p>
          </div>
        ) : (
          <ul className="space-y-1 px-2">
            {sessions.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => onSelect(s.id)}
                  className={cn(
                    "w-full text-left rounded-xl px-3 py-2.5 transition-all group",
                    activeId === s.id
                      ? "bg-teal-50 border border-teal-200"
                      : "hover:bg-slate-50 border border-transparent"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "text-sm font-medium truncate",
                          activeId === s.id ? "text-teal-800" : "text-slate-700"
                        )}
                      >
                        {s.topic || "New conversation"}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{formatRelativeTime(s.lastMessageAt)}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(s.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
