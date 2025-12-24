import { LayoutDashboard, TrendingUp, FileText, Layers } from "lucide-react";

export const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your data insights and trending topics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Documents",
            value: "—",
            icon: FileText,
            color: "text-blue-500",
          },
          {
            label: "Active Clusters",
            value: "—",
            icon: Layers,
            color: "text-emerald-500",
          },
          {
            label: "Trending Topics",
            value: "—",
            icon: TrendingUp,
            color: "text-amber-500",
          },
          {
            label: "Insights Generated",
            value: "—",
            icon: LayoutDashboard,
            color: "text-violet-500",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-xl p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-semibold text-foreground mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
          <LayoutDashboard className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          No data yet
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Trigger your first ingestion to start seeing insights, trending
          clusters, and document analytics.
        </p>
      </div>
    </div>
  );
};
