import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useIngestEvents } from "@/hooks/useIngest";
import { IngestStatusBadge } from "@/components/ingest/IngestStatusBadge";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

export const RecentIngestions = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useIngestEvents({ limit: 5 });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Ingestions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error || !data || data.events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Ingestions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No ingestion events yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>Recent Ingestions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.events.map((event) => {
            const getSourceDisplayName = (source: string | null): string => {
              switch (source) {
                case "rss":
                  return "RSS";
                case "hackernews":
                  return "Hacker News";
                case "github":
                  return "GitHub";
                default:
                  return "Unknown";
              }
            };

            return (
              <div
                key={event.id}
                className="flex items-start justify-between gap-3 pb-4 border-b border-border last:border-0 last:pb-0 hover:bg-muted/30 rounded-lg p-2 -m-2 transition-colors cursor-pointer group"
                onClick={() => navigate("/ingest")}
              >
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {getSourceDisplayName(event.source)}
                    </span>
                    <IngestStatusBadge status={event.status} startedAt={event.started_at} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(event.started_at), {
                      addSuffix: true,
                    })}
                  </p>
                  {event.error_message && (
                    <p className="text-xs text-red-600 dark:text-red-400 truncate">
                      {event.error_message}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
