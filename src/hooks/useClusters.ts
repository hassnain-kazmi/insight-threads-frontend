import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api";
import type { ClustersListResponse, ClusterDetailResponse } from "@/types/api";
import { queryKeys } from "./queryKeys";

export const useClusters = () => {
  return useQuery<ClustersListResponse>({
    queryKey: queryKeys.clusters,
    queryFn: async () => {
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
