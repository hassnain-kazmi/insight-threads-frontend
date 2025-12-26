import { useState } from "react";
import { Map, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { UMAPScatterPlot } from "@/components/umap/UMAPScatterPlot";
import { DocumentDetailDrawer } from "@/components/documents/DocumentDetailDrawer";
import { useUmapDocuments, useUmapCluster } from "@/hooks/useUmap";
import { useClusters } from "@/hooks/useClusters";

export const UmapPage = () => {
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(
    null
  );
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null
  );
  const [limit, setLimit] = useState<number>(5000);

  const { data: clustersData, isLoading: clustersLoading } = useClusters();

  const {
    data: globalUmapData,
    isLoading: globalLoading,
    error: globalError,
  } = useUmapDocuments(limit, !selectedClusterId);

  const {
    data: clusterUmapData,
    isLoading: clusterLoading,
    error: clusterError,
  } = useUmapCluster(selectedClusterId || "");

  const umapData = selectedClusterId
    ? clusterUmapData?.documents || []
    : globalUmapData?.documents || [];
  const isLoading = selectedClusterId ? clusterLoading : globalLoading;
  const error = selectedClusterId ? clusterError : globalError;
  const total = selectedClusterId
    ? clusterUmapData?.total || 0
    : globalUmapData?.total || 0;

  const handleReset = () => {
    setSelectedClusterId(null);
    setSelectedDocumentId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            UMAP Visualization
          </h1>
          <p className="text-muted-foreground mt-1">
            Explore document embeddings in 2D space. Click on points to view
            document details.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedClusterId && (
            <Button variant="outline" onClick={handleReset} className="h-9">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset View
            </Button>
          )}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <Label htmlFor="cluster-select" className="text-sm mb-2 block">
              View Mode
            </Label>
            <Select
              value={selectedClusterId || "all"}
              onValueChange={(value) =>
                setSelectedClusterId(value === "all" ? null : value)
              }
            >
              <SelectTrigger
                id="cluster-select"
                className="w-full sm:w-[300px]"
              >
                <SelectValue placeholder="Select a cluster" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Documents (Global View)</SelectItem>
                {clustersLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading clusters...
                  </SelectItem>
                ) : (
                  clustersData?.clusters.map((cluster) => (
                    <SelectItem key={cluster.id} value={cluster.id}>
                      Cluster {cluster.id.slice(0, 8)}... (
                      {cluster.document_count} docs)
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          {!selectedClusterId && (
            <div className="flex flex-col">
              <Label htmlFor="limit-select" className="text-sm mb-2">
                Max Documents
              </Label>
              <Select
                value={limit.toString()}
                onValueChange={(value) => setLimit(parseInt(value, 10))}
              >
                <SelectTrigger
                  id="limit-select"
                  className="w-full sm:w-[200px]"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1000">1,000</SelectItem>
                  <SelectItem value="2500">2,500</SelectItem>
                  <SelectItem value="5000">5,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {selectedClusterId && (
          <div className="text-sm text-muted-foreground">
            Showing cluster-specific view. Documents are colored by their
            primary cluster assignment.
          </div>
        )}

        {total > 0 && (
          <div className="text-sm text-muted-foreground">
            Displaying {umapData.length} of {total} documents
          </div>
        )}
      </div>

      {error ? (
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
            <Map className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            Error loading UMAP data
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {error instanceof Error
              ? error.message
              : "Failed to load UMAP projections. Please try again."}
          </p>
        </div>
      ) : isLoading ? (
        <div className="bg-card border border-border rounded-xl p-4">
          <Skeleton className="w-full h-[500px] rounded-lg" />
        </div>
      ) : umapData.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-8 text-center min-h-[500px] flex items-center justify-center">
          <div>
            <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
              <Map className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {selectedClusterId
                ? "No embeddings available for this cluster"
                : "No embeddings available"}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {selectedClusterId
                ? "This cluster doesn't have UMAP projections yet. Documents may need to be processed."
                : "UMAP projections will appear here after documents are processed and embedded."}
            </p>
          </div>
        </div>
      ) : (
        <UMAPScatterPlot
          data={umapData}
          onDocumentClick={setSelectedDocumentId}
        />
      )}

      <DocumentDetailDrawer
        documentId={selectedDocumentId}
        onClose={() => setSelectedDocumentId(null)}
      />
    </div>
  );
};
