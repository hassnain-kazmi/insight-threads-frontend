import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ClusterResponse } from "@/types/api";
import { TrendingUp, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ClusterCardProps {
  cluster: ClusterResponse;
}

export const ClusterCard = ({ cluster }: ClusterCardProps) => {
  const navigate = useNavigate();
  const trendingScore = cluster.trending_score ?? 0;
  const trendingPercent = Math.round(trendingScore * 100);

  const sentiment = cluster.avg_sentiment;
  const sentimentVariant =
    sentiment === null
      ? "neutral"
      : sentiment > 0.1
      ? "positive"
      : sentiment < -0.1
      ? "negative"
      : "neutral";

  const sentimentLabel =
    sentiment === null
      ? "Neutral"
      : sentiment > 0.1
      ? "Positive"
      : sentiment < -0.1
      ? "Negative"
      : "Neutral";

  return (
    <Card
      className="hover:shadow-md transition-all duration-200 cursor-pointer group border-border/50 hover:border-border"
      onClick={() => navigate(`/clusters/${cluster.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span className="text-sm font-medium text-muted-foreground truncate">
                Cluster #{cluster.id.slice(0, 8)}
              </span>
            </div>
          </div>
          <Badge variant={sentimentVariant} className="flex-shrink-0">
            {sentimentLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Trending Score</span>
            <span className="font-semibold text-foreground">
              {trendingPercent}%
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-500 ease-out"
              style={{ width: `${trendingPercent}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            <span className="font-semibold text-foreground">
              {cluster.document_count}
            </span>{" "}
            {cluster.document_count === 1 ? "document" : "documents"}
          </span>
        </div>

        {sentiment !== null && (
          <div className="text-xs text-muted-foreground">
            Avg sentiment:{" "}
            <span className="font-medium text-foreground">
              {sentiment.toFixed(2)}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
