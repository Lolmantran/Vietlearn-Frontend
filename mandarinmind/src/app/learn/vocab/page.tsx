"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { ReviewSession } from "@/components/vocab/ReviewSession";
import { DeckCard } from "@/components/vocab/DeckCard";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { useDecks } from "@/hooks/useVocab";
import { vocabApi } from "@/lib/api/vocabApi";
import type { Deck } from "@/types";

// ─── Mock decks for demo ──────────────────────────────────────────────────────
const MOCK_DECKS: Deck[] = [
  {
    id: "core",
    name: "Core Vocabulary",
    description: "The 500 most essential Vietnamese words for everyday life",
    type: "core",
    cardCount: 500,
    learnedCount: 142,
    coverEmoji: "📚",
    level: "beginner",
  },
  {
    id: "travel",
    name: "Travel & Navigation",
    description: "Everything you need for travelling in Vietnam",
    type: "travel",
    cardCount: 200,
    learnedCount: 45,
    coverEmoji: "✈️",
    level: "beginner",
  },
  {
    id: "food",
    name: "Food & Dining",
    description: "Order food, describe tastes, and talk about Vietnamese cuisine",
    type: "by_topic",
    cardCount: 150,
    learnedCount: 30,
    coverEmoji: "🍜",
    level: "elementary",
  },
  {
    id: "business",
    name: "Business Vietnamese",
    description: "Professional vocabulary for the workplace and meetings",
    type: "business",
    cardCount: 300,
    learnedCount: 0,
    coverEmoji: "💼",
    level: "intermediate",
  },
];

export default function VocabPage() {
  const { decks, isLoading } = useDecks();
  const displayDecks = decks.length > 0 ? decks : MOCK_DECKS;

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deckName, setDeckName] = useState("");
  const [wordInput, setWordInput] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleDeckSelect = (deck: Deck) => {
    // Navigate or open deck — future enhancement
    console.log("Selected deck:", deck.id);
  };

  const handleCreateDeck = async () => {
    if (!deckName.trim()) return;
    setIsCreating(true);
    try {
      await vocabApi.generateCustomDeck({
        deckName,
        inputText: wordInput,
      });
      setCreateModalOpen(false);
      setDeckName("");
      setWordInput("");
    } catch {
      // Handle error
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <AppLayout title="Vocabulary">
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
                        <DeckCard key={deck.id} deck={deck} onSelect={handleDeckSelect} />
                      ))}
                </div>
              </div>
            )}
          </>
        )}
      </Tabs>

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
