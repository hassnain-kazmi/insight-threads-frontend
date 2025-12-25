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
import { useIngestEvents } from "@/hooks/useIngest";
import type { DocumentFilters, DocumentResponse } from "@/types/api";
import { formatDistanceToNow } from "date-fns";

interface DocumentsTableProps {
  filters: DocumentFilters;
  onFiltersChange: (filters: DocumentFilters) => void;
  onDocumentClick: (documentId: string) => void;
}

const getSourceIcon = (sourceType: string | null) => {
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

const getSourceTypeFromPath = (sourcePath: string | null): string | null => {
  if (!sourcePath) return null;

  const lowerPath = sourcePath.toLowerCase();

  if (
    lowerPath.includes("news.ycombinator.com") ||
    lowerPath.includes("hackernews") ||
    lowerPath.includes("ycombinator")
  ) {
    return "hackernews";
  }

  if (
    lowerPath.includes("github.com") ||
    lowerPath.includes("api.github.com")
  ) {
    return "github";
  }

  if (
    lowerPath.includes("/rss") ||
    lowerPath.includes("/feed") ||
    lowerPath.includes("?feed=") ||
    lowerPath.endsWith(".xml") ||
    lowerPath.endsWith(".rss") ||
    lowerPath.includes("rss.xml") ||
    lowerPath.includes("feed.xml") ||
    lowerPath.includes("atom.xml")
  ) {
    return "rss";
  }

  return null;
};

export const DocumentsTable = ({
  filters,
  onFiltersChange,
  onDocumentClick,
}: DocumentsTableProps) => {
  const { data, isLoading, error } = useDocuments(filters);
  const { data: ingestEventsData } = useIngestEvents({ limit: 500 });

  const ingestEventSourceMap = useMemo(() => {
    const map = new Map<string, string | null>();
    ingestEventsData?.events.forEach((event) => {
      if (event.id) {
        map.set(event.id, event.source);
      }
    });
    return map;
  }, [ingestEventsData]);

  const getDocumentSourceType = (document: DocumentResponse): string => {
    if (document.ingest_event_id) {
      const source = ingestEventSourceMap.get(document.ingest_event_id);
      if (source) {
        return source;
      }
    }

    const sourceFromPath = getSourceTypeFromPath(document.source_path);
    return sourceFromPath || "unknown";
  };

  const pageSize = filters.limit || 50;
  const currentPage = Math.floor((filters.offset || 0) / pageSize) + 1;
  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

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
            ? "Failed to load documents. Please try again."
            : "No documents match your current filters. Try adjusting your search criteria."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
                    <span className="text-lg">
                      {getSourceIcon(getDocumentSourceType(document))}
                    </span>
                    <span className="truncate">
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
                  <Badge variant="default" className="capitalize">
                    {getDocumentSourceType(document)}
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
            Showing {(filters.offset || 0) + 1} to{" "}
            {Math.min((filters.offset || 0) + pageSize, data.total)} of{" "}
            {data.total} documents
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
