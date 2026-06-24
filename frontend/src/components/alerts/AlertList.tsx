import { useState } from "react";
import EmptyState from "../dashboard/EmptyState";
import { Skeleton } from "../dashboard/LoadingState";
import {
  ALERT_TYPE_LABELS,
  type Alert,
  type AlertType,
} from "../../services/alertService";

type AlertListProps = {
  alerts: Alert[];
  loading: boolean;
  onMarkRead: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

const severityStyles = {
  critical: "bg-rose-500/15 text-rose-300 ring-rose-500/30",
  warning: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
  info: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
};

const typeStyles: Record<AlertType, string> = {
  api_down: "text-rose-300",
  recovery: "text-emerald-300",
  latency: "text-amber-300",
};

const AlertList = ({ alerts, loading, onMarkRead, onDelete }: AlertListProps) => {
  const [actionId, setActionId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <EmptyState
        title="No alerts yet"
        description="Alerts are created automatically when monitors go down, recover, or exceed latency thresholds."
      />
    );
  }

  const runAction = async (id: string, action: () => Promise<void>) => {
    setActionId(id);
    try {
      await action();
    } finally {
      setActionId(null);
    }
  };

  return (
    <ul className="space-y-3">
      {alerts.map((alert) => (
        <li
          key={alert.id}
          className={`rounded-xl border p-4 ${
            alert.isRead
              ? "border-slate-800 bg-slate-900/40"
              : "border-brand-500/30 bg-slate-900/70"
          }`}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${severityStyles[alert.severity]}`}
                >
                  {alert.severity}
                </span>
                <span className={`text-xs font-semibold uppercase ${typeStyles[alert.type]}`}>
                  {ALERT_TYPE_LABELS[alert.type]}
                </span>
                {!alert.isRead ? (
                  <span className="text-xs text-brand-100">Unread</span>
                ) : null}
              </div>
              <h3 className="mt-2 text-base font-semibold text-white">{alert.title}</h3>
              <p className="mt-1 text-sm text-slate-400">{alert.message}</p>
              <p className="mt-2 text-xs text-slate-500">
                {alert.monitorName} · {new Date(alert.createdAt).toLocaleString()}
                {alert.emailSent ? " · Email sent" : " · Email pending"}
              </p>
            </div>

            <div className="flex shrink-0 gap-2">
              {!alert.isRead ? (
                <button
                  type="button"
                  disabled={actionId === alert.id}
                  onClick={() => runAction(alert.id, () => onMarkRead(alert.id))}
                  className="rounded-md border border-slate-700 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800"
                >
                  Mark read
                </button>
              ) : null}
              <button
                type="button"
                disabled={actionId === alert.id}
                onClick={() => runAction(alert.id, () => onDelete(alert.id))}
                className="rounded-md border border-rose-800/70 px-3 py-1.5 text-xs text-rose-300 hover:bg-rose-500/10"
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default AlertList;
