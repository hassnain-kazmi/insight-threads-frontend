import { Search, SlidersHorizontal } from "lucide-react";

export const SearchPage = () => {
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

      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full h-12 pl-11 pr-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          />
        </div>
        <button className="h-12 px-4 rounded-xl border border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5" />
          <span className="hidden sm:inline">Threshold</span>
        </button>
      </div>

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
    </div>
  );
};
