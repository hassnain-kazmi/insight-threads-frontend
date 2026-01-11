import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface SentimentGaugeProps {
  value: number;
  size?: number;
  className?: string;
}

export const SentimentGauge = ({
  value,
  size = 120,
  className,
}: SentimentGaugeProps) => {
  const normalizedValue = Math.max(-1, Math.min(1, value));

  const color = useMemo(() => {
    if (normalizedValue > 0.3) return "#10b981";
    if (normalizedValue < -0.3) return "#ef4444";
    return "#6b7280";
  }, [normalizedValue]);

  const svgWidth = size;
  const svgHeight = size * 0.6;
  const radius = size * 0.35;
  const centerX = svgWidth / 2;
  const centerY = svgHeight - 5;

  const angle = 180 - ((normalizedValue + 1) / 2) * 180;
  const angleRad = (angle * Math.PI) / 180;

  const startX = centerX - radius;
  const startY = centerY;
  const endX = centerX + radius;
  const endY = centerY;

  const needleLength = radius * 0.8;
  const needleX = centerX + needleLength * Math.cos(angleRad);
  const needleY = centerY - needleLength * Math.sin(angleRad);

  return (
    <div
      className={cn("relative flex flex-col items-center w-full", className)}
    >
      <svg width={svgWidth} height={svgHeight} className="overflow-visible">
        <defs>
          {/* Gradient for the arc - red to gray to green */}
          <linearGradient
            id="sentimentGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#6b7280" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        {/* Background arc with gradient (full semi-circle) */}
        <path
          d={`M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`}
          fill="none"
          stroke="url(#sentimentGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          opacity={0.3}
        />
        {/* Needle */}
        <line
          x1={centerX}
          y1={centerY}
          x2={needleX}
          y2={needleY}
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          className="transition-all duration-500"
        />
        {/* Needle tip */}
        <circle cx={needleX} cy={needleY} r="4" fill={color} />
      </svg>
      {/* Value display */}
      <div className="mt-1 text-center">
        <div className="text-xl font-semibold" style={{ color }}>
          {normalizedValue > 0 ? "+" : ""}
          {normalizedValue.toFixed(2)}
        </div>
      </div>
      {/* Labels */}
      <div className="w-full flex justify-between text-xs text-muted-foreground mt-1 px-1">
        <span>Negative</span>
        <span>Neutral</span>
        <span>Positive</span>
      </div>
    </div>
  );
};
