import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressRing } from "@/components/ui/progress-ring";
import { TrendingUp, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ClusterResponse } from "@/types/api";
import { getClusterDisplayName } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { TRENDING_HOT_THRESHOLD } from "@/constants";

interface TrendingClustersHeroProps {
  clusters: ClusterResponse[];
  isLoading?: boolean;
}

export const TrendingClustersHero = ({
  clusters,
  isLoading,
}: TrendingClustersHeroProps) => {
  const navigate = useNavigate();

  const trendingClusters = useMemo(() => {
    return clusters
      .filter((c) => (c.trending_score ?? 0) > TRENDING_HOT_THRESHOLD)
      .sort((a, b) => (b.trending_score ?? 0) - (a.trending_score ?? 0))
      .slice(0, 3);
  }, [clusters]);

  if (isLoading) {
    return (
      <Card className="border-border/50 bg-gradient-to-br from-amber-50/50 via-orange-50/50 to-red-50/50 dark:from-amber-950/10 dark:via-orange-950/10 dark:to-red-950/10">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              <div className="h-3 w-48 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (trendingClusters.length === 0) {
    return (
      <Card className="border-border/50 bg-gradient-to-br from-amber-50/50 via-orange-50/50 to-red-50/50 dark:from-amber-950/10 dark:via-orange-950/10 dark:to-red-950/10">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center mb-4">
            <TrendingUp className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No highly trending clusters yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Clusters need a trending score above 90% to appear here. Keep
            ingesting data to see trending topics emerge.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {trendingClusters.map((cluster, index) => {
        const trendingScore = cluster.trending_score ?? 0;
        const trendingPercent = Math.round(trendingScore * 100);
        const displayName = getClusterDisplayName(cluster.id, []);

        return (
          <Card
            key={cluster.id}
            className={cn(
              "group cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-500 border-border/50",
              "bg-gradient-to-br from-amber-50/80 via-orange-50/80 to-red-50/80 dark:from-amber-950/20 dark:via-orange-950/20 dark:to-red-950/20",
              "animate-in fade-in-0 slide-in-from-bottom-4",
            )}
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => navigate(`/clusters/${cluster.id}`)}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0 relative">
                  <ProgressRing
                    value={trendingPercent}
                    size={80}
                    strokeWidth={10}
                    color="#f59e0b"
                    showLabel
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    {index === 0 && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] uppercase tracking-wide"
                      >
                        Top trend
                      </Badge>
                    )}
                    <h3 className="text-lg font-semibold text-foreground truncate">
                      {displayName}
                    </h3>
                    <Badge
                      variant="default"
                      className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0"
                    >
                      {trendingPercent}% Trending
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      <span className="font-semibold text-foreground">
                        {cluster.document_count}
                      </span>{" "}
                      documents
                    </span>
                    {cluster.avg_sentiment !== null && (
                      <span>
                        Sentiment:{" "}
                        <span className="font-semibold text-foreground">
                          {cluster.avg_sentiment > 0 ? "+" : ""}
                          {cluster.avg_sentiment.toFixed(2)}
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-amber-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
