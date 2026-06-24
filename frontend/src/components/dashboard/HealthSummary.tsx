import EmptyState from "./EmptyState";
import { HealthSummarySkeleton } from "./LoadingState";

export type HealthRegion = {
  id: string;
  name: string;
  status: "healthy" | "degraded" | "down";
  uptime: string;
};

export type HealthSummaryData = {
  overallStatus: "healthy" | "degraded" | "down" | "unknown";
  regions: HealthRegion[];
  lastChecked: string;
};

type HealthSummaryProps = {
  data: HealthSummaryData | null;
  loading?: boolean;
};

const statusBadge = {
  healthy: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  degraded: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
  down: "bg-rose-500/15 text-rose-300 ring-rose-500/30",
  unknown: "bg-slate-500/15 text-slate-300 ring-slate-500/30",
};

const statusLabel = {
  healthy: "Healthy",
  degraded: "Degraded",
  down: "Down",
  unknown: "Unknown",
};

const HealthSummary = ({ data, loading = false }: HealthSummaryProps) => {
  if (loading) {
    return <HealthSummarySkeleton />;
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <header className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-white">Health Summary</h2>
        {data ? (
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusBadge[data.overallStatus]}`}
          >
            {statusLabel[data.overallStatus]}
          </span>
        ) : null}
      </header>

      {!data || data.regions.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            title="No health data"
            description="Regional uptime and endpoint health scores will show here after monitoring starts."
            action={
              <button
                type="button"
                className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-800"
              >
                Configure monitoring
              </button>
            }
          />
        </div>
      ) : (
        <>
          <ul className="mt-5 space-y-3">
            {data.regions.map((region) => (
              <li
                key={region.id}
                className="flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-950/50 px-3 py-2.5"
              >
                <span className="text-sm text-slate-200">{region.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">{region.uptime} uptime</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${statusBadge[region.status]}`}
                  >
                    {statusLabel[region.status]}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-slate-500">Last checked {data.lastChecked}</p>
        </>
      )}
    </section>
  );
};

export default HealthSummary;
