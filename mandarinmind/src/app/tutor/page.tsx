"use client";

import { useState } from "react";
import { Settings2, ChevronLeft } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Modal } from "@/components/ui/Modal";
import { SessionList } from "@/components/tutor/SessionList";
import { ModeSelector } from "@/components/tutor/ModeSelector";
import { ChatWindow } from "@/components/tutor/ChatWindow";
import { useTutorSessions, useTutorChat } from "@/hooks/useTutor";
import { cn } from "@/lib/utils/cn";
import type { TutorMode } from "@/types";

export default function TutorPage() {
  const { sessions, isLoading, createSession, deleteSession } = useTutorSessions();
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [mode, setMode] = useState<TutorMode>("just_chat");
  const [showModeModal, setShowModeModal] = useState(false);
  // Mobile: track whether to show chat panel or session list
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  const { messages, isTyping, isConnected, sendMessage } = useTutorChat(activeSessionId);

  const handleNewSession = async () => {
    try {
      const session = await createSession("New conversation", mode);
      setActiveSessionId(session.id);
    } catch {
      setActiveSessionId(`mock-${Date.now()}`);
    }
    setMobileChatOpen(true);
  };

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    setMobileChatOpen(true);
  };

  return (
    <AppLayout title="AI Tutor">
      {/* Full-height split layout */}
      <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden -mx-4 -my-4 sm:-mx-6 sm:-my-6">

        {/* Session list — hidden on mobile when chat is open */}
        <div className={cn(
          "flex-shrink-0",
          mobileChatOpen ? "hidden md:flex" : "flex w-full md:w-72"
        )}>
          <SessionList
            sessions={sessions}
            activeId={activeSessionId}
            onSelect={handleSelectSession}
            onNew={handleNewSession}
            onDelete={deleteSession}
            isLoading={isLoading}
          />
        </div>

        {/* Chat panel — hidden on mobile when session list is showing */}
        <div className={cn(
          "flex-1 flex flex-col overflow-hidden",
          mobileChatOpen ? "flex" : "hidden md:flex"
        )}>
          {/* Toolbar */}
          <div className="flex items-center px-4 py-2 bg-white border-b border-slate-100 gap-2">
            {/* Back button — mobile only */}
            <button
              onClick={() => setMobileChatOpen(false)}
              className="md:hidden flex items-center gap-1 text-sm text-slate-500 hover:text-teal-600 transition-colors mr-1"
            >
              <ChevronLeft size={16} />
              <span>Sessions</span>
            </button>
            <div className="flex-1" />
            {activeSessionId && (
              <button
                onClick={() => setShowModeModal(true)}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-600 transition-colors rounded-lg px-2 py-1 hover:bg-slate-50"
              >
                <Settings2 size={13} />
                <span className="capitalize">{mode.replace(/_/g, " ")} mode</span>
              </button>
            )}
          </div>

          <ChatWindow
            messages={messages}
            isTyping={isTyping}
            isConnected={isConnected}
            sessionId={activeSessionId}
            onSend={(text) => sendMessage(text)}
          />
        </div>
      </div>

      {/* Mode selector modal */}
      <Modal
        isOpen={showModeModal}
        onClose={() => setShowModeModal(false)}
        title="Tutor mode"
        size="sm"
      >
        <ModeSelector value={mode} onChange={(m) => { setMode(m); setShowModeModal(false); }} />
      </Modal>
    </AppLayout>
  );
}
