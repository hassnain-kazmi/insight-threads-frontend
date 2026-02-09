import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api";
import type { ClusterUMAPResponse } from "@/types/api";
import { buildQueryString } from "@/lib/utils";
import { queryKeys } from "./queryKeys";

export const useUmapDocuments = (limit?: number, enabled = true) => {
  return useQuery<ClusterUMAPResponse>({
    queryKey: queryKeys.umapDocuments(limit),
    queryFn: async () => {
      const qs = buildQueryString({ limit });
      return apiClient.get<ClusterUMAPResponse>(`/umap/documents${qs}`);
    },
    enabled,
  });
};

export const useUmapCluster = (clusterId: string) => {
  return useQuery<ClusterUMAPResponse>({
    queryKey: queryKeys.umapCluster(clusterId),
    queryFn: async () => {
      return apiClient.get<ClusterUMAPResponse>(`/umap/clusters/${clusterId}`);
    },
    enabled: !!clusterId,
  });
};
