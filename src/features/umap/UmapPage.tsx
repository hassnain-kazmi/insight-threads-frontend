import { useState } from "react";
import { Map, RotateCcw } from "lucide-react";
import { PageTransition } from "@/components/ui/page-transition";
import { PageHeader } from "@/components/ui/page-header";
import { InfoNote } from "@/components/ui/info-note";
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
import { UMAPStats } from "@/components/umap/UMAPStats";
import { ClusterLegend } from "@/components/umap/ClusterLegend";
import { UMAPControls } from "@/components/umap/UMAPControls";
import { DocumentDetailDrawer } from "@/components/documents/DocumentDetailDrawer";
import { EmptyState } from "@/components/ui/empty-state";
import { useUmapDocuments, useUmapCluster } from "@/hooks/useUmap";
import { useClusters } from "@/hooks/useClusters";
import { getErrorMessage } from "@/lib/utils";

export const UmapPage = () => {
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(
    null,
  );
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null,
  );
  const [limit, setLimit] = useState<number>(1000);
  const [showGrid, setShowGrid] = useState(true);
  const [highlightedClusterId, setHighlightedClusterId] = useState<
    string | null
  >(null);

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
  const isInitialLoading = isLoading && umapData.length === 0;
  const total = selectedClusterId
    ? clusterUmapData?.total || 0
    : globalUmapData?.total || 0;

  const handleReset = () => {
    setSelectedClusterId(null);
    setSelectedDocumentId(null);
    setHighlightedClusterId(null);
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="UMAP Visualization"
          description="Explore document embeddings in 2D space. Click on points to view document details."
          icon={Map}
          iconColor="text-indigo-600 dark:text-indigo-400"
          actions={
            selectedClusterId ? (
              <Button variant="outline" onClick={handleReset} size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset View
              </Button>
            ) : undefined
          }
        />

        <InfoNote variant="info">
          <p>
            <strong>Understanding UMAP Visualization:</strong> UMAP (Uniform
            Manifold Approximation and Projection) reduces high-dimensional
            document embeddings to 2D space for visualization. Documents that
            are semantically similar appear closer together on the plot.
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
            <li>
              <strong>Distance = Similarity:</strong> Closer points are more
              similar in meaning
            </li>
            <li>
              <strong>Color Coding:</strong> Points are colored by their primary
              cluster assignment
            </li>
            <li>
              <strong>Interactivity:</strong> Hover to see document titles,
              click to view full details
            </li>
            <li>
              <strong>Cluster Highlighting:</strong> Click a cluster in the
              legend to highlight it
            </li>
            <li>
              <strong>Controls:</strong> Toggle grid visibility and reset view
              for better exploration
            </li>
          </ul>
          <p className="mt-2 text-xs">
            <strong>Tip:</strong> Use this visualization to discover document
            relationships, identify outliers, and understand how your content
            clusters naturally.
          </p>
        </InfoNote>

        {umapData.length > 0 && (
          <div
            className="animate-in fade-in-0 slide-in-from-bottom-2"
            style={{ animationDelay: "50ms" }}
          >
            <UMAPStats data={umapData} />
          </div>
        )}

        <div className="bg-card border border-border rounded-xl p-4 space-y-4 animate-in fade-in-0 slide-in-from-top-2 duration-300">
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
                  <SelectItem value="all">
                    All Documents (Global View)
                  </SelectItem>
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

          <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full border border-border/60 bg-background/60">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              {selectedClusterId
                ? `Mode: Cluster view (${selectedClusterId.slice(0, 8)}…)`
                : "Mode: Global view (all documents)"}
            </span>
            {selectedClusterId && (
              <span>
                Documents are colored by their primary cluster assignment.
              </span>
            )}
          </div>

          {total > 0 && (
            <div className="text-sm text-muted-foreground">
              Displaying {umapData.length} of {total} documents
              {highlightedClusterId && (
                <span className="ml-2 text-amber-600 dark:text-amber-400">
                  • Highlighting cluster
                </span>
              )}
            </div>
          )}
        </div>

        {umapData.length > 0 && (
          <div
            className="animate-in fade-in-0 slide-in-from-bottom-2"
            style={{ animationDelay: "75ms" }}
          >
            <UMAPControls
              showGrid={showGrid}
              onGridToggle={setShowGrid}
              onReset={handleReset}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div
            className="lg:col-span-3 animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: "100ms" }}
          >
            {error ? (
              <EmptyState
                icon={Map}
                title="Error loading UMAP data"
                description={
                  getErrorMessage(error) ||
                  "Failed to load UMAP projections. Please try again."
                }
                className="border-red-200 dark:border-red-900"
              />
            ) : isInitialLoading ? (
              <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Loading UMAP projection
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Fetching up to {limit.toLocaleString()} document
                      embeddings...
                    </p>
                  </div>
                  <Skeleton className="h-8 w-24 rounded-full" />
                </div>
                <Skeleton className="w-full h-[500px] rounded-lg" />
              </div>
            ) : umapData.length === 0 ? (
              <div className="min-h-[500px] flex items-center justify-center">
                <EmptyState
                  icon={Map}
                  title={
                    selectedClusterId
                      ? "No embeddings available for this cluster"
                      : "No embeddings available"
                  }
                  description={
                    selectedClusterId
                      ? "This cluster doesn't have UMAP projections yet. Documents may need to be processed."
                      : "UMAP projections will appear here after documents are processed and embedded."
                  }
                />
              </div>
            ) : (
              <UMAPScatterPlot
                data={umapData}
                onDocumentClick={setSelectedDocumentId}
                showGrid={showGrid}
                highlightedClusterId={highlightedClusterId}
              />
            )}
          </div>

          {umapData.length > 0 && !isLoading && (
            <div
              className="animate-in fade-in-0 slide-in-from-right-4 duration-500"
              style={{ animationDelay: "150ms" }}
            >
              <ClusterLegend
                data={umapData}
                selectedClusterId={highlightedClusterId}
                onClusterSelect={(id) => {
                  setHighlightedClusterId(
                    id === highlightedClusterId ? null : id,
                  );
                }}
                onClear={() => setHighlightedClusterId(null)}
              />
            </div>
          )}
        </div>

        <DocumentDetailDrawer
          documentId={selectedDocumentId}
          onClose={() => setSelectedDocumentId(null)}
        />
      </div>
    </PageTransition>
  );
};
