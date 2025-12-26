import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api";
import type { AnomaliesListResponse, AnomalyFilters } from "@/types/api";

export const queryKeys = {
  anomalies: (filters: AnomalyFilters) => ["anomalies", filters] as const,
};

export const useAnomalies = (filters: AnomalyFilters = {}) => {
  return useQuery<AnomaliesListResponse>({
    queryKey: queryKeys.anomalies(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.cluster_id) {
        params.append("cluster_id", filters.cluster_id);
      }
      if (filters.anomaly_type) {
        params.append("anomaly_type", filters.anomaly_type);
      }
      if (filters.start_date) {
        params.append("start_date", filters.start_date);
      }
      if (filters.end_date) {
        params.append("end_date", filters.end_date);
      }
      if (filters.limit !== undefined) {
        params.append("limit", filters.limit.toString());
      }
      if (filters.offset !== undefined) {
        params.append("offset", filters.offset.toString());
      }
      const queryString = params.toString();
      return apiClient.get<AnomaliesListResponse>(
        `/anomalies${queryString ? `?${queryString}` : ""}`
      );
    },
  });
};

