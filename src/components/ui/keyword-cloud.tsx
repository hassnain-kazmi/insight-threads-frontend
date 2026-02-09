import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Keyword {
  id: string;
  keyword: string;
  weight: number | null;
}

interface KeywordCloudProps {
  keywords: Keyword[];
  maxKeywords?: number;
  className?: string;
}

export const KeywordCloud = ({
  keywords,
  maxKeywords = 20,
  className,
}: KeywordCloudProps) => {
  const sortedKeywords = useMemo(() => {
    return [...keywords]
      .sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0))
      .slice(0, maxKeywords);
  }, [keywords, maxKeywords]);

  const getSize = (weight: number | null) => {
    if (!weight) return "text-sm";
    if (weight > 0.8) return "text-lg font-semibold";
    if (weight > 0.5) return "text-base font-medium";
    return "text-sm";
  };

  const getVariant = (index: number) => {
    if (index < 3) return "default";
    if (index < 8) return "secondary";
    return "outline";
  };

  if (sortedKeywords.length === 0) {
    return (
      <div className={cn("text-sm text-muted-foreground", className)}>
        No keywords available
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {sortedKeywords.map((keyword, index) => (
        <Badge
          key={keyword.id}
          variant={getVariant(index)}
          className={cn(
            "px-3 py-1.5 transition-all hover:scale-105 cursor-default",
            getSize(keyword.weight),
          )}
        >
          {keyword.keyword}
        </Badge>
      ))}
    </div>
  );
};
