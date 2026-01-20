import { useEffect, useRef } from "react";
import { useIngestEvents } from "@/hooks/useIngest";
import { toast } from "sonner";
import { CheckCircle2, XCircle } from "lucide-react";
import { getSourceDisplayName } from "@/lib/utils";
import type { IngestEventResponse } from "@/types/api";

export const IngestionNotificationListener = () => {
  const { data } = useIngestEvents({
    limit: 50,
    enableAutoRefresh: true,
  });

  const previousStatusMap = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    if (!data?.events) return;

    data.events.forEach((event: IngestEventResponse) => {
      const previousStatus = previousStatusMap.current.get(event.id);
      const currentStatus = event.status;

      if (
        previousStatus &&
        previousStatus !== "completed" &&
        previousStatus !== "failed" &&
        currentStatus === "completed"
      ) {
        toast.success("Ingestion completed", {
          description: `${getSourceDisplayName(
            event.source
          )} ingestion has finished successfully.`,
          icon: <CheckCircle2 className="w-4 h-4" />,
          duration: 5000,
        });
      }

      if (
        previousStatus &&
        previousStatus !== "completed" &&
        previousStatus !== "failed" &&
        currentStatus === "failed"
      ) {
        toast.error("Ingestion failed", {
          description: `${getSourceDisplayName(
            event.source
          )} ingestion failed. ${
            event.error_message
              ? event.error_message
              : "Check details for more information."
          }`,
          icon: <XCircle className="w-4 h-4" />,
          duration: 7000,
        });
      }
      previousStatusMap.current.set(event.id, currentStatus);
    });
  }, [data?.events]);

  return null;
};
