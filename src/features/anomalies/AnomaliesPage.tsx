import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { PageTransition } from "@/components/ui/page-transition";
import { PageHeader } from "@/components/ui/page-header";
import { InfoNote } from "@/components/ui/info-note";
import { AnomalyFilters as AnomalyFiltersComponent } from "@/components/anomalies/AnomalyFilters";
import { AnomaliesTable } from "@/components/anomalies/AnomaliesTable";
import { AnomalyTimeline } from "@/components/anomalies/AnomalyTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnomalies } from "@/hooks/useAnomalies";
import type { AnomalyFilters } from "@/types/api";
import { useNavigate } from "react-router-dom";
import { DEFAULT_PAGE_SIZE, ANOMALIES_TIMELINE_LIMIT } from "@/constants";

export const AnomaliesPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<AnomalyFilters>({
    limit: DEFAULT_PAGE_SIZE,
    offset: 0,
  });

  const timelineFilters: AnomalyFilters = {
    ...filters,
    limit: ANOMALIES_TIMELINE_LIMIT,
    offset: 0,
  };
  const { data: anomaliesData } = useAnomalies(timelineFilters);

  const handleClusterClick = (clusterId: string) => {
    navigate(`/clusters/${clusterId}`);
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="Anomalies"
          description="Monitor detected anomalies in your data trends"
          icon={AlertTriangle}
          iconColor="text-amber-600 dark:text-amber-400"
        />

        <InfoNote variant="warning">
          <p>
            <strong>Anomaly Detection Explained:</strong> Anomalies are unusual
            patterns or outliers detected in your data trends using statistical
            analysis. They may indicate:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
            <li>
              <strong>Emerging Topics:</strong> Sudden spikes in mentions of new
              subjects
            </li>
            <li>
              <strong>Sentiment Shifts:</strong> Unexpected changes in public
              opinion or tone
            </li>
            <li>
              <strong>Data Quality Issues:</strong> Errors or inconsistencies in
              ingestion
            </li>
            <li>
              <strong>Significant Events:</strong> Real-world events causing
              unusual activity
            </li>
          </ul>
          <p className="mt-2 text-xs">
            <strong>Severity Scores:</strong> Higher scores (0.7+) indicate more
            significant anomalies that warrant immediate attention. Click on any
            anomaly to view its cluster and investigate further.
          </p>
        </InfoNote>

        <Card className="animate-in fade-in-0 slide-in-from-top-2 duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">
              Filters & Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AnomalyFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
            />
            {anomaliesData && anomaliesData.anomalies.length > 0 && (
              <div
                className="animate-in fade-in-0 slide-in-from-bottom-2"
                style={{ animationDelay: "50ms" }}
              >
                <AnomalyTimeline
                  anomalies={anomaliesData.anomalies}
                  days={30}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <div
          className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
          style={{ animationDelay: "100ms" }}
        >
          <AnomaliesTable
            filters={filters}
            onFiltersChange={setFilters}
            onClusterClick={handleClusterClick}
            queryFilters={timelineFilters}
          />
        </div>
      </div>
    </PageTransition>
  );
};
