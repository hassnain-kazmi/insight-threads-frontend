import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api";
import type { AnomaliesListResponse, AnomalyFilters } from "@/types/api";
import { buildQueryString } from "@/lib/utils";
import { queryKeys } from "./queryKeys";

export const useAnomalies = (filters: AnomalyFilters = {}) => {
  return useQuery<AnomaliesListResponse>({
    queryKey: queryKeys.anomalies(filters),
    queryFn: async () => {
      const qs = buildQueryString({
        cluster_id: filters.cluster_id,
        anomaly_type: filters.anomaly_type,
        start_date: filters.start_date,
        end_date: filters.end_date,
        limit: filters.limit,
        offset: filters.offset,
      });
      return apiClient.get<AnomaliesListResponse>(`/anomalies${qs}`);
    },
  });
};
