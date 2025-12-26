import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSentimentInfo(sentiment: number | null): {
  variant: "positive" | "negative" | "neutral";
  label: string;
} {
  if (sentiment === null) {
    return { variant: "neutral", label: "Neutral" };
  }
  if (sentiment > 0.1) {
    return { variant: "positive", label: "Positive" };
  }
  if (sentiment < -0.1) {
    return { variant: "negative", label: "Negative" };
  }
  return { variant: "neutral", label: "Neutral" };
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
