import { Lightbulb, Sparkles } from "lucide-react";

export const InsightsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Insights</h1>
        <p className="text-muted-foreground mt-1">
          AI-generated insights from your document clusters.
        </p>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="w-4 h-4 text-violet-500" />
        <span>Powered by AI analysis</span>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
          <Lightbulb className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          No insights yet
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Insights are generated after your documents are clustered and
          analyzed.
        </p>
      </div>
    </div>
  );
};
