import type { ReactNode, ComponentType } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ComponentType<{ className?: string }>;
  iconColor?: string;
  gradient?: boolean;
  stats?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export const PageHeader = ({
  title,
  description,
  icon: Icon,
  iconColor = "text-teal-600 dark:text-teal-400",
  gradient = false,
  stats,
  actions,
  className,
}: PageHeaderProps) => {
  if (gradient) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 dark:from-teal-950/20 dark:via-blue-950/20 dark:to-indigo-950/20 border border-teal-200/50 dark:border-teal-800/50 p-6 md:p-8",
          className,
        )}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            {Icon && (
              <div className="p-3 rounded-xl bg-white/80 dark:bg-teal-900/30 backdrop-blur-sm border border-teal-200/50 dark:border-teal-700/50 shadow-lg">
                <Icon className={cn("w-6 h-6", iconColor)} />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400 bg-clip-text text-transparent">
                {title}
              </h1>
              {description && (
                <p className="text-teal-700/80 dark:text-teal-300/80 mt-1 text-sm">
                  {description}
                </p>
              )}
            </div>
            {actions && <div className="flex-shrink-0">{actions}</div>}
          </div>
          {stats && <div className="mt-6">{stats}</div>}
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/20 dark:bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-2 rounded-lg bg-muted">
              <Icon className={cn("w-5 h-5", iconColor)} />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
            {description && (
              <p className="text-muted-foreground mt-1 text-sm">
                {description}
              </p>
            )}
          </div>
        </div>
        {actions && <div className="flex-shrink-0">{actions}</div>}
      </div>
      {stats && <div className="mt-4">{stats}</div>}
    </div>
  );
};
