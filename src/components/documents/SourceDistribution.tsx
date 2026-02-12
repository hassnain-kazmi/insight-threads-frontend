import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { FileText, Github, Newspaper, Rss } from "lucide-react";
import type { DocumentResponse } from "@/types/api";
import { getDocumentSourceType } from "@/lib/utils";
import { useIngestEventSourceMap } from "@/hooks/useIngest";

interface SourceDistributionProps {
  documents: DocumentResponse[];
}

const sourceConfig = {
  rss: { icon: Rss, color: "#3b82f6", label: "RSS Feeds" },
  hackernews: { icon: Newspaper, color: "#f59e0b", label: "Hacker News" },
  github: { icon: Github, color: "#6b7280", label: "GitHub" },
  unknown: { icon: FileText, color: "#9ca3af", label: "Unknown" },
};

export const SourceDistribution = ({ documents }: SourceDistributionProps) => {
  const { sourceMap, isLoading: isLoadingEvents } = useIngestEventSourceMap({
    limit: 500,
  });

  const distribution = useMemo(() => {
    const counts: Record<string, number> = {
      rss: 0,
      hackernews: 0,
      github: 0,
      unknown: 0,
    };

    documents.forEach((doc) => {
      const sourceType = getDocumentSourceType(doc, sourceMap);
      if (sourceType in counts) {
        counts[sourceType] = (counts[sourceType] || 0) + 1;
      } else {
        counts.unknown = (counts.unknown || 0) + 1;
      }
    });

    const total = documents.length;
    return Object.entries(counts)
      .filter(([, count]) => count > 0)
      .map(([type, count]) => ({
        type: type as keyof typeof sourceConfig,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
      }));
  }, [documents, sourceMap]);

  const total = documents.length;

  if (isLoadingEvents) {
    return null;
  }

  if (total === 0 || distribution.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Source Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {distribution.map(({ type, count, percentage }) => {
            const config = sourceConfig[type];
            if (!config) return null;
            const Icon = config.icon;
            return (
              <div key={type} className="flex flex-col items-center gap-2">
                <ProgressRing
                  value={percentage}
                  size={70}
                  strokeWidth={8}
                  color={config.color}
                  showLabel
                />
                <div className="flex items-center gap-1.5 text-xs">
                  <Icon
                    className="w-3.5 h-3.5"
                    style={{ color: config.color }}
                  />
                  <span className="font-medium">{config.label}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {count} {count === 1 ? "doc" : "docs"}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
