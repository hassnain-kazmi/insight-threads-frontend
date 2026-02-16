import { StatsCards } from "@/components/dashboard/StatsCards";
import { TrendingClustersHero } from "@/components/dashboard/TrendingClustersHero";
import { RecentIngestions } from "@/components/dashboard/RecentIngestions";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useClusters } from "@/hooks/useClusters";
import {
  LayoutDashboard,
  ArrowRight,
  Download,
  Sparkles,
  TrendingUp,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { TRENDING_HOT_THRESHOLD } from "@/constants";
import {
  getErrorMessage,
  formatRelativeTime,
  getSourceDisplayName,
} from "@/lib/utils";
import { useIngestEvents } from "@/hooks/useIngest";

export const DashboardPage = () => {
  const { data, isLoading, error } = useClusters();
  const { data: ingestEventsData } = useIngestEvents({ limit: 5 });
  const navigate = useNavigate();

  const trendingClusters = useMemo(() => {
    if (!data) return [];
    return data.clusters.filter(
      (c) => (c.trending_score ?? 0) > TRENDING_HOT_THRESHOLD,
    );
  }, [data]);

  const heroSummary = useMemo(() => {
    if (!data || !data.clusters.length) {
      return "No clusters yet. Ingest data to start seeing trends and insights.";
    }
    const totalClusters = data.total ?? data.clusters.length;
    const totalDocuments = data.clusters.reduce(
      (sum, cluster) => sum + cluster.document_count,
      0,
    );
    const lastEvent = ingestEventsData?.events?.[0];
    if (!lastEvent) {
      return `You have ${totalDocuments.toLocaleString()} documents across ${totalClusters} clusters. Trigger a new ingestion to keep things fresh.`;
    }
    const sourceLabel = getSourceDisplayName(lastEvent.source);
    const when = formatRelativeTime(lastEvent.started_at);
    return `You have ${totalDocuments.toLocaleString()} documents across ${totalClusters} clusters. Last ${sourceLabel.toLowerCase()} ingestion started ${when}.`;
  }, [data, ingestEventsData]);

  return (
    <div className="space-y-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 dark:from-teal-950/15 dark:via-blue-950/15 dark:to-indigo-950/15 border border-teal-200/50 dark:border-teal-800/50 p-8 md:p-12">
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-white/80 dark:bg-teal-900/30 backdrop-blur-sm border border-teal-200/50 dark:border-teal-700/50 shadow-lg animate-in zoom-in-0 duration-500">
                    <Sparkles className="w-6 h-6 text-teal-600 dark:text-teal-400 animate-pulse" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-600 dark:from-teal-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent animate-in slide-in-from-left-4 duration-700">
                      Turn noise into narratives
                    </h1>
                    <p
                      className="text-teal-700/80 dark:text-teal-300/80 mt-1 text-sm md:text-base animate-in slide-in-from-left-4 duration-700"
                      style={{ animationDelay: "100ms" }}
                    >
                      Your intelligent command center for data insights
                    </p>
                  </div>
                </div>
                <div
                  className="mt-4 flex flex-wrap gap-2 text-xs md:text-sm text-teal-900/80 dark:text-teal-100/80 animate-in fade-in-0 slide-in-from-bottom-2 duration-700"
                  style={{ animationDelay: "150ms" }}
                >
                  <button
                    type="button"
                    onClick={() => navigate("/ingest")}
                    className="px-3 py-1 rounded-full border border-teal-200/60 dark:border-teal-700/60 bg-white/70 dark:bg-teal-900/40 hover:bg-white dark:hover:bg-teal-900/60 transition-colors"
                  >
                    <span className="font-medium">Step 1</span> · Ingest data
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/clusters")}
                    className="px-3 py-1 rounded-full border border-teal-200/40 dark:border-teal-700/40 bg-white/50 dark:bg-teal-900/30 hover:bg-white dark:hover:bg-teal-900/50 transition-colors"
                  >
                    <span className="font-medium">Step 2</span> · Explore
                    clusters
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/anomalies")}
                    className="px-3 py-1 rounded-full border border-teal-200/40 dark:border-teal-700/40 bg-white/40 dark:bg-teal-900/20 hover:bg-white dark:hover:bg-teal-900/40 transition-colors"
                  >
                    <span className="font-medium">Step 3</span> · Monitor
                    anomalies
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/insights")}
                    className="px-3 py-1 rounded-full border border-teal-200/40 dark:border-teal-700/40 bg-white/30 dark:bg-teal-900/20 hover:bg-white dark:hover:bg-teal-900/40 transition-colors"
                  >
                    <span className="font-medium">Step 4</span> · Review
                    insights
                  </button>
                </div>
                {heroSummary && (
                  <p className="mt-3 text-xs md:text-sm text-teal-900/70 dark:text-teal-100/70">
                    {heroSummary}
                  </p>
                )}
                <div
                  className="flex flex-wrap gap-2 mt-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-700"
                  style={{ animationDelay: "200ms" }}
                >
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/60 dark:bg-teal-900/20 backdrop-blur-sm border border-teal-200/50 dark:border-teal-700/50 hover:bg-white/80 transition-colors">
                    <TrendingUp className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span className="text-sm font-medium text-teal-900 dark:text-teal-100">
                      Trending Analysis
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/60 dark:bg-teal-900/20 backdrop-blur-sm border border-teal-200/50 dark:border-teal-700/50 hover:bg-white/80 transition-colors">
                    <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span className="text-sm font-medium text-teal-900 dark:text-teal-100">
                      AI Insights
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/60 dark:bg-teal-900/20 backdrop-blur-sm border border-teal-200/50 dark:border-teal-700/50 hover:bg-white/80 transition-colors">
                    <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span className="text-sm font-medium text-teal-900 dark:text-teal-100">
                      Real-time Monitoring
                    </span>
                  </div>
                </div>
              </div>
              {trendingClusters.length > 0 && (
                <div
                  className="flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-br from-amber-100/80 to-orange-100/80 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200/50 dark:border-amber-700/50 backdrop-blur-sm animate-in slide-in-from-right-4 duration-700"
                  style={{ animationDelay: "300ms" }}
                >
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-700 dark:text-amber-400">
                      {trendingClusters.length}
                    </div>
                    <div className="text-xs text-amber-600 dark:text-amber-500 font-medium">
                      Hot Topics
                    </div>
                  </div>
                  <div className="h-12 w-px bg-amber-300/50 dark:bg-amber-700/50" />
                  <div className="text-sm text-amber-900 dark:text-amber-100">
                    <div className="font-semibold">90%+ Trending</div>
                    <div className="text-xs opacity-80">Highly active</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400/15 dark:bg-teal-500/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-400/15 dark:bg-blue-500/8 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-400/10 dark:bg-indigo-500/6 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div
          className="animate-in fade-in-0 slide-in-from-top-4 duration-700"
          style={{ animationDelay: "200ms" }}
        >
          <StatsCards />
        </div>

        <div
          className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-700"
          style={{ animationDelay: "500ms" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-500" />
                Highly Trending Clusters
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {trendingClusters.length > 0
                  ? `Top ${Math.min(
                      trendingClusters.length,
                      3,
                    )} topics are heating up right now.`
                  : "Topics with 90%+ trending score - the most active in your data"}
              </p>
            </div>
            {!isLoading && data && data.clusters.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/clusters")}
                className="text-sm group"
              >
                View all clusters
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </div>

          {isLoading ? (
            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-muted animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="border-border/50">
              <CardContent className="p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Failed to load clusters: {getErrorMessage(error)}
                </p>
              </CardContent>
            </Card>
          ) : !data || data.clusters.length === 0 ? (
            <EmptyState
              icon={LayoutDashboard}
              title="No clusters yet"
              description="Trigger your first ingestion to start seeing trending clusters and document analytics."
              action={
                <Button
                  onClick={() => navigate("/ingest")}
                  size="sm"
                  className="group"
                >
                  <Download className="w-4 h-4 mr-2 group-hover:translate-y-0.5 transition-transform" />
                  Go to Ingestion
                </Button>
              }
            />
          ) : (
            <TrendingClustersHero
              clusters={data.clusters}
              isLoading={isLoading}
            />
          )}
        </div>

        <div
          className="space-y-4 animate-in fade-in-0 slide-in-from-right-4 duration-700"
          style={{ animationDelay: "300ms" }}
        >
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Recent Activity
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Latest ingestion events
            </p>
          </div>
          <RecentIngestions />
        </div>
      </div>
  );
};
