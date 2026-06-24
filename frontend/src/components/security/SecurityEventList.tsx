import { useMemo, useState } from "react";
import EmptyState from "../dashboard/EmptyState";
import { Skeleton } from "../dashboard/LoadingState";
import type { SecurityEvent } from "../../services/securityService";

type SecurityEventListProps = {
  events: SecurityEvent[];
  loading: boolean;
  onDismiss: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

const severityStyles = {
  low: "bg-slate-500/15 text-slate-300 ring-slate-500/30",
  medium: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
  high: "bg-orange-500/15 text-orange-300 ring-orange-500/30",
  critical: "bg-rose-500/15 text-rose-300 ring-rose-500/30",
};

const eventAdvice = (type: SecurityEvent["type"]) => {
  switch (type) {
    case "server_error_spike":
      return {
        title: "Server error spike detected",
        summary:
          "Your API is returning multiple server errors, indicating backend instability.",
        fix: "Review recent deployments, error logs, and resource utilization.",
      };
    case "high_latency":
      return {
        title: "High latency observed",
        summary:
          "Responses are slower than expected, which can impact user experience.",
        fix: "Optimize service performance, caching, and network paths.",
      };
    case "repeated_failure":
      return {
        title: "Repeated failures detected",
        summary:
          "The endpoint is failing repeatedly, suggesting availability issues.",
        fix: "Investigate connectivity, service health, and recent changes.",
      };
    case "malformed_url":
      return {
        title: "Malformed URL reported",
        summary:
          "The monitor URL is invalid, preventing reliable security checks.",
        fix: "Fix the URL format and ensure it points to the correct endpoint.",
      };
    default:
      return {
        title: "Security finding",
        summary: "Review this event to understand its impact and next steps.",
        fix: "Investigate the issue and apply the appropriate fix.",
      };
  }
};

const SecurityEventList = ({ events, loading, onDismiss, onDelete }: SecurityEventListProps) => {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const sortedEvents = useMemo(
    () =>
      [...events]
        .sort(
          (a, b) =>
            new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()
        )
        .slice(0, 15),
    [events]
  );

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!sortedEvents.length) {
    return (
      <EmptyState
        title="🟢 No recent security events"
        description="Your monitored APIs have no active findings in the latest scan."
      />
    );
  }

  const toggleExpand = (id: string) => {
    setExpandedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const runAction = async (action: () => Promise<void>) => {
    await action();
  };

  return (
    <ol className="space-y-4">
      {sortedEvents.map((event) => {
        const advice = eventAdvice(event.type);
        const expanded = expandedIds.includes(event.id);

        return (
          <li
            key={event.id}
            className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${severityStyles[event.severity]}`}
                  >
                    {event.severity}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {event.typeLabel}
                  </span>
                  <span className="text-xs text-slate-500">
                    {event.monitorName || "Unknown monitor"}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-white">{event.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{event.description}</p>
                <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">
                  {new Date(event.detectedAt).toLocaleString()} · +{event.riskPoints} risk
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => toggleExpand(event.id)}
                  className="rounded-full border border-slate-700 bg-slate-950/70 px-4 py-2 text-xs font-semibold text-slate-100 hover:bg-slate-900"
                >
                  {expanded ? "Hide details" : "Learn more"}
                </button>
                <button
                  type="button"
                  onClick={() => runAction(() => onDismiss(event.id))}
                  className="rounded-full border border-slate-700 bg-slate-950/70 px-4 py-2 text-xs font-semibold text-slate-100 hover:bg-slate-900"
                >
                  Dismiss
                </button>
                <button
                  type="button"
                  onClick={() => runAction(() => onDelete(event.id))}
                  className="rounded-full border border-rose-600 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-200 hover:bg-rose-500/20"
                >
                  Delete
                </button>
              </div>
            </div>

            {expanded ? (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Summary</p>
                  <p className="mt-2 text-sm text-slate-300">{advice.summary}</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Suggested fix</p>
                  <p className="mt-2 text-sm text-slate-300">{advice.fix}</p>
                </div>
              </div>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
};

export default SecurityEventList;
