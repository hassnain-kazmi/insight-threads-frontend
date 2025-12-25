import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api";
import type {
  DocumentsListResponse,
  DocumentDetailResponse,
  DocumentFilters,
} from "@/types/api";

export const queryKeys = {
  documents: (filters: DocumentFilters) =>
    ["documents", filters] as const,
  document: (id: string) => ["documents", id] as const,
};

export const useDocuments = (filters: DocumentFilters = {}) => {
  return useQuery<DocumentsListResponse>({
    queryKey: queryKeys.documents(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.limit !== undefined)
        params.append("limit", filters.limit.toString());
      if (filters.offset !== undefined)
        params.append("offset", filters.offset.toString());
      if (filters.processed !== undefined)
        params.append("processed", filters.processed.toString());
      if (filters.ingest_event_id)
        params.append("ingest_event_id", filters.ingest_event_id);
      if (filters.cluster_id) params.append("cluster_id", filters.cluster_id);
      if (filters.source_type) params.append("source_type", filters.source_type);
      if (filters.sentiment_min !== undefined)
        params.append("sentiment_min", filters.sentiment_min.toString());
      if (filters.sentiment_max !== undefined)
        params.append("sentiment_max", filters.sentiment_max.toString());

      const queryString = params.toString();
      return apiClient.get<DocumentsListResponse>(
        `/documents${queryString ? `?${queryString}` : ""}`
      );
    },
  });
};

export const useDocument = (id: string) => {
  return useQuery<DocumentDetailResponse>({
    queryKey: queryKeys.document(id),
    queryFn: async () => {
      return apiClient.get<DocumentDetailResponse>(`/documents/${id}`);
    },
    enabled: !!id,
  });
};

