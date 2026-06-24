import { useMemo, useState } from "react";
import { HiOutlineExclamationCircle, HiOutlineClock, HiOutlineShieldCheck, HiOutlineSparkles } from "react-icons/hi";
import IncidentList from "../components/incidents/IncidentList";
import { useIncidents } from "../hooks/useIncidents";
import type { IncidentStatus } from "../services/incidentService";

const filters: Array<{ label: string; value: IncidentStatus | "" }> = [
  { label: "All", value: "" },
  { label: "Open", value: "open" },
  { label: "Investigating", value: "investigating" },
  { label: "Resolved", value: "resolved" },
];

const IncidentsPage = () => {
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | "">("");
  const { incidents, summary, loading, error, changeStatus, remove } =
    useIncidents(statusFilter);

  const activeCount = summary ? summary.open + summary.investigating : 0;
  const resolvedToday = useMemo(() => {
    if (!incidents) return 0;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    return incidents.filter(
      (incident) =>
        incident.resolvedAt && new Date(incident.resolvedAt) >= startOfToday
    ).length;
  }, [incidents]);

  const servicesAffected = useMemo(() => {
    return new Set(
      incidents
        .filter((incident) => incident.status !== "resolved")
        .map((incident) => incident.monitorName)
    ).size;
  }, [incidents]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Incidents</h2>
        <p className="mt-1 text-sm text-slate-400">
          Track outages linked to monitors with a full status timeline.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-3 text-brand-400">
            <HiOutlineExclamationCircle className="h-5 w-5" />
            <p className="text-sm font-medium text-slate-300">Total Incidents</p>
          </div>
          <p className="mt-4 text-3xl font-semibold text-white">
            {summary ? summary.total : "—"}
          </p>
          <p className="mt-2 text-sm text-slate-400">All incidents recorded</p>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-3 text-amber-300">
            <HiOutlineClock className="h-5 w-5" />
            <p className="text-sm font-medium text-slate-300">Active Incidents</p>
          </div>
          <p className="mt-4 text-3xl font-semibold text-white">
            {summary ? activeCount : "—"}
          </p>
          <p className="mt-2 text-sm text-slate-400">Currently unresolved outages</p>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-3 text-emerald-300">
            <HiOutlineShieldCheck className="h-5 w-5" />
            <p className="text-sm font-medium text-slate-300">Resolved Today</p>
          </div>
          <p className="mt-4 text-3xl font-semibold text-white">
            {summary ? resolvedToday : "—"}
          </p>
          <p className="mt-2 text-sm text-slate-400">Incidents recovered since midnight</p>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-3 text-sky-300">
            <HiOutlineSparkles className="h-5 w-5" />
            <p className="text-sm font-medium text-slate-300">Services Affected</p>
          </div>
          <p className="mt-4 text-3xl font-semibold text-white">
            {summary ? servicesAffected : "—"}
          </p>
          <p className="mt-2 text-sm text-slate-400">Endpoints currently impacted</p>
        </article>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.label}
            type="button"
            onClick={() => setStatusFilter(filter.value)}
            className={`rounded-lg px-3 py-1.5 text-sm ${
              statusFilter === filter.value
                ? "bg-brand-500 text-white"
                : "border border-slate-700 text-slate-300 hover:bg-slate-800"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      <IncidentList
        incidents={incidents}
        loading={loading}
        onStatusChange={changeStatus}
        onDelete={remove}
      />
    </div>
  );
};

export default IncidentsPage;
