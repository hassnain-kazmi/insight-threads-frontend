import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentFiltersPanel } from "@/components/documents/DocumentFilters";
import { DocumentsTable } from "@/components/documents/DocumentsTable";
import { DocumentDetailDrawer } from "@/components/documents/DocumentDetailDrawer";
import type { DocumentFilters } from "@/types/api";

export const DocumentsPage = () => {
  const [filters, setFilters] = useState<DocumentFilters>({
    limit: 50,
    offset: 0,
  });
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null
  );
  const [showFilters, setShowFilters] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Documents</h1>
          <p className="text-muted-foreground mt-1">
            Browse and filter your ingested documents.
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
            <DocumentFiltersPanel
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>
        )}

        <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
          <DocumentsTable
            filters={filters}
            onFiltersChange={setFilters}
            onDocumentClick={setSelectedDocumentId}
          />
        </div>
      </div>

      <DocumentDetailDrawer
        documentId={selectedDocumentId}
        onClose={() => setSelectedDocumentId(null)}
      />
    </div>
  );
};
