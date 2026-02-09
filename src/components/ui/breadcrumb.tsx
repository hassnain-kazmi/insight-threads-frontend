import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}

const getBreadcrumbsFromPath = (pathname: string): BreadcrumbItem[] => {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Dashboard", href: "/dashboard" },
  ];

  if (segments.length === 0) return breadcrumbs;

  const segmentLabels: Record<string, string> = {
    dashboard: "Dashboard",
    ingest: "Ingestion",
    documents: "Documents",
    clusters: "Clusters",
    insights: "Insights",
    anomalies: "Anomalies",
    umap: "UMAP",
    search: "Search",
  };

  segments.forEach((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const label =
      segmentLabels[segment] ??
      (segment.length === 36 || /^[a-f0-9-]{36}$/i.test(segment)
        ? segment.slice(0, 8)
        : segment);

    breadcrumbs.push({
      label,
      href: index === segments.length - 1 ? undefined : href,
    });
  });

  return breadcrumbs;
};

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  const location = useLocation();
  const breadcrumbs = items || getBreadcrumbsFromPath(location.pathname);

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
      <Link
        to="/dashboard"
        className="hover:text-foreground transition-colors flex items-center gap-1"
      >
        <Home className="w-4 h-4" />
      </Link>
      {breadcrumbs.slice(1).map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4" />
          {item.href ? (
            <Link
              to={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
};
