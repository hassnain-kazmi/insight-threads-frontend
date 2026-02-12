import { Link } from "react-router-dom";
import { FileQuestion, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export const NotFoundPage = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-muted flex items-center justify-center">
          <FileQuestion className="w-10 h-10 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Page not found
          </h1>
          <p className="text-muted-foreground mt-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link to="/dashboard">
            <Home className="w-4 h-4" />
            Go to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};
