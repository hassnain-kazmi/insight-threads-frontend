import { Download, Rss, Github, Newspaper } from "lucide-react";

export const IngestPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Ingestion</h1>
        <p className="text-muted-foreground mt-1">
          Configure and trigger data ingestion from various sources.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: "RSS Feeds",
            description: "Import articles from RSS feed URLs",
            icon: Rss,
            color: "bg-orange-500/10 text-orange-500",
          },
          {
            label: "Hacker News",
            description: "Fetch top stories, new stories, or best stories",
            icon: Newspaper,
            color: "bg-amber-500/10 text-amber-500",
          },
          {
            label: "GitHub",
            description: "Import commits, issues, PRs, and releases",
            icon: Github,
            color: "bg-slate-500/10 text-slate-500",
          },
        ].map((source) => (
          <button
            key={source.label}
            className="bg-card border border-border rounded-xl p-5 text-left hover:border-primary/50 hover:shadow-sm transition-all group"
          >
            <div
              className={`w-10 h-10 rounded-lg ${source.color} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}
            >
              <source.icon className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-foreground">{source.label}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {source.description}
            </p>
          </button>
        ))}
      </div>
      <div className="bg-card border border-border rounded-xl">
        <div className="p-4 border-b border-border">
          <h2 className="font-medium text-foreground">
            Recent Ingestion Events
          </h2>
        </div>
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
            <Download className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No ingestion events
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Select a source above and configure your first ingestion job.
          </p>
        </div>
      </div>
    </div>
  );
};
