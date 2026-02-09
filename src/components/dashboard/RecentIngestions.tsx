import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useIngestEvents } from "@/hooks/useIngest";
import { IngestStatusBadge } from "@/components/ingest/IngestStatusBadge";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { getSourceDisplayName, getErrorMessage } from "@/lib/utils";

export const RecentIngestions = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useIngestEvents({
    limit: 5,
    enableAutoRefresh: true,
  });

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

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Ingestions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive text-center py-4">
            Failed to load: {getErrorMessage(error)}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.events.length === 0) {
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
        <div className="flex flex-col gap-1">
          <CardTitle>Recent Ingestions</CardTitle>
          <p className="text-xs text-muted-foreground">
            Last 5 ingestion jobs · Click any row to open Ingestion Management.
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {data.events.map((event) => {
            return (
              <div
                key={event.id}
                className="flex items-start justify-between gap-3 py-3 border-b border-border last:border-0 hover:bg-muted/30 rounded-lg px-2 -mx-2 transition-colors cursor-pointer group"
                onClick={() => navigate("/ingest")}
              >
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{
                          backgroundColor:
                            event.status === "completed"
                              ? "#10b981"
                              : event.status === "failed"
                                ? "#ef4444"
                                : "#f59e0b",
                        }}
                      />
                      {getSourceDisplayName(event.source)}
                    </span>
                    <IngestStatusBadge status={event.status} />
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
