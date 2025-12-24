import { Layers, TrendingUp } from "lucide-react";

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
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
          <Layers className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          No clusters found
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Clusters are generated after documents are processed. Trigger an
          ingestion to get started.
        </p>
      </div>
    </div>
  );
};
