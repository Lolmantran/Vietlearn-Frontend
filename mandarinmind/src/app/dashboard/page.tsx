"use client";

import Link from "next/link";
import { Flame, BookOpen, Brain, MessageSquare, Sparkles, ArrowRight, Calendar, Target } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/ui/Card";
import { Skeleton, CardSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { useStats } from "@/hooks/useStats";
import { useAuth } from "@/hooks/useAuth";
import { formatLevel } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

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
    wordsReviewed: [0, 30, 16, 45, 10, 35, 23][i],
    xpEarned: [0, 100, 60, 180, 40, 130, 90][i],
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

function WeeklyActivity({ activity }: { activity: typeof MOCK_OVERVIEW.weeklyActivity }) {
  const max = Math.max(...activity.map((d) => d.minutesStudied), 1);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <div className="flex items-end justify-between gap-2 h-20">
      {activity.map((day, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <div
            className={cn(
              "w-full rounded-lg transition-all",
              day.minutesStudied > 0 ? "bg-teal-500" : "bg-slate-100"
            )}
            style={{ height: `${(day.minutesStudied / max) * 100}%`, minHeight: "4px" }}
            title={`${day.minutesStudied} min`}
          />
          <span className="text-xs text-slate-400">{days[i]}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { overview, isLoading } = useStats();

  const data = overview ?? MOCK_OVERVIEW;

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
                value: `${data.streakDays} 🔥`,
                sub: "Keep it going!",
                icon: <Flame size={18} />,
                colorClass: "bg-amber-50 text-amber-500",
              },
              {
                label: "Words learned",
                value: data.totalWordsLearned.toLocaleString(),
                sub: "Total vocabulary",
                icon: <BookOpen size={18} />,
                colorClass: "bg-teal-50 text-teal-600",
              },
              {
                label: "Due today",
                value: data.wordsDueToday,
                sub: "Review queue",
                icon: <Calendar size={18} />,
                colorClass: "bg-violet-50 text-violet-600",
              },
              {
                label: "XP today",
                value: `${data.xpToday} ⭐`,
                sub: `${data.xpTotal.toLocaleString()} total`,
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
          {!isLoading && (
            <div className="mt-4 rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 p-5 text-white">
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
          {/* Weekly activity */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-700">Weekly activity</h3>
              <span className="text-xs text-slate-400">{data.minutesStudiedToday} min today</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : (
              <WeeklyActivity activity={data.weeklyActivity} />
            )}
          </div>

          {/* Daily goal */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-700">Daily goal</h3>
              <Badge variant={data.minutesStudiedToday >= (user?.dailyGoalMinutes ?? 10) ? "success" : "default"}>
                {data.minutesStudiedToday >= (user?.dailyGoalMinutes ?? 10) ? "Complete ✓" : "In progress"}
              </Badge>
            </div>
            <Progress
              value={data.minutesStudiedToday}
              max={user?.dailyGoalMinutes ?? 10}
              color="teal"
              label={`${data.minutesStudiedToday} / ${user?.dailyGoalMinutes ?? 10} min`}
              showLabel
            />
          </div>

          {/* Continue learning */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Continue where you left off</h3>
            {[
              { title: "Core Vocabulary", progress: 65, icon: "📚" },
              { title: "Travel Phrases", progress: 30, icon: "✈️" },
            ].map((item) => (
              <div key={item.title} className="mb-3 last:mb-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span>{item.icon}</span>
                  <span className="text-sm font-medium text-slate-700 flex-1">{item.title}</span>
                  <span className="text-xs text-slate-400">{item.progress}%</span>
                </div>
                <Progress value={item.progress} size="sm" color="teal" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
