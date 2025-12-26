import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { InsightResponse } from "@/types/api";
import { Lightbulb, Layers, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDateTime } from "@/lib/utils";

interface InsightCardProps {
  insight: InsightResponse;
}

const getConfidenceColor = (
  confidence: number | null
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
  const confidenceInfo = getConfidenceColor(insight.confidence);

  return (
    <Card className="hover:shadow-md transition-all duration-200 border-border/50 hover:border-border">
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
      <CardContent className="space-y-4">
        <p className="text-foreground leading-relaxed">
          {insight.insight_text}
        </p>

        <Link
          to={`/clusters/${insight.cluster_id}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <Layers className="w-4 h-4 group-hover:text-violet-500 transition-colors" />
          <span className="font-medium">
            View Cluster #{insight.cluster_id.slice(0, 8)}
          </span>
        </Link>
      </CardContent>
    </Card>
  );
};
