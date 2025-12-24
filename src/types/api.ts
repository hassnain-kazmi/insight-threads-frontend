export interface ClusterResponse {
  id: string;
  user_id: string;
  document_count: number;
  avg_sentiment: number | null;
  trending_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface ClustersListResponse {
  clusters: ClusterResponse[];
  total: number;
}

export interface IngestEventResponse {
  id: string;
  user_id: string;
  source: "rss" | "hackernews" | "github" | null;
  started_at: string;
  completed_at: string | null;
  status: "pending" | "running" | "completed" | "failed";
  error_message: string | null;
  updated_at: string;
}

export interface IngestEventsListResponse {
  events: IngestEventResponse[];
  total: number;
}
