import { FileText, Filter } from "lucide-react";

export const DocumentsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Documents</h1>
          <p className="text-muted-foreground mt-1">
            Browse and filter your ingested documents.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-accent transition-colors">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl">
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No documents found
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Documents will appear here after you trigger an ingestion job.
          </p>
        </div>
      </div>
    </div>
  );
};
