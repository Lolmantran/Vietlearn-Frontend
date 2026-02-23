"use client";

import { useState } from "react";
import { Settings2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Modal } from "@/components/ui/Modal";
import { SessionList } from "@/components/tutor/SessionList";
import { ModeSelector } from "@/components/tutor/ModeSelector";
import { ChatWindow } from "@/components/tutor/ChatWindow";
import { useTutorSessions, useTutorChat } from "@/hooks/useTutor";
import { useAuth } from "@/hooks/useAuth";
import type { TutorMode } from "@/types";

export default function TutorPage() {
  const { user } = useAuth();
  const { sessions, isLoading, createSession, deleteSession } = useTutorSessions();
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [mode, setMode] = useState<TutorMode>("just_chat");
  const [showModeModal, setShowModeModal] = useState(false);

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";
  const userId = user?.id ?? "";

  const { messages, isTyping, isConnected, sendMessage } = useTutorChat(
    activeSessionId,
    userId,
    apiBase
  );

  const handleNewSession = async () => {
    try {
      const session = await createSession("New conversation", mode);
      setActiveSessionId(session.id);
    } catch {
      // Mock: just set a fake id so the UI opens
      setActiveSessionId(`mock-${Date.now()}`);
    }
  };

  return (
    <AppLayout title="AI Tutor">
      {/* Full-height split layout */}
      <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden -mx-4 -my-4 sm:-mx-6 sm:-my-6">
        {/* Left: session list */}
        <SessionList
          sessions={sessions}
          activeId={activeSessionId}
          onSelect={setActiveSessionId}
          onNew={handleNewSession}
          onDelete={deleteSession}
          isLoading={isLoading}
        />

        {/* Right: chat + mode */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          {activeSessionId && (
            <div className="flex items-center justify-end px-4 py-2 bg-white border-b border-slate-100">
              <button
                onClick={() => setShowModeModal(true)}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-600 transition-colors rounded-lg px-2 py-1 hover:bg-slate-50"
              >
                <Settings2 size={13} />
                <span className="capitalize">{mode.replace(/_/g, " ")} mode</span>
              </button>
            </div>
          )}

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
