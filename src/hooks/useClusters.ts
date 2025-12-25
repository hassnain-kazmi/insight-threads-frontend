import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api";
import type {
  ClustersListResponse,
  ClusterDetailResponse,
  InsightsListResponse,
  AnomaliesListResponse,
  AnomalyFilters,
} from "@/types/api";

export const queryKeys = {
  // TODO: Re-enable pagination when backend supports it
  // clusters: (limit?: number, offset?: number) =>
  //   ["clusters", { limit, offset }] as const,
  clusters: () => ["clusters"] as const,
  cluster: (id: string) => ["clusters", id] as const,
  insights: (clusterId?: string) =>
    ["insights", clusterId ? { cluster_id: clusterId } : {}] as const,
  anomalies: (filters: AnomalyFilters) => ["anomalies", filters] as const,
};

export const useClusters = () => {
  // TODO: Re-enable pagination when backend supports it
  // export function useClusters(limit = 100, offset = 0) {
  return useQuery<ClustersListResponse>({
    queryKey: queryKeys.clusters(),
    queryFn: async () => {
      // const params = new URLSearchParams();
      // if (limit !== undefined) params.append("limit", limit.toString());
      // if (offset !== undefined) params.append("offset", offset.toString());
      // const queryString = params.toString();
      return apiClient.get<ClustersListResponse>(`/clusters`);
    },
  });
};

export const useCluster = (clusterId: string) => {
  return useQuery<ClusterDetailResponse>({
    queryKey: queryKeys.cluster(clusterId),
    queryFn: async () => {
      return apiClient.get<ClusterDetailResponse>(`/clusters/${clusterId}`);
    },
    enabled: !!clusterId,
  });
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
