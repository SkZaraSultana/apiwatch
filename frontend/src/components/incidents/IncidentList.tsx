import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineArrowRight, HiOutlineClipboard, HiOutlineEye, HiOutlineSparkles } from "react-icons/hi";
import EmptyState from "../dashboard/EmptyState";
import { Skeleton } from "../dashboard/LoadingState";
import IncidentTimeline from "./IncidentTimeline";
import {
  INCIDENT_STATUS_LABELS,
  type Incident,
  type IncidentStatus,
} from "../../services/incidentService";

type IncidentListProps = {
  incidents: Incident[];
  loading: boolean;
  onStatusChange: (
    id: string,
    status: IncidentStatus,
    note?: string
  ) => Promise<Incident>;
  onDelete: (id: string) => Promise<void>;
};

const statusStyles: Record<IncidentStatus, string> = {
  open: "bg-rose-500/15 text-rose-300 ring-rose-500/30",
  investigating: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
  resolved: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
};

const severityStyles = {
  critical: "bg-rose-500/10 text-rose-200",
  high: "bg-orange-500/10 text-orange-200",
  medium: "bg-amber-500/10 text-amber-200",
  low: "bg-sky-500/10 text-sky-200",
};

type SeverityLevel = "critical" | "high" | "medium" | "low";

const getSeverity = (incident: Incident): { level: SeverityLevel; label: string } => {
  const statusCode = incident.metadata.statusCode;
  if (incident.status === "open") {
    if (!statusCode || statusCode >= 500) {
      return { level: "critical", label: "Critical" };
    }
    if (statusCode >= 400) {
      return { level: "high", label: "High" };
    }
    return { level: "medium", label: "Medium" };
  }

  if (incident.status === "investigating") {
    return { level: "high", label: "High" };
  }

  return { level: "low", label: "Low" };
};

const formatDuration = (startedAt: string, resolvedAt?: string | null) => {
  const start = new Date(startedAt).getTime();
  const end = resolvedAt ? new Date(resolvedAt).getTime() : Date.now();
  const totalSeconds = Math.max(0, Math.floor((end - start) / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
};

const formatDate = (value: string | null | undefined) =>
  value ? new Date(value).toLocaleString() : "Not available";

const getImpactLabel = (incident: Incident) => {
  const severity = getSeverity(incident).level;
  if (severity === "critical") return "Service unavailable for users.";
  if (severity === "high") return "Requests are likely failing.";
  if (severity === "medium") return "Some requests may be affected.";
  return "Low impact, service restored.";
};

const getRootCause = (incident: Incident) => {
  if (incident.metadata.errorMessage) {
    return incident.metadata.errorMessage;
  }
  if (incident.metadata.statusCode) {
    return `Health checks returned status ${incident.metadata.statusCode}.`;
  }
  return "Repeated health check failures detected by the monitoring engine.";
};

const getRecommendation = (incident: Incident) => {
  if (incident.metadata.statusCode && incident.metadata.statusCode >= 500) {
    return "Check your API backend and retry failed requests once services recover.";
  }
  if (incident.metadata.statusCode && incident.metadata.statusCode >= 400) {
    return "Review the endpoint configuration and recent deployments for errors.";
  }
  return "Verify connectivity and service health to restore normal traffic.";
};

const getMonitorState = (incident: Incident) => {
  if (incident.status === "resolved") return "Recovered";
  if (incident.status === "investigating") return "Under investigation";
  return "Down";
};

const getAffectedUsers = (incident: Incident) => {
  const severity = getSeverity(incident).level;
  if (severity === "critical") return "100+ users";
  if (severity === "high") return "50-100 users";
  if (severity === "medium") return "20-50 users";
  return "Fewer than 20 users";
};

const IncidentList = ({
  incidents,
  loading,
  onStatusChange,
  onDelete,
}: IncidentListProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedId && incidents.length > 0) {
      setSelectedId(incidents[0].id);
    }
  }, [incidents, selectedId]);

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    );
  }

  if (incidents.length === 0) {
    return (
      <EmptyState
        icon={<HiOutlineClipboard className="h-10 w-10 text-slate-500" />}
        title="No active incidents."
        description="Your monitored services are operating normally. Incident updates will appear here as outages occur."
      />
    );
  }

  const selected = incidents.find((incident) => incident.id === selectedId) || null;

  const runAction = async (id: string, action: () => Promise<unknown>) => {
    setActionId(id);
    try {
      await action();
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <ul className="space-y-3 lg:col-span-2">
        {incidents.map((incident) => {
          const severity = getSeverity(incident);
          return (
            <li key={incident.id}>
              <button
                type="button"
                onClick={() => setSelectedId(incident.id)}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  selectedId === incident.id
                    ? "border-brand-500/40 bg-slate-900/80"
                    : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white truncate">{incident.monitorName}</h3>
                    <p className="mt-1 text-sm text-slate-400 truncate">
                      {incident.metadata.method ?? "GET"} {incident.metadata.url ?? "Unknown endpoint"}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusStyles[incident.status]}`}
                  >
                    {INCIDENT_STATUS_LABELS[incident.status]}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                  <span className={`rounded-full px-2 py-1 ${severityStyles[severity.level]}`}>
                    {severity.label}
                  </span>
                  <span className="text-slate-500">Started {formatDate(incident.startedAt)}</span>
                </div>

                <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-950/80 px-3 py-2 text-slate-300">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Duration</p>
                    <p className="mt-1 font-medium text-white">
                      {formatDuration(incident.startedAt, incident.resolvedAt)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-950/80 px-3 py-2 text-slate-300">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Latest</p>
                    <p className="mt-1 font-medium text-white">
                      {incident.metadata.statusCode ?? "N/A"}
                    </p>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 lg:col-span-3">
        {selected ? (
          <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">{selected.title}</h3>
                <p className="mt-1 text-sm text-slate-400">{selected.monitorName}</p>
                <p className="mt-2 text-sm text-slate-500">
                  {selected.metadata.method ?? "GET"} {selected.metadata.url ?? "Unknown endpoint"}
                </p>
              </div>
              <div className="flex flex-wrap items-start gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[selected.status]}`}
                >
                  {INCIDENT_STATUS_LABELS[selected.status]}
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${severityStyles[getSeverity(selected).level]}`}>
                  {getSeverity(selected).label}
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Incident ID</p>
                <p className="mt-2 break-all text-sm text-slate-200">{selected.id}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Started At</p>
                <p className="mt-2 text-sm text-slate-200">{formatDate(selected.startedAt)}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Current Duration</p>
                <p className="mt-2 text-sm text-slate-200">
                  {formatDuration(selected.startedAt, selected.resolvedAt)}
                </p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Latest Response</p>
                <p className="mt-2 text-sm text-slate-200">
                  {selected.metadata.responseTimeMs != null
                    ? `${selected.metadata.responseTimeMs} ms`
                    : "Not available"}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Last Successful Check</p>
                <p className="mt-2 text-sm text-slate-200">
                  {selected.status === "resolved" ? formatDate(selected.resolvedAt) : "Not available yet"}
                </p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Affected Users (estimated)</p>
                <p className="mt-2 text-sm text-slate-200">{getAffectedUsers(selected)}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Impact</p>
                <p className="mt-2 text-sm text-slate-200">{getImpactLabel(selected)}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Current Monitor State</p>
                <p className="mt-2 text-sm text-slate-200">{getMonitorState(selected)}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Root Cause</p>
                <p className="mt-2 text-sm text-slate-200">{getRootCause(selected)}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Recommended Fix</p>
                <p className="mt-2 text-sm text-slate-200">{getRecommendation(selected)}</p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <p className="text-sm font-semibold text-white">Quick actions</p>
              <p className="mt-1 text-sm text-slate-400">
                Add an incident note or update the status instantly.
              </p>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Add a note for the incident..."
                  className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                />
                <button
                  type="button"
                  onClick={() => runAction(selected.id, () => onStatusChange(selected.id, "investigating", note))}
                  disabled={actionId === selected.id || selected.status !== "open"}
                  className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Mark Investigating
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => runAction(selected.id, () => onStatusChange(selected.id, "resolved", note))}
                  disabled={actionId === selected.id || selected.status === "resolved"}
                  className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Resolve Incident
                </button>
                <button
                  type="button"
                  onClick={() => runAction(selected.id, () => onDelete(selected.id))}
                  disabled={actionId === selected.id}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Delete Incident
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                to="/dashboard/monitors"
                className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700"
              >
                <HiOutlineEye className="h-4 w-4" />
                View Monitor
              </Link>
              <Link
                to="/dashboard/analytics"
                className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700"
              >
                <HiOutlineSparkles className="h-4 w-4" />
                Go to Analytics
              </Link>
              <Link
                to="/dashboard/alerts"
                className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700"
              >
                <HiOutlineArrowRight className="h-4 w-4" />
                View Related Alerts
              </Link>
              <button
                type="button"
                onClick={async () => {
                  if (selected.metadata.url) {
                    await navigator.clipboard.writeText(selected.metadata.url);
                  }
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
              >
                <HiOutlineClipboard className="h-4 w-4" />
                Copy Endpoint URL
              </button>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Incident Timeline
              </h4>
              <div className="mt-4">
                <IncidentTimeline timeline={selected.timeline} />
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-6 text-center">
            <p className="text-sm font-semibold text-white">Select an incident to view its details.</p>
            <p className="mt-2 text-sm text-slate-400">
              The details panel shows outage context, impact, and recovery guidance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentList;
