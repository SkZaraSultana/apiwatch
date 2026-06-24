import { useState } from "react";
import AlertList from "../components/alerts/AlertList";
import { useAlerts } from "../hooks/useAlerts";
import type { AlertType } from "../services/alertService";

const filters: Array<{ label: string; value: AlertType | "" }> = [
  { label: "All", value: "" },
  { label: "API Down", value: "api_down" },
  { label: "Recovery", value: "recovery" },
  { label: "Latency", value: "latency" },
];

const AlertsPage = () => {
  const [typeFilter, setTypeFilter] = useState<AlertType | "">("");
  const { alerts, summary, loading, error, markRead, markAllRead, remove } =
    useAlerts(typeFilter);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Alerts</h2>
          <p className="mt-1 text-sm text-slate-400">
            API down, recovery, and latency notifications stored and emailed from
            monitor checks.
          </p>
        </div>
        {summary && summary.unread > 0 ? (
          <button
            type="button"
            onClick={markAllRead}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
          >
            Mark all read
          </button>
        ) : null}
      </div>

      {summary ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-sm text-slate-400">Total</p>
            <p className="mt-2 text-2xl font-semibold text-white">{summary.total}</p>
          </article>
          <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-sm text-slate-400">Unread</p>
            <p className="mt-2 text-2xl font-semibold text-white">{summary.unread}</p>
          </article>
          <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-sm text-slate-400">API Down</p>
            <p className="mt-2 text-2xl font-semibold text-rose-300">{summary.apiDown}</p>
          </article>
          <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-sm text-slate-400">Recovery</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-300">
              {summary.recovery}
            </p>
          </article>
          <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-sm text-slate-400">Latency</p>
            <p className="mt-2 text-2xl font-semibold text-amber-300">
              {summary.latency}
            </p>
          </article>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.label}
            type="button"
            onClick={() => setTypeFilter(filter.value)}
            className={`rounded-lg px-3 py-1.5 text-sm ${
              typeFilter === filter.value
                ? "bg-brand-500 text-white"
                : "border border-slate-700 text-slate-300 hover:bg-slate-800"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      <AlertList
        alerts={alerts}
        loading={loading}
        onMarkRead={markRead}
        onDelete={remove}
      />
    </div>
  );
};

export default AlertsPage;
