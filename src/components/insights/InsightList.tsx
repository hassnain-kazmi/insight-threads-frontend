import { useMemo } from "react";
import { InsightCard } from "./InsightCard";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { useInsights } from "@/hooks/useInsights";
import {
  getErrorMessage,
  calculatePagination,
  getClusterDisplayName,
} from "@/lib/utils";
import { Lightbulb, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { DEFAULT_PAGE_SIZE } from "@/constants";

interface InsightListProps {
  clusterId?: string;
  selectedClusterName?: string;
  searchQuery?: string;
  limit?: number;
  offset?: number;
  onPageChange?: (page: number) => void;
}

export const InsightList = ({
  clusterId,
  selectedClusterName,
  searchQuery = "",
  limit = DEFAULT_PAGE_SIZE,
  offset = 0,
  onPageChange,
}: InsightListProps) => {
  const { data, isLoading, error } = useInsights(clusterId);

  const filteredInsights = useMemo(() => {
    if (!data || !searchQuery.trim()) {
      return data?.insights || [];
    }
    const query = searchQuery.toLowerCase();
    return data.insights.filter((insight) =>
      insight.insight_text.toLowerCase().includes(query),
    );
  }, [data, searchQuery]);

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
          {getErrorMessage(error) || "Failed to load insights"}
        </p>
      </div>
    );
  }

  if (!data || data.insights.length === 0) {
    return (
      <EmptyState
        icon={Lightbulb}
        title="No insights found"
        description={
          clusterId
            ? "No insights have been generated for this cluster yet."
            : "Insights are generated after your documents are clustered and analyzed."
        }
      />
    );
  }

  if (filteredInsights.length === 0 && searchQuery.trim()) {
    return (
      <EmptyState
        icon={Search}
        title="No matching insights"
        description={`No insights match your search query "${searchQuery}". Try a different search term.`}
      />
    );
  }

  const total = filteredInsights.length;
  const { currentPage, totalPages, startItem, endItem } = calculatePagination(
    offset,
    limit,
    total,
  );
  const paginatedInsights = filteredInsights.slice(offset, offset + limit);

  return (
    <div className="space-y-4">
      {searchQuery.trim() && (
        <p className="text-sm text-muted-foreground">
          Showing {filteredInsights.length} of {data.insights.length} insights
        </p>
      )}
      {clusterId && (
        <p className="text-xs text-muted-foreground">
          Cluster scope:{" "}
          {selectedClusterName ?? getClusterDisplayName(clusterId)}
        </p>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {paginatedInsights.map((insight, index) => (
          <div
            key={insight.id}
            className="animate-in fade-in-0 slide-in-from-bottom-2 h-full"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <InsightCard insight={insight} />
          </div>
        ))}
      </div>
      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startItem}–{endItem} of {total} insights
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground tabular-nums">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
