import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { PageTransition } from "@/components/ui/page-transition";
import { PageHeader } from "@/components/ui/page-header";
import { InfoNote } from "@/components/ui/info-note";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { SearchResults } from "@/components/search/SearchResults";
import { DocumentDetailDrawer } from "@/components/documents/DocumentDetailDrawer";
import { EmptyState } from "@/components/ui/empty-state";
import { useDebounce } from "@/hooks/useDebounce";

export const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [similarityThreshold, setSimilarityThreshold] = useState<
    number | undefined
  >(undefined);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null
  );
  const [showThresholdControl, setShowThresholdControl] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!query.trim()) {
      setSimilarityThreshold(undefined);
    }
  }, [query]);

  const hasActiveSearch = debouncedQuery.trim().length > 0;

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="Semantic Search"
          description="Search documents by meaning, not just keywords. Uses AI embeddings to find semantically similar content."
          icon={Search}
          iconColor="text-purple-600 dark:text-purple-400"
        />

        <InfoNote variant="info">
          <p>
            <strong>How Semantic Search Works:</strong> Unlike keyword search, semantic search understands the meaning 
            behind your query. It uses AI embeddings to find documents that are conceptually similar, even if they don't 
            share exact words. For example, searching "machine learning" will also find documents about "AI algorithms" 
            or "neural networks".
          </p>
          <p className="mt-2">
            <strong>Similarity Score:</strong> Lower scores mean more similar (range: 0-2). Results are sorted by relevance. 
            Use the threshold filter to control result quality—stricter thresholds return fewer but more relevant results.
          </p>
        </InfoNote>

        <div className="space-y-4 animate-in fade-in-0 slide-in-from-top-2 duration-300">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search documents..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-11 pr-4 h-12 text-base"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            onClick={() => setShowThresholdControl(!showThresholdControl)}
            className="h-12 px-4"
          >
            <SlidersHorizontal className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Threshold</span>
          </Button>
        </div>

        {showThresholdControl && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border border-border bg-card animate-in slide-in-from-top-2">
            <Label htmlFor="threshold" className="text-sm whitespace-nowrap">
              Similarity Threshold:
            </Label>
            <Select
              value={
                similarityThreshold === undefined
                  ? "auto"
                  : similarityThreshold.toString()
              }
              onValueChange={(value) => {
                if (value === "auto") {
                  setSimilarityThreshold(undefined);
                } else {
                  setSimilarityThreshold(parseFloat(value));
                }
              }}
            >
              <SelectTrigger id="threshold" className="w-full sm:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto (No filter)</SelectItem>
                <SelectItem value="0.1">0.1 (Very strict)</SelectItem>
                <SelectItem value="0.2">0.2 (Strict)</SelectItem>
                <SelectItem value="0.3">0.3 (Moderate)</SelectItem>
                <SelectItem value="0.5">0.5 (Loose)</SelectItem>
                <SelectItem value="0.7">0.7 (Very loose)</SelectItem>
                <SelectItem value="1.0">1.0 (Maximum)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground flex-1">
              <strong>Stricter</strong> (lower values) = only very similar documents.{" "}
              <strong>Looser</strong> (higher values) = more results. Range: 0-2.
            </p>
          </div>
        )}
      </div>

        <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500" style={{ animationDelay: "100ms" }}>
          {hasActiveSearch ? (
            <SearchResults
              query={debouncedQuery}
              similarityThreshold={similarityThreshold}
              onResultClick={setSelectedDocumentId}
            />
          ) : (
            <EmptyState
              icon={Search}
              title="Start searching"
              description="Enter a query above to find semantically similar documents."
            />
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
