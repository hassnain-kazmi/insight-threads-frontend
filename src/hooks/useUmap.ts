import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api";
import type { ClusterUMAPResponse } from "@/types/api";

export const queryKeys = {
  umapDocuments: (limit?: number) =>
    ["umap", "documents", limit] as const,
  umapCluster: (clusterId: string) =>
    ["umap", "clusters", clusterId] as const,
};

export const useUmapDocuments = (limit?: number, enabled = true) => {
  return useQuery<ClusterUMAPResponse>({
    queryKey: queryKeys.umapDocuments(limit),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (limit !== undefined) {
        params.append("limit", limit.toString());
      }
      const queryString = params.toString();
      return apiClient.get<ClusterUMAPResponse>(
        `/umap/documents${queryString ? `?${queryString}` : ""}`
      );
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

