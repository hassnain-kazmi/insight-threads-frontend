import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";

export const IngestStatusBadge = ({
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
