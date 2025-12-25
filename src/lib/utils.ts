import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
