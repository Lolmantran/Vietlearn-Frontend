import type { Deck } from "@/types";
import { Progress } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";
import { formatLevel } from "@/lib/utils/format";

interface DeckCardProps {
  deck: Deck;
  onSelect: (deck: Deck) => void;
  isEnrolling?: boolean;
}

export function DeckCard({ deck, onSelect, isEnrolling }: DeckCardProps) {
  const enrolled = deck.learnedCount ?? 0;
  const total = deck.cardCount ?? 0;
  const progress = total > 0 ? (enrolled / total) * 100 : 0;
  const isEnrolled = enrolled > 0;

  return (
    <button
      onClick={() => onSelect(deck)}
      disabled={isEnrolling}
      className="w-full text-left rounded-2xl border-2 border-slate-200 bg-white p-5 hover:border-teal-400 hover:shadow-md transition-all duration-150 group disabled:opacity-60 disabled:cursor-wait"
    >
      <div className="flex items-start gap-4">
        <div className="text-3xl">{deck.coverEmoji}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-base font-semibold text-slate-800 group-hover:text-teal-700 transition-colors">
              {deck.name}
            </h3>
            <Badge variant="teal" size="sm">{formatLevel(deck.level)}</Badge>
            {isEnrolled && (
              <Badge variant="success" size="sm">Enrolled</Badge>
            )}
          </div>
          <p className="text-sm text-slate-500 mb-3 line-clamp-1">{deck.description}</p>

          {isEnrolled ? (
            <div className="flex items-center gap-3">
              <Progress value={progress} size="sm" className="flex-1" color="teal" />
              <span className="text-xs text-slate-400 whitespace-nowrap">
                {enrolled}/{total} enrolled
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">{total} cards</span>
              <span className="text-xs font-semibold text-teal-600 group-hover:underline">
                {isEnrolling ? "Enrolling…" : "Start learning →"}
              </span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

