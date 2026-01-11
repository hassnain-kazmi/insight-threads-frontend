import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api";
import type { SearchResponse } from "@/types/api";

export const queryKeys = {
  search: (query: string, threshold?: number) =>
    ["search", query, threshold !== undefined ? { threshold } : {}] as const,
};

export const useSearch = (query: string, similarityThreshold?: number) => {
  return useQuery<SearchResponse>({
    queryKey: queryKeys.search(query, similarityThreshold),
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("query", query);
      if (similarityThreshold !== undefined) {
        params.append("similarity_threshold", similarityThreshold.toString());
      }
      return apiClient.get<SearchResponse>(`/search?${params.toString()}`);
    },
    enabled: query.trim().length > 0,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
