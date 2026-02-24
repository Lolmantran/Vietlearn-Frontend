import { cn } from "@/lib/utils/cn";
import type { SRSRating } from "@/types";

const RATING_CONFIG: {
  rating: SRSRating;
  label: string;
  sub: string;
  shortcut: string;
  colors: string;
}[] = [
  {
    rating: "Again",
    label: "Again",
    sub: "< 1 min",
    shortcut: "1",
    colors: "border-red-300 text-red-700 bg-red-50 hover:bg-red-100 active:bg-red-200",
  },
  {
    rating: "Hard",
    label: "Hard",
    sub: "10 min",
    shortcut: "2",
    colors: "border-orange-300 text-orange-700 bg-orange-50 hover:bg-orange-100 active:bg-orange-200",
  },
  {
    rating: "Good",
    label: "Good",
    sub: "1 day",
    shortcut: "3",
    colors: "border-teal-300 text-teal-700 bg-teal-50 hover:bg-teal-100 active:bg-teal-200",
  },
  {
    rating: "Easy",
    label: "Easy",
    sub: "4 days",
    shortcut: "4",
    colors: "border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200",
  },
];

interface RatingButtonsProps {
  onRate: (rating: SRSRating) => void;
  isLoading?: boolean;
}

export function RatingButtons({ onRate, isLoading = false }: RatingButtonsProps) {
  return (
    <div className="flex gap-3 justify-center">
      {RATING_CONFIG.map(({ rating, label, sub, shortcut, colors }) => (
        <button
          key={rating}
          onClick={() => onRate(rating)}
          disabled={isLoading}
          className={cn(
            "flex flex-col items-center rounded-2xl border-2 px-5 py-3 font-medium transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none",
            colors
          )}
        >
          <span className="text-sm font-bold">{label}</span>
          <span className="text-xs opacity-60 mt-0.5">{sub}</span>
          <span className="mt-1 rounded bg-current/10 px-1.5 py-0.5 text-[10px] font-mono">
            {shortcut}
          </span>
        </button>
      ))}
    </div>
  );
}
