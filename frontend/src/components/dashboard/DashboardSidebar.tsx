import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";

type DashboardSidebarProps = {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onNavigate?: () => void;
  className?: string;
};

type NavItem = {
  to: string;
  label: string;
  icon: ReactNode;
  end?: boolean;
};

const navItems: NavItem[] = [
  {
    to: "/dashboard",
    label: "Overview",
    end: true,
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    to: "/dashboard/analytics",
    label: "Analytics",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    to: "/dashboard/monitors",
    label: "Monitors",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a2.25 2.25 0 01-2.25-2.25m2.25 2.25a2.25 2.25 0 002.25 2.25m13.5 0a2.25 2.25 0 002.25-2.25m-2.25 2.25a2.25 2.25 0 00-2.25-2.25m-13.5 0V4.875c0-.621.504-1.125 1.125-1.125h11.25c.621 0 1.125.504 1.125 1.125v9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    to: "/dashboard/incidents",
    label: "Incidents",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    to: "/dashboard/security",
    label: "Security",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    to: "/dashboard/alerts",
    label: "Alerts",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
    ),
  },
  {
    to: "/dashboard/status-page",
    label: "Status Page",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5M3.75 7.5h10.5M3.75 17.25h7.5" />
      </svg>
    ),
  },
  {
    to: "/dashboard/reports",
    label: "Reports",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    to: "/dashboard/settings",
    label: "Settings",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

const linkClass = ({ isActive }: { isActive: boolean }, collapsed: boolean) =>
  [
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
    collapsed ? "justify-center" : "",
    isActive
      ? "bg-brand-500/15 text-brand-100"
      : "text-slate-400 hover:bg-slate-800/80 hover:text-white",
  ].join(" ");

const DashboardSidebar = ({
  collapsed,
  onToggleCollapse,
  onNavigate,
  className = "",
}: DashboardSidebarProps) => {
  return (
    <aside
      className={`flex h-full flex-col border-r border-slate-800 bg-slate-950 ${className}`}
    >
      <div
        className={`flex h-16 shrink-0 items-center border-b border-slate-800 px-4 ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        {!collapsed ? (
          <span className="text-lg font-semibold text-white">APIWatch</span>
        ) : (
          <span className="text-lg font-semibold text-brand-100">A</span>
        )}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white lg:inline-flex"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            {collapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            )}
          </svg>
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            title={collapsed ? item.label : undefined}
            onClick={onNavigate}
            className={(state) => linkClass(state, collapsed)}
          >
            <span className="shrink-0">{item.icon}</span>
            {!collapsed ? <span>{item.label}</span> : null}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-800 p-3">
        <div
          className={`rounded-lg bg-slate-900/80 p-3 ${collapsed ? "flex justify-center" : ""}`}
        >
          {!collapsed ? (
            <>
              <p className="text-xs font-medium text-slate-300">Pro Plan</p>
              <p className="mt-1 text-xs text-slate-500">14-day trial active</p>
            </>
          ) : (
            <span className="text-xs font-semibold text-brand-100">Pro</span>
          )}
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
