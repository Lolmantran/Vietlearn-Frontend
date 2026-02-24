import type { VietnameseLevel, LearningGoal } from "@/types";

export function formatLevel(level: VietnameseLevel | string | null | undefined): string {
  const labels: Record<string, string> = {
    absolute_beginner: "Absolute Beginner",
    beginner: "Beginner",
    elementary: "Elementary",
    intermediate: "Intermediate",
    upper_intermediate: "Upper Intermediate",
    advanced: "Advanced",
    // CEFR fallbacks in case normalization hasn't run yet
    a1: "Beginner", a2: "Elementary",
    b1: "Intermediate", b2: "Upper Intermediate",
    c1: "Advanced", c2: "Advanced",
  };
  if (!level) return "Beginner";
  return labels[level.toString().toLowerCase()] ?? level.toString();
}

export function formatGoal(goal: LearningGoal): string {
  const labels: Record<LearningGoal, string> = {
    travel: "🌏 Travel",
    daily_conversation: "💬 Daily Conversation",
    business: "💼 Business",
    exam: "📝 Exam Prep",
    culture: "🎭 Culture & Media",
    heritage: "🏡 Heritage Speaker",
  };
  return labels[goal];
}

export function formatStreak(days: number): string {
  if (days === 0) return "No streak yet";
  if (days === 1) return "1 day";
  return `${days} days`;
}

export function formatRelativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function formatXP(xp: number): string {
  if (xp >= 1_000_000) return `${(xp / 1_000_000).toFixed(1)}M XP`;
  if (xp >= 1_000) return `${(xp / 1_000).toFixed(1)}K XP`;
  return `${xp} XP`;
}

export function levelColor(level: VietnameseLevel): string {
  const colors: Record<VietnameseLevel, string> = {
    absolute_beginner: "bg-slate-200 text-slate-700",
    beginner: "bg-green-100 text-green-700",
    elementary: "bg-teal-100 text-teal-700",
    intermediate: "bg-blue-100 text-blue-700",
    upper_intermediate: "bg-violet-100 text-violet-700",
    advanced: "bg-amber-100 text-amber-700",
  };
  return colors[level];
}
