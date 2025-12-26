import { useMemo, useState, useCallback } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { DocumentUMAPResponse } from "@/types/api";

interface UMAPScatterPlotProps {
  data: DocumentUMAPResponse[];
  onDocumentClick?: (documentId: string) => void;
}

const CLUSTER_COLORS = [
  "hsl(185, 50%, 50%)", // Deep Teal
  "hsl(145, 45%, 45%)", // Muted Green
  "hsl(280, 40%, 50%)", // Muted Purple
  "hsl(60, 50%, 50%)", // Amber
  "hsl(25, 50%, 50%)", // Orange
  "hsl(200, 45%, 50%)", // Blue
  "hsl(320, 40%, 50%)", // Pink
  "hsl(160, 45%, 45%)", // Teal-Green
  "hsl(240, 40%, 50%)", // Indigo
  "hsl(15, 50%, 50%)", // Red-Orange
];

const UNCLUSTERED_COLOR = "hsl(0, 0%, 70%)";

const getClusterColor = (clusterId: string | null): string => {
  if (!clusterId) return UNCLUSTERED_COLOR;
  let hash = 0;
  for (let i = 0; i < clusterId.length; i++) {
    hash = clusterId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % CLUSTER_COLORS.length;
  return CLUSTER_COLORS[index];
};

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ payload: DocumentUMAPResponse }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3 max-w-xs">
        <p className="font-medium text-sm text-foreground mb-1">
          {data.title || "Untitled Document"}
        </p>
        {data.source_path && (
          <p className="text-xs text-muted-foreground truncate mb-1">
            {data.source_path}
          </p>
        )}
        {data.cluster_id && (
          <p className="text-xs text-muted-foreground mt-1">
            Cluster: {data.cluster_id.slice(0, 8)}...
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Position: ({data.x.toFixed(2)}, {data.y.toFixed(2)})
        </p>
      </div>
    );
  }
  return null;
};

export const UMAPScatterPlot = ({
  data,
  onDocumentClick,
}: UMAPScatterPlotProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const chartData = useMemo(() => {
    return data.map((doc, index) => ({
      ...doc,
      index,
    }));
  }, [data]);

  const { xDomain, yDomain } = useMemo(() => {
    if (data.length === 0) {
      return { xDomain: [0, 1], yDomain: [0, 1] };
    }

    const xValues = data.map((d) => d.x);
    const yValues = data.map((d) => d.y);

    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);

    const xRange = xMax - xMin || 1;
    const yRange = yMax - yMin || 1;

    const xPadding = xRange * 0.1;
    const yPadding = yRange * 0.1;

    return {
      xDomain: [xMin - xPadding, xMax + xPadding],
      yDomain: [yMin - yPadding, yMax + yPadding],
    };
  }, [data]);

  const handleClick = useCallback(
    (data: DocumentUMAPResponse & { index?: number }) => {
      if (onDocumentClick && data?.document_id) {
        onDocumentClick(data.document_id);
      }
    },
    [onDocumentClick]
  );

  if (data.length === 0) {
    return (
      <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-card border border-border rounded-xl">
        <div className="text-center">
          <p className="text-muted-foreground">No UMAP data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[500px] bg-card border border-border rounded-xl p-4">
      <ResponsiveContainer width="100%" height="100%" minHeight={500}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            opacity={0.3}
          />
          <XAxis
            type="number"
            dataKey="x"
            name="X"
            domain={xDomain}
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Y"
            domain={yDomain}
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ strokeDasharray: "3 3" }}
          />
          <Scatter
            data={chartData}
            fill="hsl(var(--primary))"
            onClick={handleClick}
            onMouseEnter={(_, index) => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {chartData.map((entry, index) => {
              const color = getClusterColor(entry.cluster_id);
              const isHovered = hoveredIndex === index;
              return (
                <Cell
                  key={entry.document_id}
                  fill={color}
                  opacity={isHovered ? 1 : 0.7}
                  style={{
                    cursor: onDocumentClick ? "pointer" : "default",
                    transition: "opacity 0.2s ease",
                  }}
                />
              );
            })}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};
