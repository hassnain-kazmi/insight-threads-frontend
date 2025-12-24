import { StatsCards } from "@/components/dashboard/StatsCards";
import { ClusterCard } from "@/components/dashboard/ClusterCard";
import { RecentIngestions } from "@/components/dashboard/RecentIngestions";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useClusters } from "@/hooks/useClusters";
import { LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const DashboardPage = () => {
  const { data, isLoading, error } = useClusters();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your data insights and trending topics.
        </p>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Trending Clusters
            </h2>
            {!isLoading && data && data.clusters.length > 0 && (
              <button
                onClick={() => navigate("/clusters")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                View all →
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="border-border/50">
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                    <Skeleton className="h-4 w-40" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className="border-border/50">
              <CardContent className="p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Failed to load clusters. Please try again later.
                </p>
              </CardContent>
            </Card>
          ) : !data || data.clusters.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                  <LayoutDashboard className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No clusters yet
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-4">
                  Trigger your first ingestion to start seeing trending clusters
                  and document analytics.
                </p>
                <button
                  onClick={() => navigate("/ingest")}
                  className="text-sm text-primary hover:underline"
                >
                  Go to Ingestion →
                </button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.clusters.map((cluster) => (
                <ClusterCard key={cluster.id} cluster={cluster} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Recent Activity
          </h2>
          <RecentIngestions />
        </div>
      </div>
    </div>
  );
};
