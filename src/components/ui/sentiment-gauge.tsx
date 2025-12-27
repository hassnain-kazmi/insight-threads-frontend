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
  const percentage = ((normalizedValue + 1) / 2) * 100;
  const angle = (percentage / 100) * 180 - 90;

  const color = useMemo(() => {
    if (normalizedValue > 0.3) return "#10b981";
    if (normalizedValue < -0.3) return "#ef4444";
    return "#6b7280";
  }, [normalizedValue]);

  const radius = size / 2 - 10;
  const centerX = size / 2;
  const centerY = size / 2;

  const needleLength = radius * 0.7;
  const needleAngle = (angle * Math.PI) / 180;
  const needleX = centerX + needleLength * Math.cos(needleAngle);
  const needleY = centerY + needleLength * Math.sin(needleAngle);

  return (
    <div className={cn("relative", className)}>
      <svg width={size} height={size} className="transform -scale-y-100">
        <path
          d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${
            centerX + radius
          } ${centerY}`}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 ${
            percentage > 50 ? 1 : 0
          } 1 ${needleX} ${needleY}`}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          className="transition-all duration-500"
        />
        <line
          x1={centerX}
          y1={centerY}
          x2={needleX}
          y2={needleY}
          stroke="#1f2937"
          strokeWidth="3"
          strokeLinecap="round"
          className="transition-all duration-500"
        />
        <circle cx={centerX} cy={centerY} r="6" fill="#1f2937" />
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground">
        <span>Negative</span>
        <span>Neutral</span>
        <span>Positive</span>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="text-2xl font-semibold" style={{ color }}>
          {normalizedValue > 0 ? "+" : ""}
          {normalizedValue.toFixed(2)}
        </div>
      </div>
    </div>
  );
};
