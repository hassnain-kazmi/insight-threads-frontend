import { TrendingUp, Layers, Sparkles } from "lucide-react";
import { ClusterList } from "@/components/clusters/ClusterList";
import { PageTransition } from "@/components/ui/page-transition";
import { PageHeader } from "@/components/ui/page-header";
import { InfoNote } from "@/components/ui/info-note";
import { useClusters } from "@/hooks/useClusters";

export const ClustersPage = () => {
  const { data } = useClusters();

  const highTrendingCount = data?.clusters.filter((c) => (c.trending_score ?? 0) > 0.9).length ?? 0;

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="Clusters"
          description="Explore topic clusters organized by trending score"
          icon={Layers}
          iconColor="text-teal-600 dark:text-teal-400"
        />

        <InfoNote variant="info">
          <p>
            <strong>Understanding Clusters:</strong> Clusters are groups of semantically similar documents automatically 
            organized by topic. Each cluster represents a theme or subject that appears across your ingested content.
          </p>
          <p className="mt-2 text-xs">
            <strong>Trending Score:</strong> Clusters are sorted by trending score (0-100%), which indicates how much 
            activity and momentum a topic has. Higher scores mean the topic is gaining more attention. Click any cluster 
            to view detailed analytics, keywords, timeseries data, AI insights, and detected anomalies.
          </p>
        </InfoNote>

        <div className="flex items-center gap-4 text-sm text-muted-foreground animate-in fade-in-0 slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span>Sorted by trending score (highest first)</span>
          </div>
          {highTrendingCount > 0 && (
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{highTrendingCount} highly trending (90%+)</span>
            </div>
          )}
        </div>

        <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500" style={{ animationDelay: "100ms" }}>
          <ClusterList />
        </div>
      </div>
    </PageTransition>
  );
};
