import EmptyState from "./EmptyState";
import { RecentActivitySkeleton } from "./LoadingState";

export type ActivityItem = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: "success" | "warning" | "error" | "info";
};

type RecentActivityProps = {
  items: ActivityItem[];
  loading?: boolean;
};

const statusDot = {
  success: "bg-emerald-400",
  warning: "bg-amber-400",
  error: "bg-rose-400",
  info: "bg-brand-500",
};

const RecentActivity = ({ items, loading = false }: RecentActivityProps) => {
  if (loading) {
    return <RecentActivitySkeleton />;
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        <span className="text-xs text-slate-500">Last 24 hours</span>
      </header>

      {items.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            title="No activity yet"
            description="Checks, alerts, and incident updates will appear here once you add endpoints to monitor."
            action={
              <button
                type="button"
                className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
              >
                Add your first endpoint
              </button>
            }
          />
        </div>
      ) : (
        <ul className="mt-5 divide-y divide-slate-800">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
              <span
                className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${statusDot[item.status]}`}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white">{item.title}</p>
                <p className="mt-1 text-sm text-slate-400">{item.description}</p>
              </div>
              <time className="shrink-0 text-xs text-slate-500">{item.timestamp}</time>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default RecentActivity;
