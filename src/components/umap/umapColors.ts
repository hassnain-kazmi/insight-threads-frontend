export const CLUSTER_COLORS = [
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

export const UNCLUSTERED_COLOR = "hsl(0, 0%, 70%)";

export const getClusterColor = (clusterId: string | null): string => {
  if (!clusterId) return UNCLUSTERED_COLOR;

  const hash = [...clusterId].reduce(
    (h, _, i) => clusterId.charCodeAt(i) + ((h << 5) - h),
    0,
  );
  const index = Math.abs(hash) % CLUSTER_COLORS.length;
  return CLUSTER_COLORS[index];
};
