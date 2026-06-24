import {
  INCIDENT_STATUS_LABELS,
  type IncidentStatus,
  type TimelineEntry,
} from "../../services/incidentService";

type IncidentTimelineProps = {
  timeline: TimelineEntry[];
};

const statusColor: Record<IncidentStatus, string> = {
  open: "border-rose-500 bg-rose-500",
  investigating: "border-amber-500 bg-amber-500",
  resolved: "border-emerald-500 bg-emerald-500",
};

const timelineMessage = (entry: TimelineEntry) => {
  if (entry.actor === "user") {
    return entry.message;
  }

  if (entry.status === "open") {
    return "The monitoring engine detected failed health checks.";
  }

  if (entry.status === "investigating") {
    return "The incident is being reviewed by the operations team.";
  }

  if (entry.status === "resolved") {
    return "The service has recovered and is operating normally.";
  }

  return entry.message;
};

const actorLabel = (actor: TimelineEntry["actor"]) =>
  actor === "system" ? "System event" : "User note";

const IncidentTimeline = ({ timeline }: IncidentTimelineProps) => {
  if (timeline.length === 0) {
    return (
      <p className="text-sm text-slate-500">No timeline entries recorded yet.</p>
    );
  }

  const sorted = [...timeline].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <ol className="relative space-y-0 border-l border-slate-700 pl-6">
      {sorted.map((entry) => (
        <li key={entry.id} className="relative pb-6 last:pb-0">
          <span
            className={`absolute -left-[1.35rem] top-1 h-3 w-3 rounded-full border-2 ${statusColor[entry.status]}`}
            aria-hidden
          />
          <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase text-slate-300">
                {INCIDENT_STATUS_LABELS[entry.status]}
              </span>
              <span className="text-xs text-slate-500">
                {entry.actor === "system" ? "System" : "User"}
              </span>
              <time className="text-xs text-slate-500">
                {new Date(entry.createdAt).toLocaleString()}
              </time>
            </div>
            <p className="mt-2 text-sm text-slate-300">{timelineMessage(entry)}</p>
            <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">{actorLabel(entry.actor)}</p>
          </div>
        </li>
      ))}
    </ol>
  );
};

export default IncidentTimeline;
