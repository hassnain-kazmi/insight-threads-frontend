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

export type IngestionSource = "rss" | "hackernews" | "github";

export interface RSSParams {
  feed_urls: string[];
  limit?: number;
}

export interface HackerNewsParams {
  endpoint?: "topstories" | "newstories" | "beststories";
  limit?: number;
}

export interface GitHubParams {
  owner: string;
  repo: string;
  include_commits?: boolean;
  include_issues?: boolean;
  include_prs?: boolean;
  include_releases?: boolean;
  limit_per_type?: number;
  commit_since?: string;
  issue_state?: "open" | "closed" | "all";
  pr_state?: "open" | "closed" | "all";
}

export interface TriggerIngestionRequest {
  source: IngestionSource;
  source_params: RSSParams | HackerNewsParams | GitHubParams;
}

export interface TriggerIngestionResponse {
  ingest_event_id: string;
  task_id: string;
  status: string;
}
