import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api";
import type {
  DocumentsListResponse,
  DocumentDetailResponse,
  DocumentFilters,
} from "@/types/api";
import { buildQueryString } from "@/lib/utils";
import { REFETCH_UNPROCESSED_DOCS_MS } from "@/constants";
import { queryKeys } from "./queryKeys";

export const useDocuments = (
  filters: DocumentFilters = {},
  options?: { enableAutoRefresh?: boolean },
) => {
  return useQuery<DocumentsListResponse>({
    queryKey: queryKeys.documents(filters),
    queryFn: async () => {
      const qs = buildQueryString({
        limit: filters.limit,
        offset: filters.offset,
        processed: filters.processed,
        ingest_event_id: filters.ingest_event_id,
        cluster_id: filters.cluster_id,
        source_type: filters.source_type,
        sentiment_min: filters.sentiment_min,
        sentiment_max: filters.sentiment_max,
      });
      return apiClient.get<DocumentsListResponse>(`/documents${qs}`);
    },
    staleTime: 0,
    refetchInterval: (query) => {
      if (!options?.enableAutoRefresh || !query.state.data) {
        return false;
      }
      const hasUnprocessed = query.state.data.documents.some(
        (doc) => !doc.processed,
      );
      return hasUnprocessed ? REFETCH_UNPROCESSED_DOCS_MS : false;
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
