import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api";
import type {
  ClustersListResponse,
  IngestEventsListResponse,
} from "@/types/api";

export const queryKeys = {
  // TODO: Re-enable pagination when backend supports it
  // clusters: (limit?: number, offset?: number) =>
  //   ["clusters", { limit, offset }] as const,
  clusters: () => ["clusters"] as const,
  // ingestEvents: (limit?: number, offset?: number, status?: string) =>
  //   ["ingest-events", { limit, offset, status }] as const,
  ingestEvents: (status?: string) => ["ingest-events", { status }] as const,
};

export const useClusters = () => {
  // TODO: Re-enable pagination when backend supports it
  // export function useClusters(limit = 100, offset = 0) {
  return useQuery<ClustersListResponse>({
    queryKey: queryKeys.clusters(),
    queryFn: async () => {
      // const params = new URLSearchParams();
      // if (limit !== undefined) params.append("limit", limit.toString());
      // if (offset !== undefined) params.append("offset", offset.toString());
      // const queryString = params.toString();
      return apiClient.get<ClustersListResponse>(`/clusters`);
    },
  });
};

export const useIngestEvents = (status?: string) => {
  // TODO: Re-enable pagination when backend supports it
  // export function useIngestEvents(limit = 5, offset = 0, status?: string) {
  return useQuery<IngestEventsListResponse>({
    queryKey: queryKeys.ingestEvents(status),
    queryFn: async () => {
      const params = new URLSearchParams();
      // if (limit !== undefined) params.append("limit", limit.toString());
      // if (offset !== undefined) params.append("offset", offset.toString());
      if (status) params.append("status", status);
      const queryString = params.toString();
      return apiClient.get<IngestEventsListResponse>(
        `/ingest/events${queryString ? `?${queryString}` : ""}`
      );
    },
  });
};
