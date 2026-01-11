import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/services/api";
import type {
  IngestEventResponse,
  IngestEventsListResponse,
  TriggerIngestionRequest,
  TriggerIngestionResponse,
} from "@/types/api";

export const queryKeys = {
  ingestEvents: (filters?: {
    status?: string;
    limit?: number;
    offset?: number;
  }) => ["ingest-events", filters] as const,
  ingestEvent: (id: string) => ["ingest-events", id] as const,
};

export const useIngestEvents = (filters?: {
  status?: string;
  limit?: number;
  offset?: number;
  enableAutoRefresh?: boolean;
}) => {
  return useQuery<IngestEventsListResponse>({
    queryKey: queryKeys.ingestEvents(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.limit !== undefined)
        params.append("limit", filters.limit.toString());
      if (filters?.offset !== undefined)
        params.append("offset", filters.offset.toString());
      if (filters?.status) params.append("status", filters.status);
      const queryString = params.toString();
      return apiClient.get<IngestEventsListResponse>(
        `/ingest/events${queryString ? `?${queryString}` : ""}`
      );
    },
    refetchInterval: (query) => {
      if (!filters?.enableAutoRefresh || !query.state.data) {
        return false;
      }
      const hasActive = query.state.data.events.some(
        (e) =>
          e.status === "pending" ||
          e.status === "processing" ||
          e.status === "running"
      );
      return hasActive ? 5000 : false;
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
      queryClient.invalidateQueries({ queryKey: queryKeys.ingestEvents() });
    },
  });
};
