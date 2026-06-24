import { useState } from "react";
import EmptyState from "../components/dashboard/EmptyState";
import { Skeleton } from "../components/dashboard/LoadingState";
import { useReports } from "../hooks/useReports";
import { PERIOD_LABELS, type ReportPeriod } from "../services/reportService";

const periods: ReportPeriod[] = ["daily", "weekly", "monthly"];

const ReportsPage = () => {
  const [period, setPeriod] = useState<ReportPeriod>("daily");
  const { report, history, loading, exporting, error, exportReport } =
    useReports(period);

  const hasData =
    report &&
    (report.summary.totalChecks > 0 ||
      report.summary.alertCount > 0 ||
      report.summary.incidentCount > 0 ||
      report.summary.securityEventCount > 0);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Reports</h2>
          <p className="mt-1 text-sm text-slate-400">
            Generate operational reports and export to PDF or CSV.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {periods.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPeriod(item)}
              className={`rounded-lg px-3 py-1.5 text-sm ${
                period === item
                  ? "bg-brand-500 text-white"
                  : "border border-slate-700 text-slate-300 hover:bg-slate-800"
              }`}
            >
              {PERIOD_LABELS[item]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={exporting !== null}
          onClick={() => exportReport("pdf")}
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-60"
        >
          {exporting === "pdf" ? "Generating PDF..." : "Export PDF"}
        </button>
        <button
          type="button"
          disabled={exporting !== null}
          onClick={() => exportReport("csv")}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 disabled:opacity-60"
        >
          {exporting === "csv" ? "Generating CSV..." : "Export CSV"}
        </button>
      </div>

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : !report ? null : !hasData ? (
        <EmptyState
          title="No report data for this period"
          description="Run monitors and collect checks, alerts, incidents, and security events to populate reports."
        />
      ) : (
        <>
          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <h3 className="text-lg font-semibold text-white">{report.periodLabel}</h3>
            <p className="mt-1 text-sm text-slate-400">
              {new Date(report.dateRange.from).toLocaleDateString()} —{" "}
              {new Date(report.dateRange.to).toLocaleDateString()}
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
                <p className="text-sm text-slate-400">Uptime</p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {report.summary.uptimePercent}%
                </p>
              </article>
              <article className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
                <p className="text-sm text-slate-400">Total Checks</p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {report.summary.totalChecks}
                </p>
              </article>
              <article className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
                <p className="text-sm text-slate-400">Avg Response</p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {report.summary.avgResponseTimeMs}ms
                </p>
              </article>
              <article className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
                <p className="text-sm text-slate-400">Open Incidents</p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {report.summary.openIncidents}
                </p>
              </article>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <h4 className="font-semibold text-white">Activity Summary</h4>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                <li>Monitors: {report.summary.monitorCount}</li>
                <li>Alerts: {report.summary.alertCount}</li>
                <li>Incidents: {report.summary.incidentCount}</li>
                <li>Security events: {report.summary.securityEventCount}</li>
              </ul>
            </article>

            <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <h4 className="font-semibold text-white">Top Monitors</h4>
              {report.monitors.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">No monitor activity.</p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {report.monitors.slice(0, 5).map((monitor) => (
                    <li
                      key={monitor.name}
                      className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm"
                    >
                      <span className="text-slate-200">{monitor.name}</span>
                      <span className="text-slate-400">{monitor.uptimePercent}%</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </section>
        </>
      )}

      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h3 className="text-lg font-semibold text-white">Export History</h3>
        {history.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No exports generated yet.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {history.slice(0, 8).map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm"
              >
                <span className="text-slate-200">
                  {PERIOD_LABELS[item.period]} · {item.format.toUpperCase()}
                </span>
                <time className="text-slate-500">
                  {new Date(item.generatedAt).toLocaleString()}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default ReportsPage;
