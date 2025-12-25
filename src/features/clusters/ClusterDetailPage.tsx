import { useParams, useNavigate } from "react-router-dom";
import { useCluster } from "@/hooks/useClusters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  TrendingUp,
  FileText,
  Lightbulb,
  AlertTriangle,
  Tag,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { useMemo, useCallback } from "react";
import { getSentimentInfo } from "@/lib/utils";

export const ClusterDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: cluster, isLoading, error } = useCluster(id || "");

  const chartData = useMemo(() => {
    if (!cluster || cluster.timeseries.length === 0) return [];
    return cluster.timeseries
      .map((ts) => ({
        date: ts.summary_date,
        mentionCount: ts.mention_count,
        avgSentiment: ts.avg_sentiment ?? 0,
        momentum: ts.momentum ?? 0,
        forecastLower: ts.forecast_lower ?? null,
        forecastUpper: ts.forecast_upper ?? null,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [cluster?.timeseries]);

  const latestMomentum = useMemo(() => {
    if (!cluster || cluster.timeseries.length === 0) return null;
    const sorted = [...cluster.timeseries].sort(
      (a, b) =>
        new Date(b.summary_date).getTime() - new Date(a.summary_date).getTime()
    );
    return sorted[0].momentum;
  }, [cluster?.timeseries]);

  const sortedKeywords = useMemo(() => {
    if (!cluster || cluster.keywords.length === 0) return [];
    return [...cluster.keywords].sort(
      (a, b) => (b.weight ?? 0) - (a.weight ?? 0)
    );
  }, [cluster?.keywords]);

  const handleBackClick = useCallback(() => {
    navigate("/clusters");
  }, [navigate]);

  const formatChartDate = useCallback((value: string) => {
    try {
      return format(new Date(value), "MMM dd");
    } catch {
      return value;
    }
  }, []);

  const formatTooltipDate = useCallback((value: string) => {
    try {
      return format(new Date(value), "PP");
    } catch {
      return value;
    }
  }, []);

  const formatFullDateTime = useCallback((value: string) => {
    try {
      return format(new Date(value), "PPp");
    } catch {
      return value;
    }
  }, []);

  const chartTooltipStyle = useMemo(
    () => ({
      backgroundColor: "white",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
    }),
    []
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !cluster) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={handleBackClick} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Clusters
        </Button>
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <h3 className="text-lg font-medium text-foreground mb-2">
            Cluster not found
          </h3>
          <p className="text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "The requested cluster could not be found."}
          </p>
        </div>
      </div>
    );
  }

  const trendingScore = cluster.trending_score ?? 0;
  const trendingPercent = Math.round(trendingScore * 100);

  const sentiment = cluster.avg_sentiment;
  const { variant: sentimentVariant, label: sentimentLabel } =
    getSentimentInfo(sentiment);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handleBackClick}
          className="flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold text-foreground">
            Cluster #{cluster.id.slice(0, 8)}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Created {formatFullDateTime(cluster.created_at)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Trending Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-foreground">
                {trendingPercent}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-500 ease-out"
                style={{ width: `${trendingPercent}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-semibold text-foreground">
              {cluster.document_count}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Sentiment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant={sentimentVariant}>{sentimentLabel}</Badge>
              {sentiment !== null && (
                <span className="text-lg font-semibold text-foreground">
                  {sentiment.toFixed(2)}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Momentum
            </CardTitle>
          </CardHeader>
          <CardContent>
            {latestMomentum !== null ? (
              <div className="flex items-center gap-2">
                <TrendingUp
                  className={`w-5 h-5 ${
                    latestMomentum > 0
                      ? "text-green-500"
                      : latestMomentum < 0
                      ? "text-red-500"
                      : "text-muted-foreground"
                  }`}
                />
                <span className="text-lg font-semibold text-foreground">
                  {latestMomentum > 0 ? "+" : ""}
                  {latestMomentum.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">N/A</span>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Timeseries Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <Tabs defaultValue="mentions" className="w-full">
                  <TabsList>
                    <TabsTrigger value="mentions">Mentions</TabsTrigger>
                    <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
                    <TabsTrigger value="forecast">Forecast</TabsTrigger>
                  </TabsList>
                  <TabsContent value="mentions" className="mt-4">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={formatChartDate}
                          stroke="#6b7280"
                        />
                        <YAxis stroke="#6b7280" />
                        <Tooltip
                          labelFormatter={formatTooltipDate}
                          contentStyle={chartTooltipStyle}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="mentionCount"
                          stroke="#f59e0b"
                          strokeWidth={2}
                          dot={{ fill: "#f59e0b", r: 4 }}
                          name="Mention Count"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </TabsContent>
                  <TabsContent value="sentiment" className="mt-4">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={formatChartDate}
                          stroke="#6b7280"
                        />
                        <YAxis domain={[-1, 1]} stroke="#6b7280" />
                        <Tooltip
                          labelFormatter={formatTooltipDate}
                          contentStyle={chartTooltipStyle}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="avgSentiment"
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={{ fill: "#10b981", r: 4 }}
                          name="Avg Sentiment"
                        />
                        <Line
                          type="monotone"
                          dataKey="momentum"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={{ fill: "#3b82f6", r: 4 }}
                          name="Momentum"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </TabsContent>
                  <TabsContent value="forecast" className="mt-4">
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient
                            id="forecastGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#3b82f6"
                              stopOpacity={0.2}
                            />
                            <stop
                              offset="95%"
                              stopColor="#3b82f6"
                              stopOpacity={0.05}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={formatChartDate}
                          stroke="#6b7280"
                        />
                        <YAxis stroke="#6b7280" />
                        <Tooltip
                          labelFormatter={formatTooltipDate}
                          contentStyle={chartTooltipStyle}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="forecastUpper"
                          stroke="#3b82f6"
                          strokeWidth={1}
                          strokeDasharray="3 3"
                          fill="url(#forecastGradient)"
                          name="Forecast Range"
                        />
                        <Area
                          type="monotone"
                          dataKey="forecastLower"
                          stroke="#3b82f6"
                          strokeWidth={1}
                          strokeDasharray="3 3"
                          fill="white"
                          name=""
                        />
                        <Line
                          type="monotone"
                          dataKey="mentionCount"
                          stroke="#f59e0b"
                          strokeWidth={2}
                          dot={{ fill: "#f59e0b", r: 4 }}
                          name="Actual Mentions"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No timeseries data available
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Keywords
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sortedKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {sortedKeywords.map((keyword) => (
                    <Badge
                      key={keyword.id}
                      variant="outline"
                      className="px-3 py-1.5 text-sm"
                    >
                      {keyword.keyword}
                      {keyword.weight !== null && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({keyword.weight.toFixed(2)})
                        </span>
                      )}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No keywords available
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Insights
                {cluster.insights.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {cluster.insights.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cluster.insights.length > 0 ? (
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {cluster.insights.map((insight) => (
                    <div
                      key={insight.id}
                      className="p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <p className="text-sm text-foreground mb-2">
                        {insight.insight_text}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatFullDateTime(insight.generated_at)}</span>
                        {insight.confidence !== null && (
                          <Badge variant="outline" className="text-xs">
                            {(insight.confidence * 100).toFixed(0)}%
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No insights available
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Anomalies
                {cluster.anomalies.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {cluster.anomalies.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cluster.anomalies.length > 0 ? (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {cluster.anomalies.map((anomaly) => (
                    <div
                      key={anomaly.id}
                      className="p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">
                          {formatTooltipDate(anomaly.anomaly_date)}
                        </span>
                        <Badge
                          variant={
                            anomaly.score > 0.7
                              ? "destructive"
                              : anomaly.score > 0.4
                              ? "negative"
                              : "neutral"
                          }
                          className="text-xs"
                        >
                          Score: {anomaly.score.toFixed(2)}
                        </Badge>
                      </div>
                      {anomaly.type && (
                        <p className="text-xs text-muted-foreground mb-1">
                          Type: {anomaly.type}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {formatFullDateTime(anomaly.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No anomalies detected
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
