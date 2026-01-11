import { MetricCard } from "@/components/ui/metric-card";
import { Sparkline } from "@/components/ui/sparkline";
import { FileText, Layers, TrendingUp, Lightbulb } from "lucide-react";
import { useClusters } from "@/hooks/useClusters";
import { useIngestEvents } from "@/hooks/useIngest";
import { useInsights } from "@/hooks/useInsights";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

export const StatsCards = () => {
  const navigate = useNavigate();
  const { data: clustersData, isLoading: clustersLoading } = useClusters();
  const { isLoading: ingestLoading } = useIngestEvents();
  const { data: insightsData, isLoading: insightsLoading } = useInsights();

  const isLoading = clustersLoading || ingestLoading;

  const insightsCount = insightsData?.total ?? 0;

  const clusterStats = useMemo(() => {
    if (!clustersData) {
      return { totalClusters: 0, totalDocuments: 0, trendingClusters: 0 };
    }
    const totalClusters = clustersData.total ?? 0;
    const totalDocuments = clustersData.clusters.reduce(
      (sum, cluster) => sum + cluster.document_count,
      0
    );
    const trendingClusters = clustersData.clusters.filter(
      (c) => (c.trending_score ?? 0) > 0.9
    ).length;
    return { totalClusters, totalDocuments, trendingClusters };
  }, [clustersData]);

  const { totalClusters, totalDocuments, trendingClusters } = clusterStats;

  const trendingSparkline = useMemo(() => {
    if (!clustersData) return [];
    return clustersData.clusters
      .slice(0, 10)
      .map((c) => (c.trending_score ?? 0) * 100);
  }, [clustersData]);

  const documentTrend = useMemo(() => {
    if (!clustersData) return [];
    return clustersData.clusters.slice(0, 10).map((c) => c.document_count);
  }, [clustersData]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        {
          label: "Total Documents",
          value: isLoading ? "—" : totalDocuments.toLocaleString(),
          icon: FileText,
          color: "text-blue-500",
          isLoading,
          tooltip:
            "Total number of documents ingested across all sources (RSS, Hacker News, GitHub)",
          onClick: () => navigate("/documents"),
          delay: 0,
          sparkline:
            documentTrend.length > 0 ? (
              <Sparkline
                data={documentTrend}
                color="#3b82f6"
                width={80}
                height={24}
              />
            ) : undefined,
        },
        {
          label: "Active Clusters",
          value: isLoading ? "—" : totalClusters,
          icon: Layers,
          color: "text-emerald-500",
          isLoading,
          tooltip:
            "Number of topic clusters identified from your documents. Clusters group related content together.",
          onClick: () => navigate("/clusters"),
          delay: 50,
        },
        {
          label: "Trending Topics",
          value: isLoading ? "—" : trendingClusters,
          icon: TrendingUp,
          color: "text-amber-500",
          isLoading,
          tooltip:
            "Clusters with a trending score above 90%. These are the most active and trending topics in your data.",
          onClick: () => navigate("/clusters"),
          delay: 100,
          sparkline:
            trendingSparkline.length > 0 ? (
              <Sparkline
                data={trendingSparkline}
                color="#f59e0b"
                width={80}
                height={24}
              />
            ) : undefined,
        },
        {
          label: "Insights Generated",
          value: insightsLoading ? "—" : insightsCount,
          icon: Lightbulb,
          color: "text-violet-500",
          isLoading: insightsLoading,
          tooltip:
            "Total number of AI-generated insights across all clusters. Insights provide high-level summaries and patterns.",
          onClick: () => navigate("/insights"),
          delay: 150,
        },
      ].map((card) => (
        <div
          key={card.label}
          className="animate-in fade-in-0 slide-in-from-bottom-4 h-full"
          style={{ animationDelay: `${card.delay}ms` }}
        >
          <MetricCard {...card} />
        </div>
      ))}
    </div>
  );
};
