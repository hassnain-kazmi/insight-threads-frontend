import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api";
import type { ClustersListResponse, ClusterDetailResponse } from "@/types/api";
import { buildQueryString } from "@/lib/utils";
import { CLUSTERS_LIST_LIMIT } from "@/constants";
import { queryKeys } from "./queryKeys";

export const useClusters = () => {
  return useQuery<ClustersListResponse>({
    queryKey: queryKeys.clusters,
    queryFn: async () => {
      const qs = buildQueryString({ limit: CLUSTERS_LIST_LIMIT });
      return apiClient.get<ClustersListResponse>(`/clusters${qs}`);
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
