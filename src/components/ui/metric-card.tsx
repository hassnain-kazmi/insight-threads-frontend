import type { ReactNode, ComponentType } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: ComponentType<{ className?: string }>;
  color: string;
  isLoading?: boolean;
  tooltip?: string;
  onClick?: () => void;
  trend?: {
    value: number;
    label: string;
  };
  sparkline?: ReactNode;
}

export const MetricCard = ({
  label,
  value,
  icon: Icon,
  color,
  isLoading,
  tooltip,
  onClick,
  trend,
  sparkline,
}: MetricCardProps) => {
  if (isLoading) {
    return (
      <Card className="border-border/50 h-full flex flex-col">
        <CardContent className="p-5 flex-1 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="w-11 h-11 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const content = (
    <Card
      className={cn(
        "h-full hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/50 flex flex-col",
        onClick && "cursor-pointer hover:border-primary/30",
      )}
      onClick={onClick}
    >
      <CardContent className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm text-muted-foreground">{label}</p>
              {tooltip && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        aria-label="More information"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-semibold text-foreground">{value}</p>
              {trend && (
                <span
                  className={cn(
                    "text-xs font-medium",
                    trend.value > 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : trend.value < 0
                        ? "text-red-600 dark:text-red-400"
                        : "text-muted-foreground",
                  )}
                >
                  {trend.value > 0 ? "↑" : trend.value < 0 ? "↓" : "→"}{" "}
                  {trend.label}
                </span>
              )}
            </div>
            {sparkline && <div className="mt-2 opacity-70">{sparkline}</div>}
          </div>
          <div className={`p-3 rounded-lg bg-muted ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return content;
};
