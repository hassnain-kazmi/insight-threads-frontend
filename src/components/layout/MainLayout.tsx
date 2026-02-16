import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { PageTransition } from "@/components/ui/page-transition";
import { IngestionNotificationListener } from "@/components/ingest/IngestionNotificationListener";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PausedNoticeBanner } from "@/components/layout/PausedNoticeBanner";
import { cn } from "@/lib/utils";

export const MainLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-background">
      <PausedNoticeBanner className="fixed top-0 left-0 right-0 z-50" />
      <IngestionNotificationListener />
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden cursor-pointer transition-opacity duration-200 animate-in fade-in-0"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden
        />
      )}
      <div className={cn("lg:block", mobileMenuOpen ? "block" : "hidden")}>
        <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      </div>
      <TopNav
        sidebarCollapsed={sidebarCollapsed}
        onMobileMenuToggle={toggleMobileMenu}
      />
      <main
        className={cn(
          "pt-[6.5rem] min-h-screen transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "lg:pl-16" : "lg:pl-64",
        )}
      >
        <ScrollToTop />
        <div className="p-4 sm:p-5 lg:p-6 min-w-0">
          <ErrorBoundary>
            <PageTransition>
              <Outlet />
            </PageTransition>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
};
