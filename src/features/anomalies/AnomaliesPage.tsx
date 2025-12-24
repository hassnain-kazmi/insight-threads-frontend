import { AlertTriangle, Calendar } from "lucide-react";

export const AnomaliesPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Anomalies</h1>
          <p className="text-muted-foreground mt-1">
            Monitor detected anomalies in your data trends.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-accent transition-colors">
          <Calendar className="w-4 h-4" />
          Date Range
        </button>
      </div>
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          No anomalies detected
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Anomalies are automatically detected when unusual patterns emerge in
          your cluster data.
        </p>
      </div>
    </div>
  );
};
