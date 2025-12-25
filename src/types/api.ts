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

export interface DocumentSentimentResponse {
  vader: number | null;
  distilbert_score: number | null;
  distilbert_label: string | null;
  combined_score: number | null;
}

export interface ClusterMembershipResponse {
  cluster_id: string;
  membership_strength: number | null;
}

export interface DocumentResponse {
  id: string;
  user_id: string | null;
  ingest_event_id: string | null;
  source_path: string | null;
  title: string | null;
  processed: boolean;
  processed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentDetailResponse extends DocumentResponse {
  raw_text: string | null;
  sentiment: DocumentSentimentResponse | null;
  cluster_memberships: ClusterMembershipResponse[];
}

export interface DocumentsListResponse {
  documents: DocumentResponse[];
  total: number;
}

export interface DocumentFilters {
  limit?: number;
  offset?: number;
  processed?: boolean;
  ingest_event_id?: string;
  cluster_id?: string;
  source_type?: "rss" | "hackernews" | "github";
  sentiment_min?: number;
  sentiment_max?: number;
}

export interface KeywordResponse {
  id: string;
  keyword: string;
  weight: number | null;
  created_at: string;
}

export interface TimeseriesSummaryResponse {
  id: string;
  summary_date: string;
  mention_count: number;
  avg_sentiment: number | null;
  momentum: number | null;
  forecast_lower: number | null;
  forecast_upper: number | null;
  created_at: string;
}

export interface InsightResponse {
  id: string;
  cluster_id: string;
  insight_text: string;
  confidence: number | null;
  generated_at: string;
  llm_metadata: string | null;
}

export interface AnomalyResponse {
  id: string;
  cluster_id: string;
  anomaly_date: string;
  score: number;
  type: string | null;
  anomaly_metadata: object | null;
  created_at: string;
}

export interface ClusterDetailResponse extends ClusterResponse {
  keywords: KeywordResponse[];
  timeseries: TimeseriesSummaryResponse[];
  insights: InsightResponse[];
  anomalies: AnomalyResponse[];
}

export interface InsightsListResponse {
  insights: InsightResponse[];
  total: number;
}

export interface AnomaliesListResponse {
  anomalies: AnomalyResponse[];
  total: number;
}

export interface AnomalyFilters {
  cluster_id?: string;
  anomaly_type?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}
