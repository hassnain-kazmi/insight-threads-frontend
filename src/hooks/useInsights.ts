import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api";
import type { InsightsListResponse } from "@/types/api";

export const queryKeys = {
  insights: (clusterId?: string) =>
    ["insights", clusterId ? { cluster_id: clusterId } : {}] as const,
};

export const useInsights = (clusterId?: string) => {
  return useQuery<InsightsListResponse>({
    queryKey: queryKeys.insights(clusterId),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (clusterId) {
        params.append("cluster_id", clusterId);
      }
      const queryString = params.toString();
      return apiClient.get<InsightsListResponse>(
        `/insights${queryString ? `?${queryString}` : ""}`
      );
    },
  });
};
