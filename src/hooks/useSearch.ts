import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api";
import type { SearchResponse } from "@/types/api";
import { buildQueryString } from "@/lib/utils";
import { queryKeys } from "./queryKeys";

export const useSearch = (query: string, similarityThreshold?: number) => {
  return useQuery<SearchResponse>({
    queryKey: queryKeys.search(query, similarityThreshold),
    queryFn: async () => {
      const qs = buildQueryString({
        query,
        similarity_threshold: similarityThreshold,
      });
      return apiClient.get<SearchResponse>(`/search${qs}`);
    },
    enabled: query.trim().length > 0,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
