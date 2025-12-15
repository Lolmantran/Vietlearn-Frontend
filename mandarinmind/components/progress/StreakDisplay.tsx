"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak?: number;
  className?: string;
}

export function StreakDisplay({ currentStreak, longestStreak, className }: StreakDisplayProps) {
  const getStreakColor = (streak: number) => {
    if (streak >= 30) return "text-purple-600";
    if (streak >= 14) return "text-orange-600";
    if (streak >= 7) return "text-red-600";
    return "text-yellow-600";
  };

  return (
    <Card variant="bordered" className={className}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Flame className={cn("h-5 w-5", getStreakColor(currentStreak))} />
          Learning Streak
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className={cn("text-5xl font-bold", getStreakColor(currentStreak))}>
            {currentStreak}
          </span>
          <span className="text-gray-500 text-lg">day{currentStreak !== 1 ? "s" : ""}</span>
        </div>
        {longestStreak !== undefined && longestStreak > currentStreak && (
          <p className="text-sm text-gray-500 mt-2">
            Longest streak: {longestStreak} day{longestStreak !== 1 ? "s" : ""}
          </p>
        )}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            Keep going! Study every day to maintain your streak. 48-hour leniency applies.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
