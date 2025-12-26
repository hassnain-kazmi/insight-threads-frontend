import { InsightCard } from "./InsightCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useInsights } from "@/hooks/useInsights";
import { Lightbulb } from "lucide-react";

interface InsightListProps {
  clusterId?: string;
}

export const InsightList = ({ clusterId }: InsightListProps) => {
  const { data, isLoading, error } = useInsights(clusterId);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-6 space-y-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Skeleton className="h-5 w-5 rounded" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <Skeleton className="h-6 w-16 rounded-full flex-shrink-0" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-4 w-40" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <h3 className="text-lg font-medium text-foreground mb-2">
          Error loading insights
        </h3>
        <p className="text-muted-foreground">
          {error instanceof Error ? error.message : "Failed to load insights"}
        </p>
      </div>
    );
  }

  if (!data || data.insights.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
          <Lightbulb className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          No insights found
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          {clusterId
            ? "No insights have been generated for this cluster yet."
            : "Insights are generated after your documents are clustered and analyzed."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {data.insights.map((insight) => (
        <InsightCard key={insight.id} insight={insight} />
      ))}
    </div>
  );
};
