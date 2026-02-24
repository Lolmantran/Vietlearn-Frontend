interface PosBadgeProps {
  pos: string | null | undefined;
  /** Use light variant (default) or dark for colored-background card backs */
  variant?: "light" | "dark";
  className?: string;
}

const POS_COLORS: Record<string, { light: string; dark: string }> = {
  noun:        { light: "bg-blue-100 text-blue-700",    dark: "bg-blue-500/30 text-blue-100" },
  verb:        { light: "bg-green-100 text-green-700",  dark: "bg-green-500/30 text-green-100" },
  adjective:   { light: "bg-orange-100 text-orange-700",dark: "bg-orange-500/30 text-orange-100" },
  adverb:      { light: "bg-purple-100 text-purple-700",dark: "bg-purple-400/30 text-purple-100" },
  pronoun:     { light: "bg-teal-100 text-teal-700",    dark: "bg-teal-400/30 text-teal-100" },
  phrase:      { light: "bg-slate-100 text-slate-500",  dark: "bg-white/20 text-white/70" },
  expression:  { light: "bg-slate-100 text-slate-500",  dark: "bg-white/20 text-white/70" },
  interjection:{ light: "bg-yellow-100 text-yellow-700",dark: "bg-yellow-400/30 text-yellow-100" },
};

const DEFAULT_COLORS = { light: "bg-slate-100 text-slate-500", dark: "bg-white/20 text-white/70" };

export function PosBadge({ pos, variant = "light", className = "" }: PosBadgeProps) {
  if (!pos) return null;

  const key = pos.toLowerCase().trim();
  const colors = POS_COLORS[key] ?? DEFAULT_COLORS;
  const label = pos.charAt(0).toUpperCase() + pos.slice(1).toLowerCase();

  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[variant]} ${className}`}
    >
      {label}
    </span>
  );
}
