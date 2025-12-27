import { useParams, useNavigate } from "react-router-dom";
import { useCluster } from "@/hooks/useClusters";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageTransition } from "@/components/ui/page-transition";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoNote } from "@/components/ui/info-note";
import { SentimentGauge } from "@/components/ui/sentiment-gauge";
import { KeywordCloud } from "@/components/ui/keyword-cloud";
import { ProgressRing } from "@/components/ui/progress-ring";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowLeft,
  TrendingUp,
  FileText,
  Lightbulb,
  AlertTriangle,
  Tag,
  Activity,
  ExternalLink,
  Layers,
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
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { useMemo, useCallback, useState } from "react";
import {
  getSentimentInfo,
  getClusterDisplayName,
  getMomentumLabel,
} from "@/lib/utils";

export const ClusterDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: cluster, isLoading, error } = useCluster(id || "");
  const [showKeywordWeights, setShowKeywordWeights] = useState(false);

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

  const clusterDisplayName = useMemo(() => {
    if (!cluster) return "";
    return getClusterDisplayName(cluster.id, cluster.keywords);
  }, [cluster]);

  const momentumInfo = useMemo(() => {
    return getMomentumLabel(latestMomentum);
  }, [latestMomentum]);

  const handleBackClick = useCallback(() => {
    navigate("/clusters");
  }, [navigate]);

  const handleViewDocuments = useCallback(() => {
    navigate(`/documents?cluster_id=${cluster?.id}`);
  }, [navigate, cluster?.id]);

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
      <div className="space-y-6 animate-in fade-in-0 duration-300">
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
      <PageTransition>
        <div className="space-y-6">
          <Button variant="outline" onClick={handleBackClick} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Clusters
          </Button>
          <EmptyState
            icon={Layers}
            title="Cluster not found"
            description={
              error instanceof Error
                ? error.message
                : "The requested cluster could not be found."
            }
          />
        </div>
      </PageTransition>
    );
  }

  const trendingScore = cluster.trending_score ?? 0;
  const trendingPercent = Math.round(trendingScore * 100);

  const sentiment = cluster.avg_sentiment;
  const { variant: sentimentVariant, label: sentimentLabel, description: sentimentDescription } =
    getSentimentInfo(sentiment);

  const breadcrumbItems = useMemo(() => {
    if (!cluster) return undefined;
    return [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Clusters", href: "/clusters" },
      { label: clusterDisplayName, href: undefined },
    ];
  }, [cluster, clusterDisplayName]);

  return (
    <PageTransition>
      <div className="space-y-6">
        <Breadcrumb items={breadcrumbItems} />
        <PageHeader
          title={clusterDisplayName}
          description={`Created ${formatFullDateTime(cluster.created_at)}`}
          icon={Layers}
          iconColor="text-teal-600 dark:text-teal-400"
          actions={
            <Button variant="outline" onClick={handleViewDocuments} size="sm">
              <FileText className="w-4 h-4 mr-2" />
              View Documents
            </Button>
          }
        />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="animate-in fade-in-0 slide-in-from-bottom-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              Trending Score
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-muted-foreground hover:text-foreground">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Trending score (0-100%) indicates how much activity and
                      momentum this topic has. Higher scores mean more trending.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-3">
              <ProgressRing
                value={trendingPercent}
                size={100}
                strokeWidth={10}
                color="#f59e0b"
                showLabel
              />
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-500 ease-out"
                  style={{ width: `${trendingPercent}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-in fade-in-0 slide-in-from-bottom-2" style={{ animationDelay: "50ms" }}>
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

        <Card className="animate-in fade-in-0 slide-in-from-bottom-2" style={{ animationDelay: "100ms" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              Avg Sentiment
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-muted-foreground hover:text-foreground">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{sentimentDescription}</p>
                    {sentiment !== null && (
                      <p className="text-xs mt-1">Score: {sentiment.toFixed(3)} (range: -1 to +1)</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sentiment !== null ? (
              <div className="flex flex-col items-center gap-3">
                <SentimentGauge value={sentiment} size={100} />
                <Badge variant={sentimentVariant} className="text-xs">
                  {sentimentLabel}
                </Badge>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">N/A</span>
            )}
          </CardContent>
        </Card>

        <Card className="animate-in fade-in-0 slide-in-from-bottom-2" style={{ animationDelay: "150ms" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Momentum
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-muted-foreground hover:text-foreground">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{momentumInfo.description}</p>
                    {latestMomentum !== null && (
                      <p className="text-xs mt-1">Value: {latestMomentum > 0 ? "+" : ""}{latestMomentum.toFixed(3)}</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-foreground">
                    {momentumInfo.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {latestMomentum > 0 ? "+" : ""}
                    {latestMomentum.toFixed(2)}
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">N/A</span>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="animate-in fade-in-0 slide-in-from-bottom-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Timeseries Analysis
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Track mentions, sentiment, and forecasted trends over time
              </p>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <>
                  <InfoNote variant="info" className="mb-4">
                    <p>
                      <strong>Understanding Timeseries Data:</strong> This chart shows how this cluster's activity evolves over time. 
                      Use the tabs to switch between different views:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
                      <li><strong>Mentions:</strong> Daily count of documents mentioning this topic</li>
                      <li><strong>Sentiment:</strong> Average emotional tone (-1 negative to +1 positive) with momentum trend</li>
                      <li><strong>Forecast:</strong> Predicted mention range with confidence intervals</li>
                    </ul>
                  </InfoNote>
                  <Tabs defaultValue="mentions" className="w-full">
                    <TabsList>
                      <TabsTrigger value="mentions">Mentions</TabsTrigger>
                      <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
                      <TabsTrigger value="forecast">Forecast</TabsTrigger>
                    </TabsList>
                    <TabsContent value="mentions" className="mt-4">
                      <div className="mb-2 text-xs text-muted-foreground">
                        Number of document mentions per day
                      </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={formatChartDate}
                          stroke="#6b7280"
                        />
                        <YAxis stroke="#6b7280" />
                        <RechartsTooltip
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
                    <InfoNote variant="tip" className="mb-4">
                      <p>
                        <strong>Sentiment Analysis:</strong> The sentiment score ranges from -1 (very negative) to +1 (very positive). 
                        The momentum line (dashed) shows the rate of change—positive momentum indicates improving sentiment, 
                        negative momentum suggests declining sentiment.
                      </p>
                    </InfoNote>
                    <div className="mb-2 text-xs text-muted-foreground">
                      Average sentiment (-1 to +1) and momentum trend
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={formatChartDate}
                          stroke="#6b7280"
                        />
                        <YAxis domain={[-1, 1]} stroke="#6b7280" />
                        <RechartsTooltip
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
                    <InfoNote variant="tip" className="mb-4">
                      <p>
                        <strong>Forecast Interpretation:</strong> The shaded area represents the predicted range of mentions 
                        with confidence intervals. When actual mentions (orange line) fall outside this range, it indicates 
                        unexpected activity that may warrant attention.
                      </p>
                    </InfoNote>
                    <div className="mb-2 text-xs text-muted-foreground">
                      Forecasted mention range (confidence interval) vs actual mentions
                    </div>
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
                        <RechartsTooltip
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
                          name="Forecast Upper Bound"
                        />
                        <Area
                          type="monotone"
                          dataKey="forecastLower"
                          stroke="#3b82f6"
                          strokeWidth={1}
                          strokeDasharray="3 3"
                          fill="white"
                          name="Forecast Lower Bound"
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
                </>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No timeseries data available
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="animate-in fade-in-0 slide-in-from-bottom-4" style={{ animationDelay: "100ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Keywords
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sortedKeywords.length > 0 ? (
                <div className="space-y-4">
                  <InfoNote variant="info" className="mb-3">
                    <p>
                      <strong>Keyword Cloud:</strong> Keywords are extracted from documents in this cluster and ranked by importance. 
                      Larger, bolder keywords have higher weights and are more central to this topic. The visual size represents importance.
                    </p>
                  </InfoNote>
                  <KeywordCloud keywords={sortedKeywords} maxKeywords={30} />
                  <button
                    onClick={() => setShowKeywordWeights(!showKeywordWeights)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showKeywordWeights ? "Hide" : "Show"} numerical weights
                  </button>
                  {showKeywordWeights && (
                    <div className="mt-2 p-3 rounded-lg bg-muted/50 text-xs space-y-1">
                      {sortedKeywords.slice(0, 10).map((keyword) => (
                        <div key={keyword.id} className="flex justify-between">
                          <span className="font-medium">{keyword.keyword}</span>
                          <span className="text-muted-foreground">
                            {keyword.weight?.toFixed(3) ?? "N/A"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
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
          <Card className="animate-in fade-in-0 slide-in-from-right-4">
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
                <>
                  <InfoNote variant="tip" className="mb-4">
                    <p>
                      <strong>AI-Generated Insights:</strong> These insights are automatically generated by analyzing patterns 
                      in this cluster's documents. Confidence scores indicate how certain the AI model is about each insight.
                    </p>
                  </InfoNote>
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
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="outline" className="text-xs cursor-help">
                                  {(insight.confidence * 100).toFixed(0)}%
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Confidence: {(insight.confidence * 100).toFixed(1)}%</p>
                                <p className="text-xs mt-1">AI model confidence in this insight</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </div>
                  ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No insights available
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="animate-in fade-in-0 slide-in-from-right-4" style={{ animationDelay: "100ms" }}>
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
                <>
                  <InfoNote variant="warning" className="mb-4">
                    <p>
                      <strong>Anomaly Detection:</strong> Anomalies are unusual patterns detected in this cluster's trends. 
                      Higher scores indicate more significant deviations. Review these to identify emerging topics, errors, 
                      or significant changes in activity.
                    </p>
                  </InfoNote>
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
                </>
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
    </PageTransition>
  );
};
