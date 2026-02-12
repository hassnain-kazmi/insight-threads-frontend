import type { DocumentFilters, AnomalyFilters } from "@/types/api";

export const queryKeys = {
  auth: ["auth"] as const,
  clusters: ["clusters"] as const,
  cluster: (id: string) => ["clusters", id] as const,
  documents: (filters: DocumentFilters) => ["documents", filters] as const,
  document: (id: string) => ["documents", id] as const,
  ingestEvents: (filters?: {
    status?: string;
    limit?: number;
    offset?: number;
  }) => ["ingest-events", filters] as const,
  ingestEvent: (id: string) => ["ingest-events", id] as const,
  insights: (filters?: { cluster_id?: string }) =>
    ["insights", filters] as const,
  anomalies: (filters: AnomalyFilters) => ["anomalies", filters] as const,
  search: (query: string, threshold?: number) =>
    ["search", query, threshold] as const,
  umapDocuments: (limit?: number) => ["umap", "documents", limit] as const,
  umapCluster: (clusterId: string) => ["umap", "clusters", clusterId] as const,
} as const;
