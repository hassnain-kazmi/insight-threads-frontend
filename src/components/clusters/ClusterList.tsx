import { ClusterCard } from "@/components/dashboard/ClusterCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useClusters } from "@/hooks/useClusters";
import { Layers } from "lucide-react";

export const ClusterList = () => {
  const { data, isLoading, error } = useClusters();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-6 space-y-4"
          >
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <h3 className="text-lg font-medium text-foreground mb-2">
          Error loading clusters
        </h3>
        <p className="text-muted-foreground">
          {error instanceof Error ? error.message : "Failed to load clusters"}
        </p>
      </div>
    );
  }

  if (!data || data.clusters.length === 0) {
    return (
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
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.clusters.map((cluster) => (
        <ClusterCard key={cluster.id} cluster={cluster} />
      ))}
    </div>
  );
};
