import { ClusterCardEnhanced } from "@/components/clusters/ClusterCardEnhanced";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useClusters } from "@/hooks/useClusters";
import { Layers } from "lucide-react";

export const ClusterList = () => {
  const { data, isLoading, error } = useClusters();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card
            key={i}
            className="h-full border-border/50 animate-in fade-in-0 slide-in-from-bottom-2"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="flex justify-center">
                <Skeleton className="h-20 w-20 rounded-full" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
              <div className="space-y-2 pt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center mb-4">
            <Layers className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            Error loading clusters
          </h3>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : "Failed to load clusters"}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.clusters.length === 0) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-8 text-center">
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
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {data.clusters.map((cluster, index) => (
        <ClusterCardEnhanced
          key={cluster.id}
          cluster={cluster}
          index={index}
        />
      ))}
    </div>
  );
};
