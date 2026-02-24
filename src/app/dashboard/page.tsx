"use client";

import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { Flame, BookOpen, Brain, MessageSquare, Sparkles, ArrowRight, Calendar, Target } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/ui/Card";
import { Skeleton, CardSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { useStats } from "@/hooks/useStats";
import { useAuth } from "@/hooks/useAuth";
import { useDeckProgress } from "@/hooks/useVocab";
import { formatLevel } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { DayActivity } from "@/types";

// ─── Mock data shown when backend not available ───────────────────────────────
const MOCK_OVERVIEW = {
  totalWordsLearned: 142,
  wordsDueToday: 23,
  streakDays: 7,
  xpToday: 150,
  xpTotal: 2840,
  minutesStudiedToday: 12,
  weeklyActivity: Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 86400000).toISOString(),
    minutesStudied: [0, 15, 8, 22, 5, 18, 12][i],
  })),
  nextRecommendedAction: {
    type: "review" as const,
    title: "23 cards due for review",
    description: "Keep your streak going — these are words that will slip away if you wait.",
    count: 23,
    href: "/learn/vocab",
  },
};

const QUICK_ACTIONS = [
  {
    icon: <BookOpen size={20} className="text-teal-600" />,
    title: "Review words",
    desc: "SRS queue",
    bg: "bg-teal-50",
    href: "/learn/vocab",
    badge: "23 due",
    badgeVariant: "teal" as const,
  },
  {
    icon: <MessageSquare size={20} className="text-violet-600" />,
    title: "Chat with tutor",
    desc: "AI conversation",
    bg: "bg-violet-50",
    href: "/tutor",
  },
  {
    icon: <Brain size={20} className="text-amber-600" />,
    title: "Today's quiz",
    desc: "Mixed practice",
    bg: "bg-amber-50",
    href: "/quiz",
    badge: "New",
    badgeVariant: "amber" as const,
  },
  {
    icon: <Sparkles size={20} className="text-emerald-600" />,
    title: "Custom lesson",
    desc: "From interests",
    bg: "bg-emerald-50",
    href: "/content",
  },
];

// ─── Recharts weekly bar chart ───────────────────────────────────────────────
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDayLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? "" : DAY_LABELS[d.getDay()];
}

interface TooltipPayload { date: string; minutesStudied: number }
function CustomTooltip({ active, payload }: { active?: boolean; payload?: { payload: TooltipPayload }[] }) {
  if (!active || !payload?.length) return null;
  const { date, minutesStudied } = payload[0].payload;
  return (
    <div className="rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs text-white shadow-lg">
      {formatDayLabel(date)} · {minutesStudied} min
    </div>
  );
}

function WeeklyActivityChart({ activity, todayMinutes }: { activity: DayActivity[]; todayMinutes: number }) {
  const yMax = Math.max(Math.max(...activity.map((d) => d.minutesStudied), 0), 30);
  const todayStr = new Date().toISOString().slice(0, 10);

  const data = activity.map((d) => ({
    date: d.date,
    label: formatDayLabel(d.date),
    minutesStudied: d.minutesStudied,
    display: d.minutesStudied === 0 ? 0.4 : d.minutesStudied,
    isToday: d.date.slice(0, 10) === todayStr,
  }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-700">Weekly activity</h3>
        <span className="text-xs text-slate-400">{todayMinutes} min today</span>
      </div>
      <ResponsiveContainer width="100%" height={100}>
        <BarChart data={data} barCategoryGap="20%" margin={{ top: 4, right: 0, left: -32, bottom: 0 }}>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, yMax]}
            tick={{ fontSize: 10, fill: "#cbd5e1" }}
            axisLine={false}
            tickLine={false}
            tickCount={3}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
          <Bar dataKey="display" radius={[4, 4, 0, 0]} minPointSize={3}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.isToday ? "#0d9488" : entry.minutesStudied === 0 ? "#e2e8f0" : "#99f6e4"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Daily goal card ─────────────────────────────────────────────────────────
function DailyGoalCard({ minutesToday, dailyGoal }: { minutesToday: number; dailyGoal: number }) {
  const pct = Math.min(Math.round((minutesToday / Math.max(dailyGoal, 1)) * 100), 100);
  const completed = minutesToday >= dailyGoal;
  const started = minutesToday > 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700">Daily goal</h3>
        <Badge variant={completed ? "success" : started ? "amber" : "default"}>
          {completed ? "Completed ✓" : started ? "In progress" : "Not started"}
        </Badge>
      </div>
      <div className="flex justify-between text-xs text-slate-500 mb-1.5">
        <span>{minutesToday} / {dailyGoal} min</span>
        <span>{pct}%</span>
      </div>
      <Progress value={minutesToday} max={dailyGoal} color="teal" />
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { overview, isLoading } = useStats();
  const { progress: deckProgress, isLoading: progressLoading } = useDeckProgress();

  const data = overview ?? MOCK_OVERVIEW;
  const minutesToday = user?.minutesStudiedToday ?? data?.minutesStudiedToday ?? 0;
  const dailyGoal = user?.dailyGoalMinutes ?? 20;
  const totalWordsLearned = user?.totalWordsLearned ?? data?.totalWordsLearned ?? 0;

  return (
    <AppLayout title="Dashboard">
      {/* Greeting */}
      <div className="mb-6">
        {isLoading ? (
          <Skeleton className="h-8 w-48 mb-2" />
        ) : (
          <>
            <h2 className="text-2xl font-bold text-slate-800">
              {user ? `Chào, ${user.name}! 👋` : "Chào! 👋"}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {user ? `Level: ${formatLevel(user.level)}` : "Keep up your learning streak!"}
            </p>
          </>
        )}
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          : [
              {
                label: "Day streak",
                value: `${data?.streakDays ?? 0} 🔥`,
                sub: "Keep it going!",
                icon: <Flame size={18} />,
                colorClass: "bg-amber-50 text-amber-500",
              },
              {
                label: "Words learned",
                value: totalWordsLearned.toLocaleString(),
                sub: "Total vocabulary",
                icon: <BookOpen size={18} />,
                colorClass: "bg-teal-50 text-teal-600",
              },
              {
                label: "Due today",
                value: data?.wordsDueToday ?? 0,
                sub: "Review queue",
                icon: <Calendar size={18} />,
                colorClass: "bg-violet-50 text-violet-600",
              },
              {
                label: "XP today",
                value: `${data?.xpToday ?? 0} ⭐`,
                sub: `${(data?.xpTotal ?? 0).toLocaleString()} total`,
                icon: <Target size={18} />,
                colorClass: "bg-emerald-50 text-emerald-600",
              },
            ].map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Quick actions */}
        <div className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Quick actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {QUICK_ACTIONS.map((qa) => (
              <Link key={qa.href} href={qa.href}>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 cursor-pointer">
                  <div className={cn("mb-3 inline-flex rounded-xl p-3", qa.bg)}>{qa.icon}</div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-800">{qa.title}</p>
                    {qa.badge && <Badge variant={qa.badgeVariant ?? "default"} size="sm">{qa.badge}</Badge>}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{qa.desc}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Recommended action */}
          {!isLoading && data?.nextRecommendedAction && (
            <div className="mt-4 rounded-2xl bg-linear-to-br from-teal-600 to-teal-700 p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-200 mb-1">
                Recommended next
              </p>
              <h4 className="text-base font-bold mb-1">{data.nextRecommendedAction.title}</h4>
              <p className="text-sm text-teal-100/80 mb-4">{data.nextRecommendedAction.description}</p>
              <Link href={data.nextRecommendedAction.href}>
                <Button
                  size="sm"
                  className="bg-white text-teal-700 hover:bg-teal-50"
                  rightIcon={<ArrowRight size={14} />}
                >
                  Start now
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Weekly activity chart */}
          {isLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <Skeleton className="h-4 w-32 mb-4" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : (
            <WeeklyActivityChart
              activity={data?.weeklyActivity ?? []}
              todayMinutes={minutesToday}
            />
          )}

          {/* Daily goal */}
          {isLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-3 w-full" />
            </div>
          ) : (
            <DailyGoalCard minutesToday={minutesToday} dailyGoal={dailyGoal} />
          )}

          {/* Continue learning */}
          {progressLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <Skeleton className="h-4 w-40 mb-4" />
              <Skeleton className="h-10 w-full mb-3" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : deckProgress.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Continue where you left off</h3>
              <p className="text-xs text-slate-400 mb-3">You haven&apos;t studied any decks yet.</p>
              <Link href="/learn/vocab">
                <Button variant="outline" size="sm" rightIcon={<ArrowRight size={14} />}>
                  Enroll in a deck to get started
                </Button>
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Continue where you left off</h3>
              {deckProgress.slice(0, 3).map((item) => (
                <Link key={item.id} href={`/learn/vocab?deck=${item.id}`}>
                  <div className="mb-3 last:mb-0 group cursor-pointer">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span>{item.icon}</span>
                      <span className="text-sm font-medium text-slate-700 flex-1 group-hover:text-teal-600 transition-colors">{item.name}</span>
                      <span className="text-xs text-slate-400">{item.progress}%</span>
                    </div>
                    <Progress value={item.progress} size="sm" color="teal" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
