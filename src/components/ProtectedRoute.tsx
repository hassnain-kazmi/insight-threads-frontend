import { Navigate, useLocation } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-teal-600 dark:text-teal-400 animate-pulse">
            <Sparkles className="w-10 h-10 mx-auto" strokeWidth={1.5} />
          </div>
          <div className="w-8 h-8 mx-auto border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
