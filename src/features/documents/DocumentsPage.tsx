import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { PageTransition } from "@/components/ui/page-transition";
import { PageHeader } from "@/components/ui/page-header";
import { InfoNote } from "@/components/ui/info-note";
import { DocumentFilters as DocumentFiltersComponent } from "@/components/documents/DocumentFilters";
import { DocumentsTable } from "@/components/documents/DocumentsTable";
import { DocumentDetailDrawer } from "@/components/documents/DocumentDetailDrawer";
import { SourceDistribution } from "@/components/documents/SourceDistribution";
import { useDocuments } from "@/hooks/useDocuments";
import { FileText } from "lucide-react";
import type { DocumentFilters } from "@/types/api";
import { DEFAULT_PAGE_SIZE, DOCUMENTS_DISTRIBUTION_LIMIT } from "@/constants";
import { Button } from "@/components/ui/button";

export const DocumentsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const documentIdFromUrl = searchParams.get("document_id");
  const clusterIdFromUrl = searchParams.get("cluster_id");

  const [filters, setFilters] = useState<DocumentFilters>(() => ({
    limit: DEFAULT_PAGE_SIZE,
    offset: 0,
    cluster_id: clusterIdFromUrl || undefined,
  }));
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!documentIdFromUrl) return;
    const id = setTimeout(() => setSelectedDocumentId(documentIdFromUrl), 0);
    return () => clearTimeout(id);
  }, [documentIdFromUrl]);

  const { data: distributionData } = useDocuments({
    limit: DOCUMENTS_DISTRIBUTION_LIMIT,
    offset: 0,
  });

  const hasActiveFilters = Object.keys(filters).some(
    (key) =>
      key !== "limit" &&
      key !== "offset" &&
      filters[key as keyof DocumentFilters],
  );

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="Documents"
          description="Browse and filter your ingested documents"
          icon={FileText}
          iconColor="text-blue-600 dark:text-blue-400"
        />

        <div className="animate-in fade-in-0 slide-in-from-top-2 duration-300">
          <DocumentFiltersComponent
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>

        <InfoNote variant="tip">
          <p>
            <strong>Document Processing:</strong> Documents go through several
            stages: ingestion → processing → analysis. Only processed documents
            have sentiment scores and cluster assignments. Click any document to
            view full details including raw text, sentiment analysis, and
            cluster memberships.
          </p>
        </InfoNote>

        {hasActiveFilters && (
          <InfoNote variant="info">
            <p>
              <strong>Filtering Active:</strong> You're viewing a filtered
              subset of documents. Use the filters above to refine by source
              type, sentiment range, cluster membership, processing status, or
              specific ingestion event.
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-2 h-7 px-2 text-xs"
              onClick={() =>
                setFilters({
                  limit: DEFAULT_PAGE_SIZE,
                  offset: 0,
                })
              }
            >
              Reset filters
            </Button>
          </InfoNote>
        )}

        {distributionData && distributionData.documents.length > 0 && (
          <div
            className="animate-in fade-in-0 slide-in-from-bottom-2"
            style={{ animationDelay: "50ms" }}
          >
            <SourceDistribution documents={distributionData.documents} />
          </div>
        )}

        <div
          className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
          style={{ animationDelay: "100ms" }}
        >
          <DocumentsTable
            filters={filters}
            onFiltersChange={setFilters}
            onDocumentClick={setSelectedDocumentId}
          />
        </div>

        <DocumentDetailDrawer
          documentId={selectedDocumentId}
          onClose={() => {
            setSelectedDocumentId(null);
            if (documentIdFromUrl) {
              searchParams.delete("document_id");
              setSearchParams(searchParams, { replace: true });
            }
          }}
        />
      </div>
    </PageTransition>
  );
};
