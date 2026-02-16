import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PausedNoticeBannerProps {
  className?: string;
}

export const PausedNoticeBanner = ({ className }: PausedNoticeBannerProps) => (
  <div
    className={cn(
      "bg-amber-500/5 backdrop-blur-3xl border-b border-amber-500/20 px-4 py-3 flex items-center justify-center gap-2 text-sm text-amber-800 dark:text-amber-200",
      className,
    )}
  >
    <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
    <span>
      Notice: This project is paused. For a working demonstration, please
      contact the owner at{" "}
      <a
        href="mailto:syedhassnainkazmi07@gmail.com"
        className="font-medium underline underline-offset-2 hover:text-amber-900 dark:hover:text-amber-100"
      >
        syedhassnainkazmi07@gmail.com
      </a>
    </span>
  </div>
);
