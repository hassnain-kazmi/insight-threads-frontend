import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import type { KeywordResponse } from "@/types/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSentimentInfo(sentiment: number | null): {
  variant: "positive" | "negative" | "neutral";
  label: string;
  description: string;
} {
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
}

/**
 * Get cluster display name from keywords or fallback to ID
 */
export function getClusterDisplayName(
  clusterId: string,
  keywords?: KeywordResponse[],
  maxKeywords: number = 3
): string {
  if (keywords && keywords.length > 0) {
    const sorted = [...keywords].sort(
      (a, b) => (b.weight ?? 0) - (a.weight ?? 0)
    );
    const topKeywords = sorted
      .slice(0, maxKeywords)
      .map((k) => k.keyword)
      .join(", ");
    return topKeywords || `Cluster ${clusterId.slice(0, 8)}`;
  }
  return `Cluster ${clusterId.slice(0, 8)}`;
}

/**
 * Get human-readable momentum interpretation
 */
export function getMomentumLabel(momentum: number | null): {
  label: string;
  description: string;
} {
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
}

/**
 * Format a date string to a readable date and time format
 * Example: "Jan 15, 2024, 10:30 AM"
 */
export const formatDateTime = (dateString: string): string => {
  try {
    return format(new Date(dateString), "MMM dd, yyyy, h:mm a");
  } catch {
    return dateString;
  }
};

/**
 * Format a date string to a short date format
 * Example: "Jan 15, 2024"
 */
export const formatDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), "MMM dd, yyyy");
  } catch {
    return dateString;
  }
};

/**
 * Format a date string as relative time
 * Example: "2 hours ago", "3 days ago"
 */
export const formatRelativeTime = (dateString: string): string => {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch {
    return dateString;
  }
};

/**
 * Get relevance percentage from similarity score (0-2 range, lower = more similar)
 */
export function getRelevancePercentage(similarityScore: number): number {
  const clamped = Math.max(0, Math.min(2, similarityScore));
  return Math.round(((2 - clamped) / 2) * 100);
}

/**
 * Get relevance description
 */
export function getRelevanceDescription(percentage: number): string {
  if (percentage >= 90) return "Very high relevance";
  if (percentage >= 75) return "High relevance";
  if (percentage >= 60) return "Moderate relevance";
  if (percentage >= 40) return "Low relevance";
  return "Very low relevance";
}

/**
 * Get source type from source path
 * Returns "rss" | "hackernews" | "github" | "unknown"
 */
export function getSourceTypeFromPath(
  sourcePath: string | null
): "rss" | "hackernews" | "github" | "unknown" {
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
    lowerPath.includes("atom.xml") ||
    lowerPath.includes("http")
  ) {
    return "rss";
  }

  return "unknown";
}

/**
 * Calculate pagination values from filters
 */
export function calculatePagination(
  offset: number | undefined,
  limit: number | undefined,
  total: number
) {
  const pageSize = limit || 50;
  const currentPage = Math.floor((offset || 0) / pageSize) + 1;
  const totalPages = Math.ceil(total / pageSize);
  const startItem = (offset || 0) + 1;
  const endItem = Math.min((offset || 0) + pageSize, total);

  return {
    pageSize,
    currentPage,
    totalPages,
    startItem,
    endItem,
  };
}

export function getSourceDisplayName(
  source: "rss" | "hackernews" | "github" | null
): string {
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
}
