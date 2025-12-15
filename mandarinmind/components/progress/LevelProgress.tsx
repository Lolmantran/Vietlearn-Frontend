"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Trophy } from "lucide-react";

interface LevelProgressProps {
  currentLevel: number;
  currentXP: number;
  nextLevelXP: number;
  className?: string;
}

export function LevelProgress({ currentLevel, currentXP, nextLevelXP, className }: LevelProgressProps) {
  const progress = (currentXP / nextLevelXP) * 100;

  return (
    <Card variant="bordered" className={className}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-600" />
          Level {currentLevel}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>{currentXP.toLocaleString()} XP</span>
            <span>{nextLevelXP.toLocaleString()} XP</span>
          </div>
          <ProgressBar value={currentXP} max={nextLevelXP} color="purple" />
          <p className="text-sm text-gray-500 mt-2">
            {(nextLevelXP - currentXP).toLocaleString()} XP to level {currentLevel + 1}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
