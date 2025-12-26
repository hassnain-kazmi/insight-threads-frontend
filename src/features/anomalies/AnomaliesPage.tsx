import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnomalyFiltersPanel } from "@/components/anomalies/AnomalyFilters";
import { AnomaliesTable } from "@/components/anomalies/AnomaliesTable";
import type { AnomalyFilters } from "@/types/api";
import { useNavigate } from "react-router-dom";

export const AnomaliesPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<AnomalyFilters>({
    limit: 50,
    offset: 0,
  });
  const [showFilters, setShowFilters] = useState(true);

  const handleClusterClick = (clusterId: string) => {
    navigate(`/clusters/${clusterId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Anomalies</h1>
          <p className="text-muted-foreground mt-1">
            Monitor detected anomalies in your data trends.
          </p>
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="w-4 h-4 mr-2" />
          {showFilters ? "Hide" : "Show"} Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {showFilters && (
          <div className="lg:col-span-1">
            <AnomalyFiltersPanel
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>
        )}

        <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
          <AnomaliesTable
            filters={filters}
            onFiltersChange={setFilters}
            onClusterClick={handleClusterClick}
          />
        </div>
      </div>
    </div>
  );
};
