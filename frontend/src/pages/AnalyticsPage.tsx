import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Skeleton } from "../components/dashboard/LoadingState";
import HealthChart from "../components/analytics/HealthChart";
import IncidentsChart from "../components/analytics/IncidentsChart";
import ResponseTimeChart from "../components/analytics/ResponseTimeChart";
import UptimeChart from "../components/analytics/UptimeChart";
import { useAnalytics } from "../hooks/useAnalytics";
import { useMonitors } from "../hooks/useMonitors";
import type { AnalyticsRange } from "../services/analyticsService";

const ranges: AnalyticsRange[] = ["24h", "7d", "30d"];

const AnalyticsPage = () => {
  const [range, setRange] = useState<AnalyticsRange>("7d");
  const [monitorId, setMonitorId] = useState("");
  const { monitors, loading: monitorsLoading } = useMonitors();
  const { data, loading, error } = useAnalytics(
    range,
    monitorId || undefined
  );

  const selectedMonitor = useMemo(() => {
    if (!monitorId || monitors.length === 0) return null;
    return monitors.find((m) => m.id === monitorId);
  }, [monitorId, monitors]);

  const monitorName =
    selectedMonitor?.name || (monitorId ? data?.health?.[0]?.name : undefined);

  const showPageEmpty = useMemo(() => {
    if (loading || !data) return false;
    return !data.hasData && monitors.length === 0;
  }, [loading, data, monitors.length]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Analytics</h2>
          <p className="mt-1 text-sm text-slate-400">
            Response time, uptime, health, and incidents from live monitor logs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={monitorId}
            onChange={(e) => setMonitorId(e.target.value)}
            disabled={monitorsLoading}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-brand-500 focus:outline-none"
          >
            <option value="">All monitors</option>
            {monitors.map((monitor) => (
              <option key={monitor.id} value={monitor.id}>
                {monitor.name}
              </option>
            ))}
          </select>

          <div className="flex rounded-lg border border-slate-700 p-1">
            {ranges.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setRange(item)}
                className={`rounded-md px-3 py-1.5 text-sm ${
                  range === item
                    ? "bg-brand-500 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      {loading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-[360px] w-full" />
          <Skeleton className="h-[360px] w-full" />
          <Skeleton className="h-[360px] w-full" />
          <Skeleton className="h-[360px] w-full" />
        </div>
      ) : showPageEmpty ? (
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-16 text-center">
          <h3 className="text-lg font-semibold text-white">No analytics data yet</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
            Analytics are built from MongoDB monitor check logs. Create monitors and
            let the engine run checks to populate charts.
          </p>
          <Link
            to="/dashboard/monitors"
            className="mt-5 inline-block rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
          >
            Go to Monitors
          </Link>
        </div>
      ) : data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-sm text-slate-400">Total Checks</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {data.summary.totalChecks}
              </p>
            </article>
            <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-sm text-slate-400">Monitors</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {data.summary.monitorCount}
              </p>
            </article>
            <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-sm text-slate-400">Avg Uptime</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {data.summary.avgUptimePercent}%
              </p>
            </article>
            <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-sm text-slate-400">Open Incidents</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {data.summary.openIncidents}
              </p>
            </article>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <ResponseTimeChart data={data.responseTime} monitorName={monitorName} />
            <UptimeChart data={data.uptime} monitorName={monitorName} />
            <HealthChart data={data.health} monitorName={monitorName} />
            <IncidentsChart data={data.incidents} monitorName={monitorName} />
          </div>
        </>
      ) : null}
    </div>
  );
};

export default AnalyticsPage;
