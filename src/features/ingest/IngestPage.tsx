import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useIngestEvents,
  useTriggerIngestion,
  useIngestEvent,
} from "@/hooks/useIngest";
import type {
  IngestionSource,
  RSSParams,
  HackerNewsParams,
  GitHubParams,
} from "@/types/api";
import { Rss, Github, Newspaper, Eye } from "lucide-react";
import { IngestStatusBadge } from "@/components/ingest/IngestStatusBadge";
import {
  formatDistanceToNow,
  formatDuration,
  intervalToDuration,
} from "date-fns";
import { formatDateTime } from "@/lib/utils";
import { RSSIngestForm } from "./RSSIngestForm";
import { HackerNewsIngestForm } from "./HackerNewsIngestForm";
import { GitHubIngestForm } from "./GitHubIngestForm";

const IngestEventDetailModalContent = ({ eventId }: { eventId: string }) => {
  const { data: event, isLoading } = useIngestEvent(eventId);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Ingest Event Details</DialogTitle>
        <DialogDescription>
          Detailed information about this ingestion event
        </DialogDescription>
      </DialogHeader>
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ) : event ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Status
              </p>
              <div className="mt-1">
                <IngestStatusBadge status={event.status} />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Source
              </p>
              <p className="mt-1 text-sm font-medium capitalize">
                {event.source || "Unknown"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Started At
              </p>
              <p className="mt-1 text-sm">
                {formatDateTime(event.started_at)}
              </p>
            </div>
            {event.completed_at && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Completed At
                </p>
                <p className="mt-1 text-sm">
                  {formatDateTime(event.completed_at)}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Duration
              </p>
              <p className="mt-1 text-sm">
                {event.completed_at
                  ? formatDuration(
                      intervalToDuration({
                        start: new Date(event.started_at),
                        end: new Date(event.completed_at),
                      }),
                      { format: ["hours", "minutes", "seconds"] }
                    ) || "Less than a second"
                  : event.status === "running"
                  ? `Running for ${formatDistanceToNow(
                      new Date(event.started_at),
                      {
                        addSuffix: false,
                      }
                    )}`
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Event ID
              </p>
              <p className="mt-1 text-xs font-mono text-muted-foreground truncate">
                {event.id}
              </p>
            </div>
          </div>
          {event.error_message && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">
              <p className="text-sm font-medium text-red-900 dark:text-red-200 mb-1">
                Error Message
              </p>
              <p className="text-sm text-red-800 dark:text-red-300 whitespace-pre-wrap">
                {event.error_message}
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Event not found</p>
      )}
    </>
  );
};

const IngestEventsTable = () => {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const { data, isLoading, error } = useIngestEvents({
    limit: 50,
    enableAutoRefresh: true,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 w-24" />
            <Skeleton className="h-12 w-32" />
          </div>
        ))}
      </div>
    );
  }

  if (error || !data || data.events.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
          <Newspaper className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          No ingestion events
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Trigger your first ingestion job using the form above to see events
          here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Started</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.events.map((event) => (
              <TableRow
                key={event.id}
                className="hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => setSelectedEventId(event.id)}
              >
                <TableCell className="font-medium capitalize">
                  {event.source || "Unknown"}
                </TableCell>
                <TableCell>
                  <IngestStatusBadge status={event.status} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(event.started_at), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {event.completed_at
                    ? formatDuration(
                        intervalToDuration({
                          start: new Date(event.started_at),
                          end: new Date(event.completed_at),
                        }),
                        { format: ["hours", "minutes"] }
                      ) || "Less than a minute"
                    : event.status === "running"
                    ? `Running...`
                    : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEventId(event.id);
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
      {selectedEventId && (
        <Dialog
          open={!!selectedEventId}
          onOpenChange={(open) => !open && setSelectedEventId(null)}
        >
          <DialogContent className="max-w-2xl">
            <IngestEventDetailModalContent eventId={selectedEventId} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export const IngestPage = () => {
  const [activeSource, setActiveSource] = useState<IngestionSource | null>(
    null
  );
  const triggerMutation = useTriggerIngestion();

  const handleTrigger = async (
    source: IngestionSource,
    params: RSSParams | HackerNewsParams | GitHubParams
  ) => {
    try {
      await triggerMutation.mutateAsync({
        source,
        source_params: params,
      });
      setActiveSource(null);
    } catch {
      // feedback can be added via toast/alert if needed
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Ingestion Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Configure and trigger data ingestion from various sources.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trigger New Ingestion</CardTitle>
          <CardDescription>
            Select a source type and configure the ingestion parameters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeSource || undefined}
            onValueChange={(value) => setActiveSource(value as IngestionSource)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="rss" className="gap-2">
                <Rss className="w-4 h-4" />
                RSS Feeds
              </TabsTrigger>
              <TabsTrigger value="hackernews" className="gap-2">
                <Newspaper className="w-4 h-4" />
                Hacker News
              </TabsTrigger>
              <TabsTrigger value="github" className="gap-2">
                <Github className="w-4 h-4" />
                GitHub
              </TabsTrigger>
            </TabsList>

            <TabsContent value="rss" className="mt-6">
              <RSSIngestForm
                onSubmit={(params) => handleTrigger("rss", params)}
                isLoading={triggerMutation.isPending}
              />
            </TabsContent>

            <TabsContent value="hackernews" className="mt-6">
              <HackerNewsIngestForm
                onSubmit={(params) => handleTrigger("hackernews", params)}
                isLoading={triggerMutation.isPending}
              />
            </TabsContent>

            <TabsContent value="github" className="mt-6">
              <GitHubIngestForm
                onSubmit={(params) => handleTrigger("github", params)}
                isLoading={triggerMutation.isPending}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ingestion Events</CardTitle>
          <CardDescription>
            View and monitor all ingestion events and their status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <IngestEventsTable />
        </CardContent>
      </Card>
    </div>
  );
};
