import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { IngestionNotificationListener } from "@/components/ingest/IngestionNotificationListener";
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
      <IngestionNotificationListener />
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden cursor-pointer"
          onClick={() => setMobileMenuOpen(false)}
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
          "pt-16 min-h-screen transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
        )}
      >
        <ScrollToTop />
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
