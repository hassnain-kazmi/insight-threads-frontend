import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { X } from "lucide-react";
import type { DocumentFilters } from "@/types/api";
import { useClusters } from "@/hooks/useClusters";
import { useIngestEvents } from "@/hooks/useIngest";

interface DocumentFiltersPanelProps {
  filters: DocumentFilters;
  onFiltersChange: (filters: DocumentFilters) => void;
}

export const DocumentFiltersPanel = ({
  filters,
  onFiltersChange,
}: DocumentFiltersPanelProps) => {
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

  const handleFilterChange = (key: keyof DocumentFilters, value: unknown) => {
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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Filters</CardTitle>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7 text-xs"
            >
              <X className="w-3 h-3 mr-1" />
              Clear ({activeFiltersCount})
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-medium">Processed Status</Label>
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
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="processed">Processed</SelectItem>
              <SelectItem value="unprocessed">Unprocessed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium">Source Type</Label>
          <Select
            value={filters.source_type || "all"}
            onValueChange={(value) =>
              handleFilterChange(
                "source_type",
                value === "all" ? undefined : value
              )
            }
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="rss">RSS</SelectItem>
              <SelectItem value="hackernews">Hacker News</SelectItem>
              <SelectItem value="github">GitHub</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium">Cluster</Label>
          <Select
            value={filters.cluster_id || "all"}
            onValueChange={(value) =>
              handleFilterChange(
                "cluster_id",
                value === "all" ? undefined : value
              )
            }
          >
            <SelectTrigger className="h-8 text-xs">
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

        <div className="space-y-2">
          <Label className="text-xs font-medium">Ingest Event</Label>
          <Select
            value={filters.ingest_event_id || "all"}
            onValueChange={(value) =>
              handleFilterChange(
                "ingest_event_id",
                value === "all" ? undefined : value
              )
            }
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              {ingestEventsData?.events.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.source || "Unknown"} -{" "}
                  {new Date(event.started_at).toLocaleDateString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-xs font-medium">Sentiment Range</Label>
          <div className="space-y-2">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">
                Min (-1 to 1)
              </Label>
              <Input
                type="number"
                step="0.1"
                min="-1"
                max="1"
                value={filters.sentiment_min ?? ""}
                onChange={(e) => {
                  const value =
                    e.target.value === ""
                      ? undefined
                      : parseFloat(e.target.value);
                  handleFilterChange(
                    "sentiment_min",
                    value !== undefined && !isNaN(value) ? value : undefined
                  );
                }}
                placeholder="-1.0"
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">
                Max (-1 to 1)
              </Label>
              <Input
                type="number"
                step="0.1"
                min="-1"
                max="1"
                value={filters.sentiment_max ?? ""}
                onChange={(e) => {
                  const value =
                    e.target.value === ""
                      ? undefined
                      : parseFloat(e.target.value);
                  handleFilterChange(
                    "sentiment_max",
                    value !== undefined && !isNaN(value) ? value : undefined
                  );
                }}
                placeholder="1.0"
                className="h-8 text-xs"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
