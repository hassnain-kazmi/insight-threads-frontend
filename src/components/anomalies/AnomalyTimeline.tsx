import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addDays, format, startOfDay } from "date-fns";
import type { AnomalyResponse } from "@/types/api";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnomalyTimelineProps {
  anomalies: AnomalyResponse[];
  days?: number;
}

export const AnomalyTimeline = ({
  anomalies,
  days = 30,
}: AnomalyTimelineProps) => {
  const [animateIn, setAnimateIn] = useState(false);

  const timelineData = useMemo(() => {
    const today = startOfDay(new Date());
    const data: Record<string, { count: number; maxScore: number }> = {};

    anomalies.forEach((anomaly) => {
      try {
        const parsed = anomaly.anomaly_date.match(/^\d{4}-\d{2}-\d{2}$/)
          ? new Date(`${anomaly.anomaly_date}T12:00:00`)
          : new Date(anomaly.anomaly_date);

        if (Number.isNaN(parsed.getTime())) {
          return;
        }
        const date = startOfDay(parsed);
        const key = format(date, "yyyy-MM-dd");

        if (!data[key]) {
          data[key] = { count: 0, maxScore: 0 };
        }
        data[key].count++;
        data[key].maxScore = Math.max(data[key].maxScore, anomaly.score);
      } catch {
        return;
      }
    });

    const startDate = startOfDay(addDays(today, -(days - 1)));
    const endDate = today;

    const result = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const key = format(currentDate, "yyyy-MM-dd");
      const dayData = data[key] || { count: 0, maxScore: 0 };
      result.push({
        date: key,
        displayDate: format(currentDate, "MMM dd"),
        ...dayData,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const maxCount = Math.max(...result.map((d) => d.count), 1);
    const maxScore = Math.max(...result.map((d) => d.maxScore), 1);

    return { data: result, maxCount, maxScore };
  }, [anomalies, days]);

  useEffect(() => {
    const idReset = window.setTimeout(() => setAnimateIn(false), 0);
    const idShow = window.setTimeout(() => setAnimateIn(true), 20);
    return () => {
      window.clearTimeout(idReset);
      window.clearTimeout(idShow);
    };
  }, [timelineData.data]);

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
        <div className="space-y-4">
          <div className="relative">
            <div className="h-80 bg-gradient-to-b from-muted/10 to-muted/5 rounded-lg p-4 border border-border/50">
              <div className="h-full flex gap-3">
                <div className="w-9 shrink-0 flex flex-col justify-between py-1 text-[10px] text-muted-foreground select-none">
                  {[
                    maxCount,
                    Math.round(maxCount * 0.75),
                    Math.round(maxCount * 0.5),
                    Math.round(maxCount * 0.25),
                    0,
                  ].map((v, i) => (
                    <div key={`${v}-${i}`} className="leading-none">
                      {v}
                    </div>
                  ))}
                </div>

                <div className="relative flex-1">
                  <div className="absolute inset-0 pointer-events-none">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="absolute left-0 right-0 border-t border-border/40"
                        style={{ top: `${(i / 4) * 100}%` }}
                      />
                    ))}
                  </div>

                  <div className="relative h-full flex items-end gap-[1px]">
                    {timelineData.data.map((day, index) => {
                      const heightPercent =
                        maxCount > 0 ? (day.count / maxCount) * 100 : 0;

                      const normalizedScore =
                        maxScore > 0
                          ? Math.min(Math.sqrt(day.maxScore / maxScore), 1)
                          : 0;

                      const getColor = (score: number) => {
                        if (score >= 0.7) return "#ef4444";
                        if (score >= 0.4) return "#f97316";
                        if (score >= 0.2) return "#eab308";
                        return "#6b7280";
                      };

                      const color = getColor(normalizedScore);
                      const hasData = day.count > 0;
                      const isSpike =
                        hasData && maxCount > 0 && day.count >= maxCount * 0.75;

                      const availableHeight = 288;

                      const calculatedHeight = hasData
                        ? (heightPercent / 100) * availableHeight
                        : 1;
                      const finalHeight =
                        hasData && calculatedHeight < 3 ? 3 : calculatedHeight;

                      return (
                        <div
                          key={day.date}
                          className="flex-1 flex flex-col items-center justify-end group relative"
                          style={{ minWidth: "3px" }}
                        >
                          <div
                            className="w-full rounded-t-md transition-all duration-500 ease-out hover:opacity-95 hover:scale-105 cursor-pointer relative"
                            style={{
                              height: `${animateIn ? finalHeight : 0}px`,
                              backgroundColor: hasData ? color : "transparent",
                              opacity: hasData ? 0.9 : 0.03,
                              maxHeight: `${availableHeight}px`,
                              boxShadow: hasData
                                ? isSpike
                                  ? `0 4px 10px ${color}70, 0 2px 6px ${color}40, inset 0 1px 0 ${color}30`
                                  : `0 3px 6px ${color}50, 0 1px 3px ${color}30, inset 0 1px 0 ${color}20`
                                : "none",
                            }}
                            title={`${day.displayDate}: ${day.count} anomaly${
                              day.count !== 1 ? "ies" : ""
                            }${
                              day.maxScore > 0
                                ? `, score: ${day.maxScore.toFixed(2)}`
                                : ""
                            }`}
                          >
                            {hasData && (
                              <>
                                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                  {day.count}
                                </div>
                                <div
                                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                  style={{ backgroundColor: color }}
                                />
                              </>
                            )}
                          </div>

                          {(index % 7 === 0 || hasData) && (
                            <span
                              className={cn(
                                "text-[9px] mt-1.5 whitespace-nowrap",
                                hasData
                                  ? "text-foreground font-medium"
                                  : "text-muted-foreground",
                              )}
                            >
                              {day.displayDate}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: "#ef4444" }}
                ></div>
                <span>Critical</span>
              </span>
              <span className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: "#f97316" }}
                ></div>
                <span>High</span>
              </span>
              <span className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: "#eab308" }}
                ></div>
                <span>Medium</span>
              </span>
              <span className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: "#6b7280" }}
                ></div>
                <span>Low</span>
              </span>
            </div>
            <div className="text-muted-foreground/70">
              Max: {maxCount} anomalies
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
