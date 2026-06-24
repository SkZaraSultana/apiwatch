import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";

const SIDEBAR_COLLAPSED_KEY = "apiwatch-sidebar-collapsed";

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapse = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
      return next;
    });
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="flex min-h-screen bg-slate-950 lg:gap-4">
      {/* Desktop sidebar — always visible, manually collapsible only */}
      <div
        className={`hidden shrink-0 flex-col transition-[width] duration-300 ease-in-out lg:flex ${
          collapsed ? "w-[72px]" : "w-[260px]"
        }`}
      >
        <DashboardSidebar collapsed={collapsed} onToggleCollapse={toggleCollapse} />
      </div>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-950/70 backdrop-blur-sm lg:hidden"
          onClick={closeMobileMenu}
          aria-label="Close navigation menu"
        />
      ) : null}

      <div
        className={`fixed inset-y-0 left-0 z-40 w-[260px] transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <DashboardSidebar
          collapsed={false}
          onToggleCollapse={toggleCollapse}
          onNavigate={closeMobileMenu}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader
          title="Dashboard"
          subtitle="Monitor API health and incidents"
          onOpenMobileMenu={() => setMobileOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
