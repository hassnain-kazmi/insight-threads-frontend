import { useState } from "react";
import { PageTransition } from "@/components/ui/page-transition";
import { PageHeader } from "@/components/ui/page-header";
import { InfoNote } from "@/components/ui/info-note";
import { EmptyState } from "@/components/ui/empty-state";
import { Download } from "lucide-react";
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
import { formatDateTime, getSourceDisplayName } from "@/lib/utils";
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
              <p className="mt-1 text-sm font-medium">
                {getSourceDisplayName(event.source)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Started At
              </p>
              <p className="mt-1 text-sm">{formatDateTime(event.started_at)}</p>
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
                  : event.status === "running" || event.status === "processing"
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
      <EmptyState
        icon={Newspaper}
        title="No ingestion events"
        description="Trigger your first ingestion job using the form above to see events here."
      />
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
                <TableCell className="font-medium">
                  {getSourceDisplayName(event.source)}
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
                    : event.status === "running" ||
                      event.status === "processing"
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
  const [activeSource, setActiveSource] = useState<IngestionSource>("rss");
  const triggerMutation = useTriggerIngestion();

  const handleTrigger = async (
    source: IngestionSource,
    params: RSSParams | HackerNewsParams | GitHubParams
  ) => {
    try {
      if (source === "github") {
        const githubParams = params as GitHubParams;
        if (!githubParams.repos || githubParams.repos.length === 0) {
          return;
        }
        const invalidRepos = githubParams.repos.filter(
          (r) =>
            !r.owner || r.owner.length === 0 || !r.repo || r.repo.length === 0
        );
        if (invalidRepos.length > 0) {
          return;
        }
      }

      await triggerMutation.mutateAsync({
        source,
        source_params: params,
      });
      setActiveSource("rss");
    } catch (error) {
      console.error("Failed to trigger ingestion:", error);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="Ingestion Management"
          description="Configure and trigger data ingestion from various sources"
          icon={Download}
          iconColor="text-emerald-600 dark:text-emerald-400"
        />

        <Card>
          <CardHeader>
            <CardTitle>Trigger New Ingestion</CardTitle>
            <CardDescription>
              Select a source type and configure the ingestion parameters.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeSource}
              onValueChange={(value) =>
                setActiveSource(value as IngestionSource)
              }
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
                <InfoNote variant="info" className="mb-4">
                  <p>
                    <strong>RSS Feed Ingestion:</strong> Add one or more RSS
                    feed URLs to ingest blog posts, news articles, and other
                    syndicated content. The system will fetch the latest entries
                    from each feed and process them for analysis.
                  </p>
                  <p className="mt-2 text-xs">
                    <strong>Tips:</strong> Use the limit to control how many
                    entries per feed (default: 50). You can add multiple feeds
                    to ingest from various sources in one job. Common RSS feed
                    formats include XML and Atom.
                  </p>
                </InfoNote>
                <RSSIngestForm
                  onSubmit={(params) => handleTrigger("rss", params)}
                  isLoading={triggerMutation.isPending}
                />
              </TabsContent>

              <TabsContent value="hackernews" className="mt-6">
                <InfoNote variant="info" className="mb-4">
                  <p>
                    <strong>Hacker News Ingestion:</strong> Fetch stories
                    directly from Hacker News using their public API. Choose
                    from Top Stories (most upvoted), New Stories (recently
                    posted), or Best Stories (highest quality).
                  </p>
                  <p className="mt-2 text-xs">
                    <strong>Use Cases:</strong> Great for tracking tech trends,
                    startup news, and developer discussions. The limit controls
                    how many posts to fetch (default: 50). Note that Hacker News
                    rate limits apply.
                  </p>
                </InfoNote>
                <HackerNewsIngestForm
                  onSubmit={(params) => handleTrigger("hackernews", params)}
                  isLoading={triggerMutation.isPending}
                />
              </TabsContent>

              <TabsContent value="github" className="mt-6">
                <InfoNote variant="info" className="mb-4">
                  <p>
                    <strong>GitHub Repository Ingestion:</strong> Ingest
                    commits, issues, pull requests, and releases from any public
                    GitHub repository. Specify the owner (user or organization)
                    and repository name.
                  </p>
                  <p className="mt-2 text-xs">
                    <strong>Content Types:</strong> Select which types to
                    include. You can filter commits by date, and choose issue/PR
                    states (open, closed, or all). The limit applies per content
                    type. Use "Commits since" to fetch only recent commits (ISO
                    8601 format).
                  </p>
                </InfoNote>
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
            <InfoNote variant="tip" className="mb-4">
              <p>
                <strong>Ingestion Workflow:</strong> After triggering an
                ingestion, the job runs in the background. Status updates
                automatically: <strong>Pending</strong> →{" "}
                <strong>Processing</strong> → <strong>Running</strong> →{" "}
                <strong>Completed</strong> or <strong>Failed</strong>.
              </p>
              <p className="mt-2 text-xs">
                <strong>Processing Time:</strong> Ingestion duration depends on
                the amount of data. Once completed, documents are processed for
                sentiment analysis, clustering, and embedding generation. Click
                any event to view detailed information including error messages
                if something went wrong.
              </p>
            </InfoNote>
            <IngestEventsTable />
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
};
