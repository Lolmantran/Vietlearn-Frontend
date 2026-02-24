"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { ReviewSession } from "@/components/vocab/ReviewSession";
import { DeckReviewSession } from "@/components/vocab/DeckReviewSession";
import { DeckCard } from "@/components/vocab/DeckCard";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { useDecks } from "@/hooks/useVocab";
import { vocabApi } from "@/lib/api/vocabApi";
import type { Deck } from "@/types";

// ─── Mock decks (shown when backend is unavailable) ──────────────────────────
// IDs match backend seeded data so enrollment works if backend comes up
const MOCK_DECKS: Deck[] = [
  {
    id: "deck-core-01",
    name: "Core Vocabulary",
    description: "The 500 most essential Vietnamese words for everyday life",
    type: "core",
    cardCount: 30,
    learnedCount: 0,
    coverEmoji: "📚",
    level: "beginner",
  },
  {
    id: "deck-travel-01",
    name: "Travel & Navigation",
    description: "Everything you need for travelling in Vietnam",
    type: "travel",
    cardCount: 20,
    learnedCount: 0,
    coverEmoji: "✈️",
    level: "beginner",
  },
  {
    id: "deck-food-01",
    name: "Food & Dining",
    description: "Order food, describe tastes, and talk about Vietnamese cuisine",
    type: "by_topic",
    cardCount: 20,
    learnedCount: 0,
    coverEmoji: "🍜",
    level: "elementary",
  },
  {
    id: "deck-business-01",
    name: "Business Vietnamese",
    description: "Professional vocabulary for the workplace and meetings",
    type: "business",
    cardCount: 20,
    learnedCount: 0,
    coverEmoji: "💼",
    level: "intermediate",
  },
];

export default function VocabPage() {
  const { decks, isLoading, enrollDeck, addDeck, replaceDeck, removeDeck } = useDecks();
  const displayDecks = decks.length > 0 ? decks : MOCK_DECKS;

  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deckName, setDeckName] = useState("");
  const [wordInput, setWordInput] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleDeckSelect = async (deck: Deck) => {
    setEnrollingId(deck.id);
    try {
      await enrollDeck(deck.id);
    } catch {
      // Already enrolled or error — still open the deck
    } finally {
      setEnrollingId(null);
    }
    setSelectedDeck(deck);
  };

  const handleCreateDeck = async () => {
    if (!deckName.trim()) return;
    setIsCreating(true);
    // Optimistic: add a placeholder deck immediately so it appears without refresh
    const tempId = `temp-${Date.now()}`;
    const optimisticDeck: Deck = {
      id: tempId,
      name: deckName,
      description: wordInput ? "Custom deck from your text" : "Custom deck",
      type: "custom",
      cardCount: 0,
      learnedCount: 0,
      coverEmoji: "⭐",
      level: "beginner",
    };
    addDeck(optimisticDeck);
    setCreateModalOpen(false);
    setDeckName("");
    setWordInput("");
    try {
      const realDeck = await vocabApi.generateCustomDeck({ deckName, inputText: wordInput });
      // Swap the optimistic placeholder for the real deck
      replaceDeck(tempId, realDeck);
    } catch {
      // Remove the placeholder on failure
      removeDeck(tempId);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <AppLayout title="Vocabulary">
      {/* ── Deck study view ─────────────────────────────────────────────────── */}
      {selectedDeck ? (
        <DeckReviewSession
          deck={selectedDeck}
          onBack={() => setSelectedDeck(null)}
        />
      ) : (
        /* ── Tabs: Review today / Browse decks ───────────────────────────── */
        <Tabs
          tabs={[
            { id: "review", label: "Review today" },
            { id: "decks", label: "Browse decks" },
          ]}
          variant="underline"
        >
          {(active) => (
            <>
              {active === "review" && <ReviewSession />}
              {active === "decks" && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-semibold text-slate-700">
                      {displayDecks.length} decks available
                    </h3>
                    <Button
                      size="sm"
                      onClick={() => setCreateModalOpen(true)}
                      leftIcon={<Plus size={16} />}
                    >
                      Create custom
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {isLoading
                      ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
                      : displayDecks.map((deck) => (
                          <DeckCard
                            key={deck.id}
                            deck={deck}
                            onSelect={handleDeckSelect}
                            isEnrolling={enrollingId === deck.id}
                          />
                        ))}
                  </div>
                </div>
              )}
            </>
          )}
        </Tabs>
      )}

      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create custom deck"
      >
        <div className="space-y-4">
          <Input
            label="Deck name"
            placeholder="e.g. My Travel Phrases"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Words or text (English)
            </label>
            <textarea
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 resize-none"
              rows={5}
              placeholder="Paste English words or sentences — we'll generate Vietnamese translations for you"
              value={wordInput}
              onChange={(e) => setWordInput(e.target.value)}
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateDeck} isLoading={isCreating} disabled={!deckName.trim()}>
              Generate deck
            </Button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}
