import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { InsightResponse } from "@/types/api";
import { Lightbulb, Layers, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDateTime, getClusterDisplayName } from "@/lib/utils";
import { useCluster } from "@/hooks/useClusters";

interface InsightCardProps {
  insight: InsightResponse;
}

const getConfidenceColor = (
  confidence: number | null,
): {
  variant: "default" | "secondary" | "positive" | "neutral";
  label: string;
} => {
  if (confidence === null) {
    return { variant: "neutral", label: "N/A" };
  }
  const percent = Math.round(confidence * 100);
  if (percent >= 80) {
    return { variant: "positive", label: `${percent}%` };
  }
  if (percent >= 60) {
    return { variant: "default", label: `${percent}%` };
  }
  return { variant: "secondary", label: `${percent}%` };
};

export const InsightCard = ({ insight }: InsightCardProps) => {
  const { data: clusterDetail } = useCluster(insight.cluster_id);
  const clusterDisplayName = getClusterDisplayName(
    insight.cluster_id,
    clusterDetail?.keywords,
  );
  const confidenceInfo = getConfidenceColor(insight.confidence);
  const isHighConfidence =
    insight.confidence !== null && insight.confidence >= 0.8;

  return (
    <Card
      className={`h-full hover:shadow-md transition-all duration-200 border-border/50 hover:border-border flex flex-col ${
        isHighConfidence ? "border-violet-300/80 dark:border-violet-600/60" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-violet-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                <span className="truncate">
                  {formatDateTime(insight.generated_at)}
                </span>
              </div>
            </div>
          </div>
          <Badge variant={confidenceInfo.variant} className="flex-shrink-0">
            {confidenceInfo.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col">
        <p className="text-foreground leading-relaxed flex-1">
          {insight.insight_text}
        </p>

        <Link
          to={`/clusters/${insight.cluster_id}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group mt-auto"
        >
          <Layers className="w-4 h-4 group-hover:text-violet-500 transition-colors" />
          <span className="font-medium">View {clusterDisplayName}</span>
        </Link>
      </CardContent>
    </Card>
  );
};
