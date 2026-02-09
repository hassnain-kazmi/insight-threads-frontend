import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api";
import type { InsightsListResponse } from "@/types/api";
import { buildQueryString } from "@/lib/utils";
import { queryKeys } from "./queryKeys";

export const useInsights = (clusterId?: string) => {
  return useQuery<InsightsListResponse>({
    queryKey: queryKeys.insights(
      clusterId ? { cluster_id: clusterId } : undefined,
    ),
    queryFn: async () => {
      const qs = buildQueryString({ cluster_id: clusterId });
      return apiClient.get<InsightsListResponse>(`/insights${qs}`);
    },
  });
};
