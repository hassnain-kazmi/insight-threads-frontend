import { useState } from "react";
import { Sparkles, Layers } from "lucide-react";
import { InsightList } from "@/components/insights/InsightList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useClusters } from "@/hooks/useClusters";

export const InsightsPage = () => {
  const [selectedClusterId, setSelectedClusterId] = useState<
    string | undefined
  >();
  const { data: clustersData } = useClusters();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Insights</h1>
        <p className="text-muted-foreground mt-1">
          AI-generated insights from your document clusters.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4 text-violet-500" />
          <span>Powered by AI analysis</span>
        </div>

        <div className="flex items-center gap-3">
          <Label
            htmlFor="cluster-filter"
            className="text-sm text-muted-foreground whitespace-nowrap"
          >
            Filter by cluster:
          </Label>
          <Select
            value={selectedClusterId || "all"}
            onValueChange={(value) =>
              setSelectedClusterId(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger id="cluster-filter" className="w-full sm:w-[200px]">
              <SelectValue placeholder="All clusters" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clusters</SelectItem>
              {clustersData?.clusters.map((cluster) => (
                <SelectItem key={cluster.id} value={cluster.id}>
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Cluster #{cluster.id.slice(0, 8)}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <InsightList clusterId={selectedClusterId} />
    </div>
  );
};
