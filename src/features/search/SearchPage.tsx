import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Semantic Search
        </h1>
        <p className="text-muted-foreground mt-1">
          Search documents by meaning, not just keywords.
        </p>
      </div>

      <div className="space-y-4">
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
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border border-border bg-card">
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
              Lower values return only the most similar documents. Range: 0-2
              (lower = more similar).
            </p>
          </div>
        )}
      </div>

      {hasActiveSearch ? (
        <SearchResults
          query={debouncedQuery}
          similarityThreshold={similarityThreshold}
          onResultClick={setSelectedDocumentId}
        />
      ) : (
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            Start searching
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Enter a query above to find semantically similar documents.
          </p>
        </div>
      )}

      <DocumentDetailDrawer
        documentId={selectedDocumentId}
        onClose={() => setSelectedDocumentId(null)}
      />
    </div>
  );
};
