"use client";

import { useState, useEffect, useCallback } from "react";
import { statsApi } from "@/lib/api/statsApi";
import type { StatsOverview, TopicStats } from "@/types";

export function useStats() {
  const [overview, setOverview] = useState<StatsOverview | null>(null);
  const [topicStats, setTopicStats] = useState<TopicStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setIsLoading(true);
    Promise.all([statsApi.getOverview(), statsApi.getByTopic()])
      .then(([ov, ts]) => {
        setOverview(ov);
        setTopicStats(ts);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  return { overview, topicStats, isLoading, error, refresh };
}
