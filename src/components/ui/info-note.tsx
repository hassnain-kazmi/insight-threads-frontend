import type { ReactNode } from "react";
import { Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InfoNoteProps {
  title?: string;
  children: ReactNode;
  variant?: "info" | "tip" | "warning";
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const variantStyles = {
  info: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50 text-blue-900 dark:text-blue-100",
  tip: "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-100",
  warning:
    "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-100",
};

export const InfoNote = ({
  title,
  children,
  variant = "info",
  dismissible = false,
  onDismiss,
  className,
}: InfoNoteProps) => {
  return (
    <div
      className={cn(
        "rounded-lg border p-4 space-y-2",
        variantStyles[variant],
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          {title && <h4 className="font-semibold text-sm mb-1">{title}</h4>}
          <div className="text-sm [&>p]:mb-2 [&>p:last-child]:mb-0">
            {children}
          </div>
        </div>
        {dismissible && onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 flex-shrink-0"
            onClick={onDismiss}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
