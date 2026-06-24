import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

type DashboardHeaderProps = {
  title: string;
  subtitle?: string;
  onOpenMobileMenu: () => void;
};

const DashboardHeader = ({ title, subtitle, onOpenMobileMenu }: DashboardHeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-800 bg-slate-950/95 px-4 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="inline-flex rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          aria-label="Open navigation menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold text-white sm:text-xl">{title}</h1>
          {subtitle ? (
            <p className="truncate text-sm text-slate-400">{subtitle}</p>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 sm:flex">
          <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="search"
            placeholder="Search endpoints..."
            className="w-40 bg-transparent text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none xl:w-56"
            aria-label="Search endpoints"
          />
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-2 py-1.5 sm:px-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/20 text-sm font-semibold text-brand-100">
            {user?.name?.charAt(0).toUpperCase() ?? "U"}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:border-slate-600 hover:bg-slate-800 hover:text-white"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
