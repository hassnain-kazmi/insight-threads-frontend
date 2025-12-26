import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import { useAnomalies } from "@/hooks/useAnomalies";
import type { AnomalyFilters, AnomalyResponse } from "@/types/api";
import { formatDate, formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface AnomaliesTableProps {
  filters: AnomalyFilters;
  onFiltersChange: (filters: AnomalyFilters) => void;
  onClusterClick?: (clusterId: string) => void;
}

const getSeverityLabel = (score: number): string => {
  if (score >= 0.8) return "Critical";
  if (score >= 0.5) return "High";
  if (score >= 0.3) return "Medium";
  return "Low";
};

const getSeverityColor = (score: number): string => {
  if (score >= 0.8)
    return "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30";
  if (score >= 0.5)
    return "bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/30";
  if (score >= 0.3)
    return "bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30";
  return "bg-slate-500/20 text-slate-700 dark:text-slate-400 border-slate-500/30";
};

interface AnomalyRowProps {
  anomaly: AnomalyResponse;
  onClusterClick?: (clusterId: string) => void;
}

const AnomalyRow = ({ anomaly, onClusterClick }: AnomalyRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasMetadata = anomaly.anomaly_metadata !== null;

  return (
    <>
      <TableRow
        className={cn(
          "hover:bg-muted/50 transition-colors",
          hasMetadata && "cursor-pointer"
        )}
        onClick={() => hasMetadata && setIsExpanded(!isExpanded)}
      >
        <TableCell className="font-medium">
          <div className="flex items-center gap-2">
            {hasMetadata && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            )}
            <span className="text-sm">{formatDate(anomaly.anomaly_date)}</span>
          </div>
        </TableCell>
        <TableCell>
          <Badge
            className={cn(
              "text-xs font-medium border",
              getSeverityColor(anomaly.score)
            )}
          >
            {getSeverityLabel(anomaly.score)}
          </Badge>
          <span className="ml-2 text-xs text-muted-foreground">
            ({anomaly.score.toFixed(2)})
          </span>
        </TableCell>
        <TableCell>
          {anomaly.type ? (
            <Badge variant="outline" className="text-xs">
              {anomaly.type}
            </Badge>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          )}
        </TableCell>
        <TableCell>
          {onClusterClick ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClusterClick(anomaly.cluster_id);
              }}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              {anomaly.cluster_id.slice(0, 8)}...
              <ExternalLink className="w-3 h-3" />
            </button>
          ) : (
            <span className="text-xs text-muted-foreground font-mono">
              {anomaly.cluster_id.slice(0, 8)}...
            </span>
          )}
        </TableCell>
        <TableCell className="text-xs text-muted-foreground">
          {formatDateTime(anomaly.created_at)}
        </TableCell>
      </TableRow>
      {isExpanded && hasMetadata && (
        <TableRow>
          <TableCell colSpan={5} className="bg-muted/30 p-4">
            <div className="space-y-2">
              <div className="text-xs font-medium text-foreground mb-2">
                Metadata
              </div>
              <pre className="text-xs bg-background border border-border rounded-md p-3 overflow-x-auto font-mono text-muted-foreground">
                {JSON.stringify(anomaly.anomaly_metadata, null, 2)}
              </pre>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export const AnomaliesTable = ({
  filters,
  onFiltersChange,
  onClusterClick,
}: AnomaliesTableProps) => {
  const { data, isLoading, error } = useAnomalies(filters);

  const pageSize = filters.limit || 50;
  const currentPage = Math.floor((filters.offset || 0) / pageSize) + 1;
  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  const handlePageChange = (newPage: number) => {
    const newOffset = (newPage - 1) * pageSize;
    onFiltersChange({
      ...filters,
      offset: newOffset,
    });
  };

  if (isLoading) {
    return (
      <div className="border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Cluster</TableHead>
              <TableHead>Detected</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-border rounded-xl p-8 text-center">
        <p className="text-sm text-destructive">
          Failed to load anomalies:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  if (!data || data.anomalies.length === 0) {
    return (
      <div className="border border-border rounded-xl p-12 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          No anomalies detected
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          No anomalies match your current filters. Try adjusting your search
          criteria or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Cluster</TableHead>
              <TableHead>Detected</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.anomalies.map((anomaly) => (
              <AnomalyRow
                key={anomaly.id}
                anomaly={anomaly}
                onClusterClick={onClusterClick}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(filters.offset || 0) + 1} to{" "}
            {Math.min((filters.offset || 0) + pageSize, data.total)} of{" "}
            {data.total} anomalies
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="h-8"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
