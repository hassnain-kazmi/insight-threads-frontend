import { useState, useMemo } from "react";
import { TrendingUp, Layers, Sparkles, BarChart3 } from "lucide-react";
import { ClusterList } from "@/components/clusters/ClusterList";
import { PageTransition } from "@/components/ui/page-transition";
import { PageHeader } from "@/components/ui/page-header";
import { InfoNote } from "@/components/ui/info-note";
import { useClusters } from "@/hooks/useClusters";
import { TRENDING_HOT_THRESHOLD, DEFAULT_PAGE_SIZE } from "@/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ClustersPage = () => {
  const { data } = useClusters();
  const [offset, setOffset] = useState(0);
  const [sortBy, setSortBy] = useState<"trending" | "documents" | "sentiment">(
    "trending",
  );
  const limit = DEFAULT_PAGE_SIZE;

  const highTrendingCount =
    data?.clusters.filter(
      (c) => (c.trending_score ?? 0) > TRENDING_HOT_THRESHOLD,
    ).length ?? 0;

  const handlePageChange = (newPage: number) => {
    setOffset((newPage - 1) * limit);
  };

  const sortLabel = useMemo(() => {
    switch (sortBy) {
      case "documents":
        return "Most documents first";
      case "sentiment":
        return "Highest sentiment first";
      default:
        return "Highest trending score first";
    }
  }, [sortBy]);

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
            <strong>Understanding Clusters:</strong> Clusters are groups of
            semantically similar documents automatically organized by topic.
            Each cluster represents a theme or subject that appears across your
            ingested content.
          </p>
          <p className="mt-2 text-xs">
            <strong>Trending Score:</strong> Clusters are sorted by trending
            score (0-100%), which indicates how much activity and momentum a
            topic has. Higher scores mean the topic is gaining more attention.
            Click any cluster to view detailed analytics, keywords, timeseries
            data, AI insights, and detected anomalies.
          </p>
        </InfoNote>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm text-muted-foreground animate-in fade-in-0 slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span>{sortLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <Select
              value={sortBy}
              onValueChange={(value) =>
                setSortBy(value as "trending" | "documents" | "sentiment")
              }
            >
              <SelectTrigger className="h-8 w-[220px]">
                <SelectValue placeholder="Sort clusters by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trending">
                  Trending score (highest first)
                </SelectItem>
                <SelectItem value="documents">Most documents</SelectItem>
                <SelectItem value="sentiment">Highest avg sentiment</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {highTrendingCount > 0 && (
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{highTrendingCount} highly trending (90%+)</span>
            </div>
          )}
        </div>

        <div
          className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
          style={{ animationDelay: "100ms" }}
        >
          <ClusterList
            limit={limit}
            offset={offset}
            sortBy={sortBy}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </PageTransition>
  );
};
