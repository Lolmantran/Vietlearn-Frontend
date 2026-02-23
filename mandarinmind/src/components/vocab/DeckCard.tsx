import type { Deck } from "@/types";
import { Progress } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";
import { formatLevel } from "@/lib/utils/format";

interface DeckCardProps {
  deck: Deck;
  onSelect: (deck: Deck) => void;
}

export function DeckCard({ deck, onSelect }: DeckCardProps) {
  const progress = deck.cardCount > 0 ? (deck.learnedCount / deck.cardCount) * 100 : 0;

  return (
    <button
      onClick={() => onSelect(deck)}
      className="w-full text-left rounded-2xl border-2 border-slate-200 bg-white p-5 hover:border-teal-400 hover:shadow-md transition-all duration-150 group"
    >
      <div className="flex items-start gap-4">
        <div className="text-3xl">{deck.coverEmoji}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-semibold text-slate-800 group-hover:text-teal-700 transition-colors">
              {deck.name}
            </h3>
            <Badge variant="teal" size="sm">{formatLevel(deck.level)}</Badge>
          </div>
          <p className="text-sm text-slate-500 mb-3 line-clamp-1">{deck.description}</p>
          <div className="flex items-center gap-3">
            <Progress value={progress} size="sm" className="flex-1" />
            <span className="text-xs text-slate-400 whitespace-nowrap">
              {deck.learnedCount}/{deck.cardCount}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
