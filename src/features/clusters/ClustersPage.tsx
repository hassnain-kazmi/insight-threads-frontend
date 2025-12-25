import { TrendingUp } from "lucide-react";
import { ClusterList } from "@/components/clusters/ClusterList";

export const ClustersPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Clusters</h1>
        <p className="text-muted-foreground mt-1">
          Explore topic clusters organized by trending score.
        </p>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span>Sorted by trending score</span>
        </div>
      </div>
      <ClusterList />
    </div>
  );
};
