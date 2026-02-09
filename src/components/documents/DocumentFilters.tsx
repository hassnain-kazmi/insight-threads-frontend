import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Filter } from "lucide-react";
import type { DocumentFilters as DocumentFiltersType } from "@/types/api";
import { useClusters } from "@/hooks/useClusters";
import { useIngestEvents } from "@/hooks/useIngest";
import { formatDate, getSourceDisplayName } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface DocumentFiltersProps {
  filters: DocumentFiltersType;
  onFiltersChange: (filters: DocumentFiltersType) => void;
  className?: string;
}

export const DocumentFilters = ({
  filters,
  onFiltersChange,
  className,
}: DocumentFiltersProps) => {
  const { data: clustersData } = useClusters();
  const { data: ingestEventsData } = useIngestEvents({ limit: 100 });

  const activeFiltersCount = [
    filters.processed !== undefined,
    filters.source_type,
    filters.cluster_id,
    filters.ingest_event_id,
    filters.sentiment_min !== undefined,
    filters.sentiment_max !== undefined,
  ].filter(Boolean).length;

  const handleFilterChange = (
    key: keyof DocumentFiltersType,
    value: unknown,
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value === "" || value === null ? undefined : value,
      offset: 0,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      limit: filters.limit,
      offset: 0,
    });
  };

  return (
    <div
      className={cn(
        "bg-card border border-border rounded-xl p-4 space-y-4",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {activeFiltersCount} active
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-7 text-xs"
          >
            <X className="w-3 h-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Status
          </Label>
          <Select
            value={
              filters.processed === undefined
                ? "all"
                : filters.processed
                  ? "processed"
                  : "unprocessed"
            }
            onValueChange={(value) => {
              if (value === "all") {
                handleFilterChange("processed", undefined);
              } else {
                handleFilterChange("processed", value === "processed");
              }
            }}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="processed">Processed</SelectItem>
              <SelectItem value="unprocessed">Unprocessed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Source
          </Label>
          <Select
            value={filters.source_type || "all"}
            onValueChange={(value) =>
              handleFilterChange(
                "source_type",
                value === "all" ? undefined : value,
              )
            }
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="rss">{getSourceDisplayName("rss")}</SelectItem>
              <SelectItem value="hackernews">
                {getSourceDisplayName("hackernews")}
              </SelectItem>
              <SelectItem value="github">
                {getSourceDisplayName("github")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Cluster
          </Label>
          <Select
            value={filters.cluster_id || "all"}
            onValueChange={(value) =>
              handleFilterChange(
                "cluster_id",
                value === "all" ? undefined : value,
              )
            }
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clusters</SelectItem>
              {clustersData?.clusters.map((cluster) => (
                <SelectItem key={cluster.id} value={cluster.id}>
                  Cluster {cluster.id.slice(0, 8)}...
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Event
          </Label>
          <Select
            value={filters.ingest_event_id || "all"}
            onValueChange={(value) =>
              handleFilterChange(
                "ingest_event_id",
                value === "all" ? undefined : value,
              )
            }
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              {ingestEventsData?.events.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {getSourceDisplayName(event.source)} -{" "}
                  {formatDate(event.started_at)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Sentiment Min
          </Label>
          <Input
            type="number"
            step="0.1"
            min="-1"
            max="1"
            value={filters.sentiment_min ?? ""}
            onChange={(e) => {
              const value =
                e.target.value === "" ? undefined : parseFloat(e.target.value);
              handleFilterChange(
                "sentiment_min",
                value !== undefined && !isNaN(value) ? value : undefined,
              );
            }}
            placeholder="-1.0"
            className="h-9 text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Sentiment Max
          </Label>
          <Input
            type="number"
            step="0.1"
            min="-1"
            max="1"
            value={filters.sentiment_max ?? ""}
            onChange={(e) => {
              const value =
                e.target.value === "" ? undefined : parseFloat(e.target.value);
              handleFilterChange(
                "sentiment_max",
                value !== undefined && !isNaN(value) ? value : undefined,
              );
            }}
            placeholder="1.0"
            className="h-9 text-xs"
          />
        </div>
      </div>
    </div>
  );
};
