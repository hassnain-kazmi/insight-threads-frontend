import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface IngestStatusBadgeProps {
  status:
    | "pending"
    | "processing"
    | "running"
    | "completed"
    | "failed"
    | null
    | undefined;
  startedAt?: string;
}

export const IngestStatusBadge = ({
  status,
  startedAt,
}: IngestStatusBadgeProps) => {
  let normalizedStatus = status;
  if (status === "pending" && startedAt) {
    const secondsSinceStart =
      (Date.now() - new Date(startedAt).getTime()) / 1000;
    if (secondsSinceStart < 30) {
      normalizedStatus = "processing";
    }
  }

  const statusConfig = {
    pending: {
      icon: Clock,
      label: "Pending",
      variant: "outline" as const,
      className: "text-slate-600",
    },
    processing: {
      icon: Loader2,
      label: "Processing",
      variant: "secondary" as const,
      className: "text-blue-600 animate-spin",
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
  } as const;

  const validStatus =
    normalizedStatus && normalizedStatus in statusConfig
      ? (normalizedStatus as keyof typeof statusConfig)
      : "pending";

  const config = statusConfig[validStatus];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="gap-1.5">
      <Icon className={`w-3 h-3 ${config.className}`} />
      {config.label}
    </Badge>
  );
};
