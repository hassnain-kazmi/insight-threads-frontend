import { useAuthContext } from "@/contexts/AuthContext";
import { LogOut, User, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopNavProps {
  sidebarCollapsed: boolean;
  onMobileMenuToggle: () => void;
}

export const TopNav = ({
  sidebarCollapsed,
  onMobileMenuToggle,
}: TopNavProps) => {
  const { user, signOut, isAuthenticated } = useAuthContext();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-16 bg-background/80 backdrop-blur-sm border-b border-border transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "left-16" : "left-64",
        "max-lg:left-0"
      )}
    >
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden lg:block" />
        <div className="flex items-center gap-4 ml-auto">
          {isAuthenticated && user && (
            <>
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-sm text-foreground font-medium">
                  {user.email?.split("@")[0]}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
