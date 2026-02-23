import { apiClient } from "./client";
import type { StatsOverview, TopicStats } from "@/types";

// ─── Normalizers ─────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeOverview(raw: any): StatsOverview {
  // Backend fields (actual)  →  Frontend fields (expected)
  // totalWords               →  totalWordsLearned
  // currentStreak            →  streakDays
  // totalReviews             →  (used to infer wordsDueToday — backend doesn't provide this yet)
  // quizPerformance          →  used to derive xpTotal (score * 10 per quiz as proxy)
  // No xpToday / minutesStudiedToday / weeklyActivity on backend yet

  const totalQuizzes: number = raw?.quizPerformance?.totalQuizzes ?? 0;
  const avgScore: number = raw?.quizPerformance?.averageScore ?? 0;

  return {
    totalWordsLearned: raw?.totalWords ?? raw?.totalWordsLearned ?? 0,
    wordsDueToday: raw?.wordsDueToday ?? raw?.dueToday ?? 0,
    streakDays: raw?.currentStreak ?? raw?.streakDays ?? 0,
    // XP: backend doesn't track it — derive a proxy from quiz performance
    xpToday: raw?.xpToday ?? 0,
    xpTotal: raw?.xpTotal ?? Math.round(totalQuizzes * avgScore),
    minutesStudiedToday: raw?.minutesStudiedToday ?? 0,
    weeklyActivity: Array.isArray(raw?.weeklyActivity) ? raw.weeklyActivity : [],
    nextRecommendedAction: raw?.nextRecommendedAction ?? {
      type: "quiz",
      title: "Take today's quiz",
      description: "Practice with a mixed quiz to build your skills.",
      href: "/quiz",
    },
    lastActivity: raw?.lastActivity ?? undefined,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeTopicStat(raw: any): TopicStats {
  return {
    topic: raw?.topic ?? raw?.name ?? "Unknown",
    wordsLearned: raw?.wordsLearned ?? raw?.wordCount ?? raw?.totalWords ?? 0,
    accuracy: raw?.accuracy ?? raw?.averageScore ?? 0,
    lastStudied:
      raw?.lastStudied ?? raw?.last_studied ?? raw?.updatedAt ?? new Date().toISOString(),
    level: raw?.level ?? "A1",
  };
}

// ─── API ─────────────────────────────────────────────────────────────────────

export const statsApi = {
  getOverview: async (): Promise<StatsOverview> => {
    const raw = await apiClient.get<unknown>("/stats/overview");
    return normalizeOverview(raw);
  },

  getByTopic: async (): Promise<TopicStats[]> => {
    const raw = await apiClient.get<unknown>("/stats/by-topic");
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map(normalizeTopicStat);
  },
};

