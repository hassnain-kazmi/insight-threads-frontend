import { useMemo, memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layers, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DocumentUMAPResponse } from "@/types/api";
import { useNavigate } from "react-router-dom";
import { getClusterColor, UNCLUSTERED_COLOR } from "./umapColors";

interface ClusterLegendProps {
  data: DocumentUMAPResponse[];
  selectedClusterId?: string | null;
  onClusterSelect?: (clusterId: string | null) => void;
  onClear?: () => void;
}

export const ClusterLegend = memo(function ClusterLegend({
  data,
  selectedClusterId,
  onClusterSelect,
  onClear,
}: ClusterLegendProps) {
  const navigate = useNavigate();

  const clusterInfo = useMemo(() => {
    const clusterMap = new Map<string, { count: number; color: string }>();

    data.forEach((doc) => {
      if (doc.cluster_id) {
        if (!clusterMap.has(doc.cluster_id)) {
          clusterMap.set(doc.cluster_id, {
            count: 0,
            color: getClusterColor(doc.cluster_id),
          });
        }
        const info = clusterMap.get(doc.cluster_id)!;
        info.count++;
      }
    });

    const totalWithCluster = data.filter((d) => d.cluster_id).length || 1;

    return Array.from(clusterMap.entries())
      .map(([id, info]) => ({
        id,
        ...info,
        percentage: (info.count / totalWithCluster) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [data]);

  const unclusteredCount = useMemo(() => {
    return data.filter((d) => !d.cluster_id).length;
  }, [data]);

  if (clusterInfo.length === 0 && unclusteredCount === 0) {
    return null;
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Cluster Legend
          </CardTitle>
          {selectedClusterId && onClear && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="h-7 px-2 text-xs"
            >
              <X className="w-3 h-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[300px] overflow-y-auto">
        {clusterInfo.map((cluster) => (
          <div
            key={cluster.id}
            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all hover:bg-muted/60 ${
              selectedClusterId === cluster.id
                ? "bg-muted border border-border/70"
                : "border border-transparent"
            }`}
            onClick={() =>
              onClusterSelect?.(
                selectedClusterId === cluster.id ? null : cluster.id,
              )
            }
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div
                className="w-4 h-4 rounded-full flex-shrink-0 border border-border/50"
                style={{ backgroundColor: cluster.color }}
              />
              <span className="text-sm font-medium text-foreground truncate">
                {cluster.id.slice(0, 8)}...
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-end gap-0.5">
                <Badge variant="secondary" className="text-xs">
                  {cluster.count}
                </Badge>
                <span className="text-[10px] text-muted-foreground">
                  {cluster.percentage.toFixed(0)}%
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/clusters/${cluster.id}`);
                }}
              >
                <Layers className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
        {unclusteredCount > 0 && (
          <div className="flex items-center justify-between p-2 rounded-lg">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border border-border/50"
                style={{ backgroundColor: UNCLUSTERED_COLOR }}
              />
              <span className="text-sm text-muted-foreground">Unclustered</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {unclusteredCount}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
});
