import { apiClient } from "./client";
import type { StatsOverview, TopicStats } from "@/types";

export const statsApi = {
  getOverview: (): Promise<StatsOverview> => apiClient.get<StatsOverview>("/stats/overview"),

  getByTopic: (): Promise<TopicStats[]> => apiClient.get<TopicStats[]>("/stats/by-topic"),
};
