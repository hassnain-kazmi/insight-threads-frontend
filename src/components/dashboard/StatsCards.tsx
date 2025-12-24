import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Layers,
  TrendingUp,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";
import { useClusters, useIngestEvents } from "@/hooks/useClusters";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  isLoading?: boolean;
}

const StatCard = ({
  label,
  value,
  icon: Icon,
  color,
  isLoading,
}: StatCardProps) => {
  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="w-11 h-11 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-sm transition-shadow border-border/50">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-semibold text-foreground mt-1">
              {value}
            </p>
          </div>
          <div className={`p-3 rounded-lg bg-muted ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const StatsCards = () => {
  const { data: clustersData, isLoading: clustersLoading } = useClusters();
  const { isLoading: ingestLoading } = useIngestEvents();

  const isLoading = clustersLoading || ingestLoading;

  const totalClusters = clustersData?.total ?? 0;
  const totalDocuments =
    clustersData?.clusters.reduce(
      (sum, cluster) => sum + cluster.document_count,
      0
    ) ?? 0;
  const trendingClusters =
    clustersData?.clusters.filter((c) => (c.trending_score ?? 0) > 0.5)
      .length ?? 0;

  // NOTE: Insights count would require a separate API call
  // For now, we'll show a placeholder
  const insightsCount = "—";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Documents"
        value={isLoading ? "—" : totalDocuments}
        icon={FileText}
        color="text-blue-500"
        isLoading={isLoading}
      />
      <StatCard
        label="Active Clusters"
        value={isLoading ? "—" : totalClusters}
        icon={Layers}
        color="text-emerald-500"
        isLoading={isLoading}
      />
      <StatCard
        label="Trending Topics"
        value={isLoading ? "—" : trendingClusters}
        icon={TrendingUp}
        color="text-amber-500"
        isLoading={isLoading}
      />
      <StatCard
        label="Insights Generated"
        value={insightsCount}
        icon={Lightbulb}
        color="text-violet-500"
        isLoading={false}
      />
    </div>
  );
};
