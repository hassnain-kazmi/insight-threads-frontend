import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useDocuments } from "@/hooks/useDocuments";
import { useIngestEventSourceMap } from "@/hooks/useIngest";
import type { DocumentFilters } from "@/types/api";
import { formatDistanceToNow, differenceInDays } from "date-fns";
import {
  getDocumentSourceType,
  calculatePagination,
  getSourceDisplayName,
  getErrorMessage,
} from "@/lib/utils";
import { DEFAULT_PAGE_SIZE } from "@/constants";

interface DocumentsTableProps {
  filters: DocumentFilters;
  onFiltersChange: (filters: DocumentFilters) => void;
  onDocumentClick: (documentId: string) => void;
}

const getSourceIcon = (sourceType: string) => {
  switch (sourceType) {
    case "hackernews":
      return "📰";
    case "github":
      return "💻";
    case "rss":
      return "📰";
    default:
      return "📄";
  }
};

export const DocumentsTable = ({
  filters,
  onFiltersChange,
  onDocumentClick,
}: DocumentsTableProps) => {
  const { data, isLoading, error } = useDocuments(filters, {
    enableAutoRefresh: true,
  });
  const { sourceMap } = useIngestEventSourceMap({ limit: 500 });

  const processedSummary = useMemo(() => {
    if (!data) return { processed: 0, pending: 0 };
    return data.documents.reduce(
      (acc, doc) => {
        if (doc.processed) acc.processed += 1;
        else acc.pending += 1;
        return acc;
      },
      { processed: 0, pending: 0 },
    );
  }, [data]);

  const { pageSize, currentPage, totalPages, startItem, endItem } = data
    ? calculatePagination(filters.offset, filters.limit, data.total)
    : {
        pageSize: filters.limit ?? DEFAULT_PAGE_SIZE,
        currentPage: 1,
        totalPages: 0,
        startItem: 0,
        endItem: 0,
      };

  const handlePageChange = (newPage: number) => {
    const newOffset = (newPage - 1) * pageSize;
    onFiltersChange({
      ...filters,
      offset: newOffset,
    });
  };

  if (isLoading) {
    return (
      <div className="border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-64" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-8 w-8 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (error || !data || data.documents.length === 0) {
    return (
      <div className="border border-border rounded-xl p-12 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
          <span className="text-2xl">📄</span>
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          No documents found
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          {error
            ? `Failed to load documents: ${getErrorMessage(error)}`
            : "No documents match your current filters. Try adjusting your search criteria."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          In this view:{" "}
          <span className="font-medium text-foreground">
            {processedSummary.processed}
          </span>{" "}
          processed ·{" "}
          <span className="font-medium text-foreground">
            {processedSummary.pending}
          </span>{" "}
          pending
        </span>
        <div className="flex items-center gap-2 w-40 h-1.5 rounded-full bg-muted overflow-hidden">
          {processedSummary.processed + processedSummary.pending > 0 && (
            <>
              <div
                className="h-full bg-emerald-500/70"
                style={{
                  width: `${
                    (processedSummary.processed /
                      (processedSummary.processed + processedSummary.pending)) *
                    100
                  }%`,
                }}
              />
              <div
                className="h-full bg-amber-400/70"
                style={{
                  width: `${
                    (processedSummary.pending /
                      (processedSummary.processed + processedSummary.pending)) *
                    100
                  }%`,
                }}
              />
            </>
          )}
        </div>
      </div>
      <div className="border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.documents.map((document) => (
              <TableRow
                key={document.id}
                className="hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => onDocumentClick(document.id)}
              >
                <TableCell className="font-medium max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="relative text-lg">
                      <span className="absolute -left-2 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full">
                        {(() => {
                          const sourceType = getDocumentSourceType(
                            document,
                            sourceMap,
                          );
                          if (sourceType === "github")
                            return (
                              <span className="block h-full w-full bg-sky-500" />
                            );
                          if (sourceType === "hackernews")
                            return (
                              <span className="block h-full w-full bg-amber-500" />
                            );
                          if (sourceType === "rss")
                            return (
                              <span className="block h-full w-full bg-emerald-500" />
                            );
                          return (
                            <span className="block h-full w-full bg-slate-400" />
                          );
                        })()}
                      </span>
                      {getSourceIcon(
                        getDocumentSourceType(document, sourceMap),
                      )}
                    </span>
                    <span
                      className={`truncate ${
                        differenceInDays(
                          new Date(),
                          new Date(document.created_at),
                        ) > 7
                          ? "text-muted-foreground"
                          : ""
                      }`}
                    >
                      {document.title || "Untitled Document"}
                    </span>
                  </div>
                  {document.source_path && (
                    <a
                      href={document.source_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mt-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span className="truncate max-w-xs">
                        {document.source_path}
                      </span>
                    </a>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="default">
                    {(() => {
                      const sourceType = getDocumentSourceType(
                        document,
                        sourceMap,
                      );
                      if (sourceType === "unknown") {
                        return "Unknown";
                      }
                      return getSourceDisplayName(sourceType);
                    })()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={document.processed ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {document.processed ? "Processed" : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(document.created_at), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDocumentClick(document.id);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages} · Showing {startItem}–{endItem}{" "}
            of {data.total} documents
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
