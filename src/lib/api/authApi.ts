import { apiClient, setToken, clearToken, getAvatarUrl } from "./client";
import type { AuthCredentials, RegisterPayload, AuthResponse, User, UpdateMePayload, VietnameseLevel, LearningGoal } from "@/types";

// ─── Level / goal normalization (backend → frontend types) ───────────────────

const BACKEND_LEVEL_MAP: Record<string, VietnameseLevel> = {
  a1: "beginner", beginner: "beginner",
  a2: "elementary", elementary: "elementary",
  b1: "intermediate", intermediate: "intermediate",
  b2: "upper_intermediate", upper_intermediate: "upper_intermediate",
  c1: "advanced", c2: "advanced", advanced: "advanced",
  absolute_beginner: "absolute_beginner",
};

const BACKEND_GOAL_MAP: Record<string, LearningGoal> = {
  travel: "travel",
  conversation: "daily_conversation", daily_conversation: "daily_conversation",
  business: "business",
  exam: "exam",
  culture: "culture",
  heritage: "heritage",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeUser(raw: any): User {
  const rawLevel = (raw?.level ?? "beginner").toString().toLowerCase();
  const level: VietnameseLevel = BACKEND_LEVEL_MAP[rawLevel] ?? "beginner";
  const goals: LearningGoal[] = (Array.isArray(raw?.goals) ? raw.goals : [])
    .map((g: string) => BACKEND_GOAL_MAP[g.toLowerCase()] ?? null)
    .filter(Boolean);

  const name: string = raw?.name ?? "";
  const email: string = raw?.email ?? "";

  // Avatar priority: backend avatarUrl → backend picture → stored Google photo → ui-avatars
  const storedAvatar = getAvatarUrl();
  const uiAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || email)}&background=0d9488&color=fff&size=128&bold=true`;
  const avatarUrl: string = raw?.avatarUrl ?? raw?.picture ?? storedAvatar ?? uiAvatar;

  return {
    id: raw?.id ?? "",
    name,
    email,
    avatarUrl,
    level,
    goals,
    dailyGoalMinutes: raw?.dailyGoal ?? raw?.dailyGoalMinutes ?? 10,
    minutesStudiedToday: raw?.minutesStudiedToday ?? 0,
    streakDays: raw?.currentStreak ?? raw?.streakDays ?? 0,
    totalWordsLearned: raw?.totalWords ?? raw?.totalWordsLearned ?? 0,
    createdAt: raw?.createdAt ?? new Date().toISOString(),
  };
}

// Frontend VietnameseLevel → backend CEFR code
function levelToBackend(level: string): string {
  const map: Record<string, string> = {
    absolute_beginner: "A1",
    beginner: "A1",
    elementary: "A2",
    intermediate: "B1",
    upper_intermediate: "B2",
    advanced: "C1",
  };
  return map[level] ?? level; // fallback: pass through if already a CEFR code
}

function goalToBackend(goal: LearningGoal): string {
  const map: Record<LearningGoal, string> = {
    travel: "travel",
    daily_conversation: "conversation",
    business: "business",
    exam: "exam",
    culture: "culture",
    heritage: "heritage",
  };
  return map[goal] ?? goal;
}

// ─── API ─────────────────────────────────────────────────────────────────────

export const authApi = {
  login: async (credentials: AuthCredentials): Promise<AuthResponse> => {
    const res = await apiClient.post<{ accessToken: string; user: unknown }>("/auth/login", credentials);
    setToken(res.accessToken);
    return { accessToken: res.accessToken, user: normalizeUser(res.user) };
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const res = await apiClient.post<{ accessToken: string; user: unknown }>("/auth/register", payload);
    setToken(res.accessToken);
    return { accessToken: res.accessToken, user: normalizeUser(res.user) };
  },

  getMe: async (): Promise<User> => {
    const raw = await apiClient.get<unknown>("/me");
    return normalizeUser(raw);
  },

  updateMe: async (payload: UpdateMePayload): Promise<User> => {
    const body: Record<string, unknown> = {};
    if (payload.level !== undefined) body.level = levelToBackend(payload.level);
    if (payload.goals !== undefined) body.goals = (payload.goals as LearningGoal[]).map(goalToBackend);
    if (payload.dailyGoal !== undefined) body.dailyGoal = payload.dailyGoal;
    const raw = await apiClient.patch<unknown>("/me", body);
    return normalizeUser(raw);
  },

  logout: (): void => {
    clearToken();
  },
};
