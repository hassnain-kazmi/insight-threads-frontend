import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useIngestEvents } from "@/hooks/useClusters";
import { Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const IngestStatusBadge = ({
  status,
}: {
  status: "pending" | "running" | "completed" | "failed";
}) => {
  const statusConfig = {
    pending: {
      icon: Clock,
      label: "Pending",
      variant: "outline" as const,
      className: "text-slate-600",
    },
    running: {
      icon: Loader2,
      label: "Running",
      variant: "secondary" as const,
      className: "text-blue-600 animate-spin",
    },
    completed: {
      icon: CheckCircle2,
      label: "Completed",
      variant: "positive" as const,
      className: "text-green-600",
    },
    failed: {
      icon: XCircle,
      label: "Failed",
      variant: "negative" as const,
      className: "text-red-600",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="gap-1.5">
      <Icon className={`w-3 h-3 ${config.className}`} />
      {config.label}
    </Badge>
  );
};

export const RecentIngestions = () => {
  const { data, isLoading, error } = useIngestEvents();

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
    <Card>
      <CardHeader>
        <CardTitle>Recent Ingestions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.events.map((event) => (
            <div
              key={event.id}
              className="flex items-start justify-between gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
            >
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground capitalize">
                    {event.source || "Unknown"}
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
