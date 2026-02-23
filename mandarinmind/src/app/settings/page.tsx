"use client";

import { useState, useEffect, FormEvent } from "react";
import { User, Target, Bell, Shield, ChevronRight } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils/cn";
import type { VietnameseLevel, LearningGoal } from "@/types";

type SectionId = "profile" | "goals" | "notifications" | "account";

const LEVELS: { value: VietnameseLevel; label: string }[] = [
  { value: "absolute_beginner", label: "Absolute Beginner" },
  { value: "beginner", label: "Beginner" },
  { value: "elementary", label: "Elementary" },
  { value: "intermediate", label: "Intermediate" },
  { value: "upper_intermediate", label: "Upper Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const GOALS: { value: LearningGoal; label: string; emoji: string }[] = [
  { value: "travel", label: "Travel", emoji: "✈️" },
  { value: "daily_conversation", label: "Daily conversation", emoji: "💬" },
  { value: "business", label: "Business", emoji: "💼" },
  { value: "exam", label: "Exam preparation", emoji: "📝" },
  { value: "culture", label: "Culture & media", emoji: "🎭" },
  { value: "heritage", label: "Heritage learner", emoji: "🏮" },
];

const DAILY_GOALS = [5, 10, 20, 30];

const SECTIONS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "goals", label: "Learning goals", icon: Target },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "account", label: "Account", icon: Shield },
];

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [activeSection, setActiveSection] = useState<SectionId>("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Profile form state
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  // Goal state
  const [selectedLevel, setSelectedLevel] = useState<VietnameseLevel>(user?.level ?? "beginner");
  const [selectedGoals, setSelectedGoals] = useState<LearningGoal[]>(user?.goals ?? []);
  const [dailyGoal, setDailyGoal] = useState(user?.dailyGoalMinutes ?? 10);

  // Sync form state when user data loads (async)
  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setEmail(user.email);
    setSelectedLevel(user.level);
    setSelectedGoals(user.goals ?? []);
    setDailyGoal(user.dailyGoalMinutes ?? 10);
  }, [user?.id]);

  // Reminder state
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState("08:00");

  const toggleGoal = (g: LearningGoal) => {
    setSelectedGoals((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    try {
      if (activeSection === "goals") {
        await updateUser({
          level: selectedLevel,
          goals: selectedGoals,
          dailyGoal,
        });
      }
      // profile / notifications sections — extend here as backend adds support
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppLayout title="Settings">
      <div className="flex gap-6">
        {/* Sidebar nav */}
        <aside className="w-52 shrink-0">
          <nav className="space-y-1">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id as SectionId)}
                  className={cn(
                    "w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                    activeSection === s.id
                      ? "bg-teal-50 text-teal-700 border border-teal-200"
                      : "text-slate-600 hover:bg-slate-100 border border-transparent"
                  )}
                >
                  <Icon size={15} />
                  {s.label}
                  <ChevronRight size={13} className="ml-auto text-slate-400" />
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex-1 max-w-xl">
          {activeSection === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>How others and the AI tutor know you</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-4">
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-2xl">
                      {(name || user?.name || "U")[0].toUpperCase()}
                    </div>
                    <Button variant="outline" size="sm" type="button">Change photo</Button>
                  </div>

                  <Input
                    label="Display name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />

                  <Button type="submit" isLoading={isSaving}>
                    {saved ? "✓ Saved!" : "Save changes"}
                  </Button>
                  {saveError && <p className="text-sm text-red-500 mt-1">{saveError}</p>}
                </form>
              </CardContent>
            </Card>
          )}

          {/* ── Learning goals ── */}
          {activeSection === "goals" && (
            <Card>
              <CardHeader>
                <CardTitle>Learning goals</CardTitle>
                <CardDescription>Customize your study plan</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-6">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-3">My Vietnamese level</p>
                    <div className="space-y-2">
                      {LEVELS.map((l) => (
                        <label
                          key={l.value}
                          className={cn(
                            "flex items-center gap-3 rounded-xl border-2 px-4 py-2.5 cursor-pointer transition-all",
                            selectedLevel === l.value
                              ? "border-teal-500 bg-teal-50"
                              : "border-slate-200 hover:border-teal-300"
                          )}
                        >
                          <input
                            type="radio"
                            name="level"
                            value={l.value}
                            checked={selectedLevel === l.value}
                            onChange={() => setSelectedLevel(l.value)}
                            className="accent-teal-600"
                          />
                          <span className={cn("text-sm font-medium", selectedLevel === l.value ? "text-teal-700" : "text-slate-700")}>
                            {l.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-3">Why are you learning Vietnamese?</p>
                    <div className="grid grid-cols-2 gap-2">
                      {GOALS.map((g) => {
                        const active = selectedGoals.includes(g.value);
                        return (
                          <button
                            key={g.value}
                            type="button"
                            onClick={() => toggleGoal(g.value)}
                            className={cn(
                              "flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-all",
                              active ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 hover:border-teal-300 text-slate-700"
                            )}
                          >
                            <span>{g.emoji}</span>
                            {g.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-3">Daily study goal</p>
                    <div className="flex gap-3">
                      {DAILY_GOALS.map((mins) => (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => setDailyGoal(mins)}
                          className={cn(
                            "rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-all",
                            dailyGoal === mins ? "border-teal-500 bg-teal-600 text-white" : "border-slate-200 text-slate-600 hover:border-teal-300"
                          )}
                        >
                          {mins} min
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button type="submit" isLoading={isSaving}>
                    {saved ? "✓ Saved!" : "Save goals"}
                  </Button>
                  {saveError && <p className="text-sm text-red-500 mt-1">{saveError}</p>}
                </form>
              </CardContent>
            </Card>
          )}

          {activeSection === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Choose when and how you get reminded</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-5">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Daily reminder</p>
                      <p className="text-xs text-slate-400">Get a push notification to practice</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReminderEnabled((v) => !v)}
                      className={cn(
                        "relative inline-flex h-6 w-11 rounded-full transition-colors",
                        reminderEnabled ? "bg-teal-600" : "bg-slate-300"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform",
                          reminderEnabled ? "translate-x-6" : "translate-x-1"
                        )}
                      />
                    </button>
                  </label>

                  {reminderEnabled && (
                    <Input
                      label="Reminder time"
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                    />
                  )}

                  <Button type="submit" isLoading={isSaving}>
                    {saved ? "✓ Saved!" : "Save preferences"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {activeSection === "account" && (
            <Card>
              <CardHeader>
                <CardTitle>Account & security</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border border-slate-200 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-600">Email</p>
                    <p className="text-sm font-medium text-slate-800">{user?.email ?? "—"}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-600">Member since</p>
                    <p className="text-sm font-medium text-slate-800">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                    </p>
                  </div>
                </div>
                <Button variant="outline">Change password</Button>
                <div className="pt-4 border-t border-slate-100">
                  <Button variant="danger" size="sm">Delete account</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
