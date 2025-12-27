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

  segments.forEach((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    let label = segment;

    if (segment === "dashboard") {
      label = "Dashboard";
    } else if (segment === "ingest") {
      label = "Ingestion";
    } else if (segment === "documents") {
      label = "Documents";
    } else if (segment === "clusters") {
      label = "Clusters";
    } else if (segment === "insights") {
      label = "Insights";
    } else if (segment === "anomalies") {
      label = "Anomalies";
    } else if (segment === "umap") {
      label = "UMAP";
    } else if (segment === "search") {
      label = "Search";
    } else if (segment.length === 36 || segment.match(/^[a-f0-9-]{36}$/i)) {
      label = segment.slice(0, 8);
    }

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
