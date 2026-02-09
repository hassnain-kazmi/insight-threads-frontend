import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import type { DocumentResponse, KeywordResponse } from "@/types/api";
import { DEFAULT_PAGE_SIZE } from "@/constants";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const buildQueryString = (
  params: Record<string, string | number | boolean | undefined | null>,
): string => {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    searchParams.append(key, String(value));
  }
  const s = searchParams.toString();
  return s ? `?${s}` : "";
};

export const getSentimentInfo = (
  sentiment: number | null,
): {
  variant: "positive" | "negative" | "neutral";
  label: string;
  description: string;
} => {
  if (sentiment === null) {
    return {
      variant: "neutral",
      label: "Neutral",
      description: "No sentiment data available",
    };
  }
  if (sentiment > 0.3) {
    return {
      variant: "positive",
      label: "Very Positive",
      description: "Strongly positive sentiment",
    };
  }
  if (sentiment > 0.1) {
    return {
      variant: "positive",
      label: "Positive",
      description: "Generally positive sentiment",
    };
  }
  if (sentiment < -0.3) {
    return {
      variant: "negative",
      label: "Very Negative",
      description: "Strongly negative sentiment",
    };
  }
  if (sentiment < -0.1) {
    return {
      variant: "negative",
      label: "Negative",
      description: "Generally negative sentiment",
    };
  }
  return {
    variant: "neutral",
    label: "Neutral",
    description: "Neutral or balanced sentiment",
  };
};

export const getClusterDisplayName = (
  clusterId: string,
  keywords?: KeywordResponse[],
  maxKeywords = 3,
): string => {
  if (keywords && keywords.length > 0) {
    const sorted = [...keywords].sort(
      (a, b) => (b.weight ?? 0) - (a.weight ?? 0),
    );
    const topKeywords = sorted
      .slice(0, maxKeywords)
      .map((k) => k.keyword)
      .join(", ");
    return topKeywords || `Cluster ${clusterId.slice(0, 8)}`;
  }
  return `Cluster ${clusterId.slice(0, 8)}`;
};

export const getMomentumLabel = (
  momentum: number | null,
): {
  label: string;
  description: string;
} => {
  if (momentum === null) {
    return {
      label: "N/A",
      description: "Momentum data not available",
    };
  }
  if (momentum > 0.5) {
    return {
      label: "Rising",
      description: "Strong upward trend in mentions",
    };
  }
  if (momentum > 0.1) {
    return {
      label: "Growing",
      description: "Moderate upward trend",
    };
  }
  if (momentum < -0.5) {
    return {
      label: "Declining",
      description: "Strong downward trend in mentions",
    };
  }
  if (momentum < -0.1) {
    return {
      label: "Falling",
      description: "Moderate downward trend",
    };
  }
  return {
    label: "Stable",
    description: "No significant change in trend",
  };
};

export const formatDateTime = (dateString: string): string => {
  try {
    return format(new Date(dateString), "MMM dd, yyyy, h:mm a");
  } catch {
    return dateString;
  }
};

export const formatDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), "MMM dd, yyyy");
  } catch {
    return dateString;
  }
};

export const formatRelativeTime = (dateString: string): string => {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch {
    return dateString;
  }
};

export const getRelevancePercentage = (similarityScore: number): number => {
  const clamped = Math.max(0, Math.min(2, similarityScore));
  return Math.round(((2 - clamped) / 2) * 100);
};

export const getRelevanceDescription = (percentage: number): string => {
  if (percentage >= 90) return "Very high relevance";
  if (percentage >= 75) return "High relevance";
  if (percentage >= 60) return "Moderate relevance";
  if (percentage >= 40) return "Low relevance";
  return "Very low relevance";
};

export type DocumentSourceType = "rss" | "hackernews" | "github" | "unknown";

export const getDocumentSourceType = (
  document: DocumentResponse,
  sourceMap: Map<string, string | null>,
): DocumentSourceType => {
  if (document.ingest_event_id) {
    const source = sourceMap.get(document.ingest_event_id);
    if (source === "rss" || source === "hackernews" || source === "github") {
      return source;
    }
  }
  return getSourceTypeFromPath(document.source_path);
};

export const getSourceTypeFromPath = (
  sourcePath: string | null,
): DocumentSourceType => {
  if (!sourcePath) return "unknown";

  const lowerPath = sourcePath.toLowerCase();

  if (
    lowerPath.includes("news.ycombinator.com") ||
    lowerPath.includes("hackernews") ||
    lowerPath.includes("ycombinator")
  ) {
    return "hackernews";
  }

  if (
    lowerPath.includes("github.com") ||
    lowerPath.includes("api.github.com")
  ) {
    return "github";
  }

  if (
    lowerPath.includes("/rss") ||
    lowerPath.includes("/feed") ||
    lowerPath.includes("?feed=") ||
    lowerPath.endsWith(".xml") ||
    lowerPath.endsWith(".rss") ||
    lowerPath.includes("rss.xml") ||
    lowerPath.includes("feed.xml") ||
    lowerPath.includes("atom.xml")
  ) {
    return "rss";
  }

  return "unknown";
};

export const calculatePagination = (
  offset: number | undefined,
  limit: number | undefined,
  total: number,
) => {
  const pageSize = limit ?? DEFAULT_PAGE_SIZE;
  const offsetVal = offset ?? 0;
  const currentPage = Math.floor(offsetVal / pageSize) + 1;
  const totalPages = Math.ceil(total / pageSize);
  const startItem = offsetVal + 1;
  const endItem = Math.min(offsetVal + pageSize, total);

  return {
    pageSize,
    currentPage,
    totalPages,
    startItem,
    endItem,
  };
};

export const getSourceDisplayName = (
  source: DocumentSourceType | null,
): string => {
  switch (source) {
    case "rss":
      return "RSS";
    case "hackernews":
      return "Hacker News";
    case "github":
      return "GitHub";
    default:
      return "Unknown";
  }
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return String(error);
};
