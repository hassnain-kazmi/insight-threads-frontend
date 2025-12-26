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
import type { AnomalyFilters } from "@/types/api";
import { useClusters } from "@/hooks/useClusters";

interface AnomalyFiltersPanelProps {
  filters: AnomalyFilters;
  onFiltersChange: (filters: AnomalyFilters) => void;
}

export const AnomalyFiltersPanel = ({
  filters,
  onFiltersChange,
}: AnomalyFiltersPanelProps) => {
  const { data: clustersData } = useClusters();

  const activeFiltersCount = [
    filters.cluster_id,
    filters.anomaly_type,
    filters.start_date,
    filters.end_date,
  ].filter(Boolean).length;

  const handleFilterChange = (key: keyof AnomalyFilters, value: unknown) => {
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
          <Label className="text-xs font-medium">Anomaly Type</Label>
          <Input
            type="text"
            value={filters.anomaly_type || ""}
            onChange={(e) => handleFilterChange("anomaly_type", e.target.value)}
            placeholder="Filter by type..."
            className="h-8 text-xs"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-xs font-medium">Date Range</Label>
          <div className="space-y-2">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">
                Start Date (YYYY-MM-DD)
              </Label>
              <Input
                type="date"
                value={filters.start_date || ""}
                onChange={(e) =>
                  handleFilterChange("start_date", e.target.value)
                }
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">
                End Date (YYYY-MM-DD)
              </Label>
              <Input
                type="date"
                value={filters.end_date || ""}
                onChange={(e) => handleFilterChange("end_date", e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
