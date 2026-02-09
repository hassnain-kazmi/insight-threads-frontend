import { Search, ExternalLink, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSearch } from "@/hooks/useSearch";
import type { DocumentSearchResult } from "@/types/api";
import { formatDistanceToNow } from "date-fns";
import {
  getRelevancePercentage,
  getRelevanceDescription,
  getErrorMessage,
} from "@/lib/utils";

interface SearchResultsProps {
  query: string;
  similarityThreshold?: number;
  onResultClick: (documentId: string) => void;
}

const getRelevanceColor = (percentage: number): string => {
  if (percentage >= 80) return "text-emerald-600 dark:text-emerald-400";
  if (percentage >= 60) return "text-blue-600 dark:text-blue-400";
  if (percentage >= 40) return "text-amber-600 dark:text-amber-400";
  return "text-slate-600 dark:text-slate-400";
};

const SearchResultItem = ({
  result,
  onClick,
}: {
  result: DocumentSearchResult;
  onClick: () => void;
}) => {
  const relevance = getRelevancePercentage(result.similarity_score);
  const description = getRelevanceDescription(relevance);

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md hover:border-ring animate-in fade-in-0 slide-in-from-bottom-2"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h3 className="font-medium text-foreground line-clamp-2 mb-1">
                  {result.title || "Untitled Document"}
                </h3>
                {result.source_path && (
                  <a
                    href={result.source_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1.5 mt-1 group"
                  >
                    <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                    <span className="truncate max-w-md">
                      {result.source_path}
                    </span>
                  </a>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="outline"
                        className={`${getRelevanceColor(relevance)} border-current cursor-help`}
                      >
                        {relevance}% match
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        <strong>{description}</strong>
                      </p>
                      <p className="text-xs mt-1">
                        Similarity score: {result.similarity_score.toFixed(3)}{" "}
                        (lower = more similar)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${relevance}%`,
                      background:
                        relevance >= 80
                          ? "#10b981"
                          : relevance >= 60
                            ? "#3b82f6"
                            : relevance >= 40
                              ? "#f59e0b"
                              : "#6b7280",
                    }}
                  />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>
                    {formatDistanceToNow(new Date(result.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const SearchResults = ({
  query,
  similarityThreshold,
  onResultClick,
}: SearchResultsProps) => {
  const { data, isLoading, error } = useSearch(query, similarityThreshold);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-3" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="p-8 text-center">
          <p className="text-sm text-destructive font-medium mb-1">
            Error loading search results
          </p>
          <p className="text-xs text-muted-foreground">
            {getErrorMessage(error)}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.results.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No results for "{query}"
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto text-sm">
            Try broadening your search query or loosening the similarity
            threshold.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 text-xs sm:text-sm text-muted-foreground">
        <span>
          Found{" "}
          <span className="font-medium text-foreground">
            {data.total} result{data.total !== 1 ? "s" : ""}
          </span>{" "}
          for <span className="font-medium text-foreground">"{query}"</span>
        </span>
        <span className="sm:text-right">
          Threshold:{" "}
          <span className="font-medium text-foreground">
            {similarityThreshold === undefined
              ? "Auto (no filter)"
              : similarityThreshold}
          </span>
        </span>
      </div>
      <div className="space-y-3">
        {data.results.map((result) => (
          <SearchResultItem
            key={result.id}
            result={result}
            onClick={() => onResultClick(result.id)}
          />
        ))}
      </div>
    </div>
  );
};
