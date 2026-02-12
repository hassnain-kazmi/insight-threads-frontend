import { useMemo, memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Layers, FileText, Target, TrendingUp } from "lucide-react";
import type { DocumentUMAPResponse } from "@/types/api";

interface UMAPStatsProps {
  data: DocumentUMAPResponse[];
}

export const UMAPStats = memo(function UMAPStats({ data }: UMAPStatsProps) {
  const stats = useMemo(() => {
    const total = data.length;
    const clustered = data.filter((d) => d.cluster_id !== null).length;
    const unclustered = total - clustered;

    const clusterCounts = new Map<string, number>();
    data.forEach((d) => {
      if (d.cluster_id) {
        clusterCounts.set(
          d.cluster_id,
          (clusterCounts.get(d.cluster_id) || 0) + 1,
        );
      }
    });

    const uniqueClusters = clusterCounts.size;
    const avgClusterSize =
      uniqueClusters > 0 ? Math.round(clustered / uniqueClusters) : 0;

    if (total === 0) {
      return {
        total: 0,
        clustered,
        unclustered,
        uniqueClusters,
        avgClusterSize,
        spread: 0,
      };
    }

    const centerX = data.reduce((sum, d) => sum + d.x, 0) / total;
    const centerY = data.reduce((sum, d) => sum + d.y, 0) / total;

    const avgDistance =
      data.reduce((sum, d) => {
        const dx = d.x - centerX;
        const dy = d.y - centerY;
        return sum + Math.sqrt(dx * dx + dy * dy);
      }, 0) / total;

    return {
      total,
      clustered,
      unclustered,
      uniqueClusters,
      avgClusterSize,
      spread: avgDistance,
    };
  }, [data]);

  if (stats.total === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 border-blue-200/50 dark:border-blue-800/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs text-muted-foreground">Total</span>
          </div>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
            {stats.total.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/10 border-emerald-200/50 dark:border-emerald-800/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs text-muted-foreground">Clustered</span>
          </div>
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
            {stats.clustered.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {((stats.clustered / stats.total) * 100).toFixed(1)}%
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-950/20 dark:to-slate-900/10 border-slate-200/50 dark:border-slate-800/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span className="text-xs text-muted-foreground">Clusters</span>
          </div>
          <div className="text-2xl font-bold text-slate-700 dark:text-slate-400">
            {stats.uniqueClusters}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10 border-amber-200/50 dark:border-amber-800/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-xs text-muted-foreground">Avg/Cluster</span>
          </div>
          <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">
            {stats.avgClusterSize}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10 border-purple-200/50 dark:border-purple-800/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-muted-foreground">Unclustered</span>
          </div>
          <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
            {stats.unclustered.toLocaleString()}
          </div>
          {stats.unclustered > 0 && (
            <div className="text-xs text-muted-foreground mt-1">
              {((stats.unclustered / stats.total) * 100).toFixed(1)}%
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-950/20 dark:to-indigo-900/10 border-indigo-200/50 dark:border-indigo-800/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-muted-foreground">Spread</span>
          </div>
          <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
            {stats.spread.toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Avg distance</div>
        </CardContent>
      </Card>
    </div>
  );
});
