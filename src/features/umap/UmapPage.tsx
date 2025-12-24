import { Map, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

export const UmapPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            UMAP Visualization
          </h1>
          <p className="text-muted-foreground mt-1">
            Explore document embeddings in 2D space.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
            <ZoomOut className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl aspect-[16/9] min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
            <Map className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No embeddings available
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            UMAP projections will appear here after documents are processed and
            embedded.
          </p>
        </div>
      </div>
    </div>
  );
};
