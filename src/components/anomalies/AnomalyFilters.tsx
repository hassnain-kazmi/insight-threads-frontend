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
import type { AnomalyFilters as AnomalyFiltersType } from "@/types/api";
import { useClusters } from "@/hooks/useClusters";
import { cn } from "@/lib/utils";

interface AnomalyFiltersComponentProps {
  filters: AnomalyFiltersType;
  onFiltersChange: (filters: AnomalyFiltersType) => void;
  className?: string;
}

export const AnomalyFilters = ({
  filters,
  onFiltersChange,
  className,
}: AnomalyFiltersComponentProps) => {
  const { data: clustersData } = useClusters();

  const activeFiltersCount = [
    filters.cluster_id,
    filters.anomaly_type,
    filters.start_date,
    filters.end_date,
  ].filter(Boolean).length;

  const handleFilterChange = (
    key: keyof AnomalyFiltersType,
    value: unknown
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value === "" || value === null ? undefined : value,
      offset: 0,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      limit: filters.limit || 50,
      offset: 0,
    });
  };

  return (
    <div
      className={cn(
        "bg-card border border-border rounded-xl p-4 space-y-4",
        className
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Cluster
          </Label>
          <Select
            value={filters.cluster_id || "all"}
            onValueChange={(value) =>
              handleFilterChange(
                "cluster_id",
                value === "all" ? undefined : value
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
            Type
          </Label>
          <Input
            type="text"
            value={filters.anomaly_type || ""}
            onChange={(e) => handleFilterChange("anomaly_type", e.target.value)}
            placeholder="Filter by type..."
            className="h-9 text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Start Date
          </Label>
          <Input
            type="date"
            value={filters.start_date || ""}
            onChange={(e) => handleFilterChange("start_date", e.target.value)}
            className="h-9 text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            End Date
          </Label>
          <Input
            type="date"
            value={filters.end_date || ""}
            onChange={(e) => handleFilterChange("end_date", e.target.value)}
            className="h-9 text-xs"
          />
        </div>
      </div>
    </div>
  );
};
