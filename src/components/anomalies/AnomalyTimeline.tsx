import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO, startOfDay, differenceInDays } from "date-fns";
import type { AnomalyResponse } from "@/types/api";
import { AlertTriangle } from "lucide-react";

interface AnomalyTimelineProps {
  anomalies: AnomalyResponse[];
  days?: number;
}

export const AnomalyTimeline = ({
  anomalies,
  days = 30,
}: AnomalyTimelineProps) => {
  const timelineData = useMemo(() => {
    const today = startOfDay(new Date());
    const data: Record<string, { count: number; maxScore: number }> = {};

    anomalies.forEach((anomaly) => {
      try {
        const date = startOfDay(parseISO(anomaly.anomaly_date));
        const daysDiff = differenceInDays(today, date);

        if (daysDiff >= 0 && daysDiff < days) {
          const key = format(date, "yyyy-MM-dd");
          if (!data[key]) {
            data[key] = { count: 0, maxScore: 0 };
          }
          data[key].count++;
          data[key].maxScore = Math.max(data[key].maxScore, anomaly.score);
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes("Invalid")) {
          return;
        }
      }
    });

    const result = [];
    for (let i = 0; i < days; i++) {
      const date = startOfDay(new Date());
      date.setDate(date.getDate() - i);
      const key = format(date, "yyyy-MM-dd");
      const dayData = data[key] || { count: 0, maxScore: 0 };
      result.push({
        date: key,
        displayDate: format(date, "MMM dd"),
        ...dayData,
      });
    }

    const reversed = result.reverse();

    const maxCount = Math.max(...reversed.map((d) => d.count), 1);
    const maxScore = Math.max(...reversed.map((d) => d.maxScore), 1);

    return { data: reversed, maxCount, maxScore };
  }, [anomalies, days]);

  const maxCount = timelineData.maxCount;
  const maxScore = timelineData.maxScore;

  if (anomalies.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          Anomaly Timeline (Last {days} Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-end gap-1 h-32">
            {timelineData.data.map((day, index) => {
              const heightPercent = (day.count / maxCount) * 100;
              const intensity = day.maxScore / maxScore;
              const color =
                intensity > 0.7
                  ? "#ef4444"
                  : intensity > 0.4
                  ? "#f59e0b"
                  : "#6b7280";

              return (
                <div
                  key={day.date}
                  className="flex-1 flex flex-col items-center gap-1 group"
                  title={`${day.displayDate}: ${day.count} anomaly${
                    day.count !== 1 ? "ies" : ""
                  }, max score: ${day.maxScore.toFixed(2)}`}
                >
                  <div
                    className="w-full rounded-t transition-all duration-300 hover:opacity-80 cursor-help relative"
                    style={{
                      height: `${Math.max(heightPercent, 2)}%`,
                      backgroundColor: color,
                      opacity: day.count > 0 ? 0.7 + intensity * 0.3 : 0.1,
                    }}
                  >
                    {day.count > 0 && (
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        {day.count}
                      </div>
                    )}
                  </div>
                  {index % 7 === 0 && (
                    <span className="text-[10px] text-muted-foreground rotate-45 origin-left">
                      {day.displayDate}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <span>Lower activity</span>
            <span>Higher activity</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
