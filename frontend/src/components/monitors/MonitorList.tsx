import type { Monitor } from "../../services/monitorService";

type MonitorListProps = {
  monitors: Monitor[];
  onEdit: (monitor: Monitor) => void;
  onDelete: (monitor: Monitor) => void;
  onPause: (monitor: Monitor) => void;
  onResume: (monitor: Monitor) => void;
  actionLoadingId?: string | null;
};

const statusStyles = {
  active: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  paused: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
};

const MonitorList = ({
  monitors,
  onEdit,
  onDelete,
  onPause,
  onResume,
  actionLoadingId,
}: MonitorListProps) => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
          <thead className="bg-slate-900/80">
            <tr>
              <th className="px-4 py-3 font-medium text-slate-300">Name</th>
              <th className="px-4 py-3 font-medium text-slate-300">URL</th>
              <th className="px-4 py-3 font-medium text-slate-300">Method</th>
              <th className="px-4 py-3 font-medium text-slate-300">Status</th>
              <th className="px-4 py-3 font-medium text-slate-300">Interval</th>
              <th className="px-4 py-3 font-medium text-slate-300">Timeout</th>
              <th className="px-4 py-3 font-medium text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-950/40">
            {monitors.map((monitor) => (
              <tr key={monitor.id} className="hover:bg-slate-900/50">
                <td className="px-4 py-3 font-medium text-white">{monitor.name}</td>
                <td className="max-w-xs truncate px-4 py-3 text-slate-400" title={monitor.url}>
                  {monitor.url}
                </td>
                <td className="px-4 py-3 text-slate-300">{monitor.method}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyles[monitor.status]}`}
                  >
                    {monitor.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-300">{monitor.interval}s</td>
                <td className="px-4 py-3 text-slate-300">{monitor.timeout}ms</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(monitor)}
                      disabled={actionLoadingId === monitor.id}
                      className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800"
                    >
                      Edit
                    </button>
                    {monitor.status === "active" ? (
                      <button
                        type="button"
                        onClick={() => onPause(monitor)}
                        disabled={actionLoadingId === monitor.id}
                        className="rounded-md border border-amber-700/60 px-2 py-1 text-xs text-amber-200 hover:bg-amber-500/10"
                      >
                        Pause
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onResume(monitor)}
                        disabled={actionLoadingId === monitor.id}
                        className="rounded-md border border-emerald-700/60 px-2 py-1 text-xs text-emerald-200 hover:bg-emerald-500/10"
                      >
                        Resume
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onDelete(monitor)}
                      disabled={actionLoadingId === monitor.id}
                      className="rounded-md border border-rose-800/70 px-2 py-1 text-xs text-rose-300 hover:bg-rose-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonitorList;
