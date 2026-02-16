import { useAuthContext } from "@/contexts/AuthContext";
import { LogOut, User, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { logError } from "@/lib/logger";

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
      logError("Failed to sign out", { error });
    }
  };

  return (
    <header
      className={cn(
        "fixed top-10 right-0 z-30 h-16 bg-background/80 backdrop-blur-sm border-b border-border transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "left-16" : "left-64",
        "max-lg:left-0",
      )}
    >
      <div className="h-full px-4 sm:px-5 lg:px-6 flex items-center justify-between">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden min-h-[44px] min-w-[44px] p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground active:scale-95 transition-all duration-200 flex items-center justify-center"
          aria-label="Open menu"
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
                className="flex items-center gap-2 min-h-[44px] px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground active:scale-[0.98] transition-all duration-200 cursor-pointer"
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
