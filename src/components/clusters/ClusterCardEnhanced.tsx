import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressRing } from "@/components/ui/progress-ring";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ClusterResponse } from "@/types/api";
import { TrendingUp, FileText, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getSentimentInfo, getClusterDisplayName } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ClusterCardEnhancedProps {
  cluster: ClusterResponse;
  index?: number;
}

export const ClusterCardEnhanced = ({
  cluster,
  index = 0,
}: ClusterCardEnhancedProps) => {
  const navigate = useNavigate();
  const trendingScore = cluster.trending_score ?? 0;
  const trendingPercent = Math.round(trendingScore * 100);

  const sentiment = cluster.avg_sentiment;
  const {
    variant: sentimentVariant,
    label: sentimentLabel,
    description: sentimentDescription,
  } = getSentimentInfo(sentiment);

  const displayName = getClusterDisplayName(cluster.id, []);

  const getGradientClass = () => {
    if (trendingPercent >= 90) {
      return "from-amber-50/50 via-orange-50/50 to-red-50/50 dark:from-amber-950/20 dark:via-orange-950/20 dark:to-red-950/20";
    } else if (trendingPercent >= 70) {
      return "from-amber-50/30 via-yellow-50/30 to-amber-50/30 dark:from-amber-950/10 dark:via-yellow-950/10 dark:to-amber-950/10";
    } else if (trendingPercent >= 50) {
      return "from-blue-50/20 via-cyan-50/20 to-blue-50/20 dark:from-blue-950/10 dark:via-cyan-950/10 dark:to-blue-950/10";
    }
    return "from-slate-50/10 via-gray-50/10 to-slate-50/10 dark:from-slate-950/5 dark:via-gray-950/5 dark:to-slate-950/5";
  };

  return (
    <Card
      className={cn(
        "h-full flex flex-col hover:shadow-xl hover:scale-[1.02] transition-all duration-500 cursor-pointer group",
        "border-border/50 bg-gradient-to-br",
        getGradientClass(),
        "animate-in fade-in-0 slide-in-from-bottom-4"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={() => navigate(`/clusters/${cluster.id}`)}
    >
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <TrendingUp className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="text-sm font-semibold text-foreground truncate">
                {displayName}
              </span>
              {trendingPercent >= 90 && (
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse flex-shrink-0" />
              )}
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant={sentimentVariant}
                  className="flex-shrink-0 text-xs"
                >
                  {sentimentLabel}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{sentimentDescription}</p>
                {sentiment !== null && (
                  <p className="text-xs mt-1">Score: {sentiment.toFixed(3)}</p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-xs text-muted-foreground cursor-help">
                    Trending Score
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Trending score (0-100%) indicates how much activity and
                    momentum this topic has. Higher scores mean more trending.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="text-lg font-bold text-foreground">
              {trendingPercent}%
            </span>
          </div>

          <div className="flex justify-center py-2">
            <ProgressRing
              value={trendingPercent}
              size={80}
              strokeWidth={10}
              color={
                trendingPercent >= 90
                  ? "#f59e0b"
                  : trendingPercent >= 70
                  ? "#eab308"
                  : trendingPercent >= 50
                  ? "#3b82f6"
                  : "#6b7280"
              }
              showLabel
            />
          </div>

          <div className="h-2 bg-muted rounded-full overflow-hidden relative">
            <div
              className={cn(
                "h-full transition-all duration-700 ease-out relative overflow-hidden",
                trendingPercent >= 90
                  ? "bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"
                  : trendingPercent >= 70
                  ? "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600"
                  : trendingPercent >= 50
                  ? "bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"
                  : "bg-gradient-to-r from-slate-400 via-slate-500 to-slate-600"
              )}
              style={{ width: `${trendingPercent}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-border/50">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="w-4 h-4" />
              <span>Documents</span>
            </div>
            <span className="font-semibold text-foreground">
              {cluster.document_count}
            </span>
          </div>
          {sentiment !== null && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Avg Sentiment</span>
              <span className="font-semibold text-foreground">
                {sentiment > 0 ? "+" : ""}
                {sentiment.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center pt-2 border-t border-border/50">
          <div className="flex items-center gap-2 text-xs text-muted-foreground group-hover:text-primary transition-colors">
            <span>View details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
