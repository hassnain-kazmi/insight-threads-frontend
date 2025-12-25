import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useDocument } from "@/hooks/useDocuments";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, TrendingUp } from "lucide-react";

interface DocumentDetailDrawerProps {
  documentId: string | null;
  onClose: () => void;
}

const SentimentScore = ({ score }: { score: number | null }) => {
  if (score === null) return <span className="text-muted-foreground">N/A</span>;

  const getSentimentColor = (score: number) => {
    if (score > 0.3) return "text-emerald-600 dark:text-emerald-400";
    if (score < -0.3) return "text-red-600 dark:text-red-400";
    return "text-slate-600 dark:text-slate-400";
  };

  const getSentimentLabel = (score: number) => {
    if (score > 0.3) return "Positive";
    if (score < -0.3) return "Negative";
    return "Neutral";
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`font-medium ${getSentimentColor(score)}`}>
        {score.toFixed(3)}
      </span>
      <Badge variant="outline" className="text-xs">
        {getSentimentLabel(score)}
      </Badge>
    </div>
  );
};

export const DocumentDetailDrawer = ({
  documentId,
  onClose,
}: DocumentDetailDrawerProps) => {
  const { data: document, isLoading } = useDocument(documentId || "");

  return (
    <Dialog open={!!documentId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : document ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">
                {document.title || "Untitled Document"}
              </DialogTitle>
              <DialogDescription>
                Document details and analysis
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Status
                  </p>
                  <Badge
                    variant={document.processed ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {document.processed ? "Processed" : "Pending"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Created
                  </p>
                  <p className="text-sm">
                    {formatDistanceToNow(new Date(document.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                {document.processed_at && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Processed At
                    </p>
                    <p className="text-sm">
                      {formatDistanceToNow(new Date(document.processed_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                )}
                {document.source_path && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Source
                    </p>
                    <a
                      href={document.source_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span className="truncate max-w-xs">
                        {document.source_path}
                      </span>
                    </a>
                  </div>
                )}
              </div>

              {document.sentiment && (
                <div className="border-t border-border pt-4">
                  <h3 className="text-sm font-semibold mb-3">
                    Sentiment Analysis
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Combined Score
                      </p>
                      <SentimentScore
                        score={document.sentiment.combined_score}
                      />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        VADER Score
                      </p>
                      <SentimentScore score={document.sentiment.vader} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        DistilBERT Score
                      </p>
                      <SentimentScore
                        score={document.sentiment.distilbert_score}
                      />
                    </div>
                    {document.sentiment.distilbert_label && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          DistilBERT Label
                        </p>
                        <Badge variant="outline" className="capitalize">
                          {document.sentiment.distilbert_label}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {document.cluster_memberships &&
                document.cluster_memberships.length > 0 && (
                  <div className="border-t border-border pt-4">
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Cluster Memberships
                    </h3>
                    <div className="space-y-2">
                      {document.cluster_memberships.map((membership) => (
                        <div
                          key={membership.cluster_id}
                          className="flex items-center justify-between p-3 rounded-lg border border-border bg-card"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-muted-foreground">
                              {membership.cluster_id.slice(0, 8)}...
                            </span>
                          </div>
                          {membership.membership_strength !== null && (
                            <Badge variant="outline" className="text-xs">
                              Strength:{" "}
                              {(membership.membership_strength * 100).toFixed(
                                1
                              )}
                              %
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {document.raw_text && (
                <div className="border-t border-border pt-4">
                  <h3 className="text-sm font-semibold mb-3">Raw Text</h3>
                  <div className="p-4 rounded-lg border border-border bg-muted/30 max-h-64 overflow-y-auto">
                    <p className="text-sm whitespace-pre-wrap text-foreground">
                      {document.raw_text}
                    </p>
                  </div>
                </div>
              )}

              {!document.sentiment && !document.cluster_memberships?.length && (
                <div className="border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No sentiment analysis or cluster memberships available. This
                    document may not be fully processed yet.
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">Document not found</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
