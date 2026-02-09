import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export const Sparkline = ({
  data,
  width = 100,
  height = 30,
  color = "currentColor",
  className,
}: SparklineProps) => {
  const path = useMemo(() => {
    if (data.length === 0) return "";

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1 || 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    });

    return `M ${points.join(" L ")}`;
  }, [data, width, height]);

  if (data.length === 0) {
    return (
      <svg
        width={width}
        height={height}
        className={cn("text-muted-foreground", className)}
      >
        <line
          x1="0"
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2,2"
        />
      </svg>
    );
  }

  return (
    <svg
      width={width}
      height={height}
      className={cn("overflow-visible", className)}
    >
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-80"
      />
      <circle
        cx={((data.length - 1) / (data.length - 1 || 1)) * width}
        cy={
          height -
          ((data[data.length - 1] - Math.min(...data)) /
            (Math.max(...data) - Math.min(...data) || 1)) *
            height
        }
        r="2"
        fill={color}
        className="opacity-90"
      />
    </svg>
  );
};
