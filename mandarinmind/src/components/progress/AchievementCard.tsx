"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Achievement } from "@/types/user";
import { cn } from "@/lib/utils/cn";

interface AchievementCardProps {
  achievement: Achievement;
  isUnlocked: boolean;
  unlockedAt?: string;
  className?: string;
}

export function AchievementCard({
  achievement,
  isUnlocked,
  unlockedAt,
  className,
}: AchievementCardProps) {
  return (
    <Card
      variant="bordered"
      className={cn(
        "transition-all",
        isUnlocked ? "border-yellow-400 bg-yellow-50" : "opacity-60 grayscale",
        className
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="text-4xl">{achievement.icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold">{achievement.name}</h4>
              {isUnlocked && <Badge variant="success" size="sm">Unlocked</Badge>}
            </div>
            <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
            <div className="flex items-center gap-2">
              <Badge variant="info" size="sm">
                +{achievement.xpReward} XP
              </Badge>
              {unlockedAt && (
                <span className="text-xs text-gray-500">
                  {new Date(unlockedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
