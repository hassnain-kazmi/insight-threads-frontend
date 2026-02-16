import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/services/api";
import { buildQueryString } from "@/lib/utils";
import { REFETCH_ACTIVE_INGEST_MS } from "@/constants";
import { queryKeys } from "./queryKeys";
import type {
  IngestEventResponse,
  IngestEventsListResponse,
  TriggerIngestionRequest,
  TriggerIngestionResponse,
} from "@/types/api";

export const useIngestEventSourceMap = (options?: { limit?: number }) => {
  const { data, isLoading } = useIngestEvents({
    limit: options?.limit ?? 500,
  });
  const sourceMap = useMemo(() => {
    const map = new Map<string, string | null>();
    data?.events.forEach((event) => {
      map.set(event.id, event.source);
    });
    return map;
  }, [data?.events]);
  return { sourceMap, isLoading };
};

export const useIngestEvents = (filters?: {
  status?: string;
  limit?: number;
  offset?: number;
  enableAutoRefresh?: boolean;
}) => {
  const keyParams =
    filters === undefined
      ? undefined
      : {
          limit: filters.limit,
          offset: filters.offset,
          status: filters.status,
        };
  return useQuery<IngestEventsListResponse>({
    queryKey: queryKeys.ingestEvents(keyParams),
    queryFn: async () => {
      const qs = buildQueryString({
        limit: filters?.limit,
        offset: filters?.offset,
        status: filters?.status,
      });
      return apiClient.get<IngestEventsListResponse>(`/ingest/events${qs}`);
    },
    staleTime: 1000 * 30,
    refetchInterval: (query) => {
      if (!filters?.enableAutoRefresh || !query.state.data) {
        return false;
      }
      const hasActive = query.state.data.events.some(
        (e) => e.status === "pending" || e.status === "running",
      );
      return hasActive ? REFETCH_ACTIVE_INGEST_MS : false;
    },
  });
};

export const useIngestEvent = (id: string) => {
  return useQuery<IngestEventResponse>({
    queryKey: queryKeys.ingestEvent(id),
    queryFn: async () => {
      return apiClient.get<IngestEventResponse>(`/ingest/events/${id}`);
    },
    enabled: !!id,
  });
};

export const useTriggerIngestion = () => {
  const queryClient = useQueryClient();

  return useMutation<TriggerIngestionResponse, Error, TriggerIngestionRequest>({
    mutationFn: async (data) => {
      return apiClient.post<TriggerIngestionResponse>("/ingest/trigger", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingest-events"] });
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.clusters });
    },
  });
};
