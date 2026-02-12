import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SentimentGauge } from "@/components/ui/sentiment-gauge";
import { ProgressRing } from "@/components/ui/progress-ring";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TrendingUp, FileText, Activity, Info } from "lucide-react";
import type { ClusterDetailResponse } from "@/types/api";

interface ClusterDetailMetricsProps {
  cluster: ClusterDetailResponse;
  sentimentVariant: "positive" | "negative" | "neutral";
  sentimentLabel: string;
  sentimentDescription: string;
  momentumInfo: { label: string; description: string };
  latestMomentum: number | null;
}

export const ClusterDetailMetrics = ({
  cluster,
  sentimentVariant,
  sentimentLabel,
  sentimentDescription,
  momentumInfo,
  latestMomentum,
}: ClusterDetailMetricsProps) => {
  const trendingScore = cluster.trending_score ?? 0;
  const trendingPercent = Math.round(trendingScore * 100);
  const sentiment = cluster.avg_sentiment;

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="animate-in fade-in-0 slide-in-from-bottom-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              Trending Score
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="text-muted-foreground hover:text-foreground"
                    type="button"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Trending score (0-100%) indicates how much activity and
                    momentum this topic has. Higher scores mean more trending.
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-3">
              <ProgressRing
                value={trendingPercent}
                size={100}
                strokeWidth={10}
                color="#f59e0b"
                showLabel
              />
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-500 ease-out"
                  style={{ width: `${trendingPercent}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="animate-in fade-in-0 slide-in-from-bottom-2"
          style={{ animationDelay: "50ms" }}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-semibold text-foreground">
              {cluster.document_count}
            </span>
          </CardContent>
        </Card>

        <Card
          className="animate-in fade-in-0 slide-in-from-bottom-2"
          style={{ animationDelay: "100ms" }}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              Avg Sentiment
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="text-muted-foreground hover:text-foreground"
                    type="button"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{sentimentDescription}</p>
                  {sentiment !== null && (
                    <p className="text-xs mt-1">
                      Score: {sentiment.toFixed(3)} (range: -1 to +1)
                    </p>
                  )}
                </TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sentiment !== null ? (
              <div className="flex flex-col items-center gap-3">
                <SentimentGauge value={sentiment} size={100} />
                <Badge variant={sentimentVariant} className="text-xs">
                  {sentimentLabel}
                </Badge>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">N/A</span>
            )}
          </CardContent>
        </Card>

        <Card
          className="animate-in fade-in-0 slide-in-from-bottom-2"
          style={{ animationDelay: "150ms" }}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Momentum
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="text-muted-foreground hover:text-foreground"
                    type="button"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{momentumInfo.description}</p>
                  {latestMomentum !== null && (
                    <p className="text-xs mt-1">
                      Value: {latestMomentum > 0 ? "+" : ""}
                      {latestMomentum.toFixed(3)}
                    </p>
                  )}
                </TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {latestMomentum !== null ? (
              <div className="flex items-center gap-2">
                <TrendingUp
                  className={`w-5 h-5 ${
                    latestMomentum > 0
                      ? "text-green-500"
                      : latestMomentum < 0
                        ? "text-red-500"
                        : "text-muted-foreground"
                  }`}
                />
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-foreground">
                    {momentumInfo.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {latestMomentum > 0 ? "+" : ""}
                    {latestMomentum.toFixed(2)}
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">N/A</span>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};
