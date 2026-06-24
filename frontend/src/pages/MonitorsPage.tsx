import { useState } from "react";
import EmptyState from "../components/dashboard/EmptyState";
import { Skeleton } from "../components/dashboard/LoadingState";
import MonitorForm from "../components/monitors/MonitorForm";
import MonitorList from "../components/monitors/MonitorList";
import { useMonitors } from "../hooks/useMonitors";
import type { Monitor, MonitorInput } from "../services/monitorService";

const MonitorsPage = () => {
  const {
    monitors,
    loading,
    error,
    createMonitor,
    updateMonitor,
    deleteMonitor,
    pauseMonitor,
    resumeMonitor,
  } = useMonitors();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMonitor, setEditingMonitor] = useState<Monitor | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  const openCreateModal = () => {
    setEditingMonitor(null);
    setModalOpen(true);
    setFeedback("");
  };

  const openEditModal = (monitor: Monitor) => {
    setEditingMonitor(monitor);
    setModalOpen(true);
    setFeedback("");
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingMonitor(null);
  };

  const handleSubmit = async (payload: MonitorInput) => {
    if (editingMonitor) {
      await updateMonitor(editingMonitor.id, payload);
      setFeedback("Monitor updated successfully.");
    } else {
      await createMonitor(payload);
      setFeedback("Monitor created successfully.");
      closeModal();
    }
  };

  const handleDelete = async (monitor: Monitor) => {
    const confirmed = window.confirm(`Delete monitor "${monitor.name}"?`);
    if (!confirmed) return;

    setActionLoadingId(monitor.id);
    try {
      await deleteMonitor(monitor.id);
      setFeedback("Monitor deleted successfully.");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to delete monitor.";
      setFeedback(message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handlePause = async (monitor: Monitor) => {
    setActionLoadingId(monitor.id);
    try {
      await pauseMonitor(monitor.id);
      setFeedback(`"${monitor.name}" paused.`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleResume = async (monitor: Monitor) => {
    setActionLoadingId(monitor.id);
    try {
      await resumeMonitor(monitor.id);
      setFeedback(`"${monitor.name}" resumed.`);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Monitors</h2>
          <p className="mt-1 text-sm text-slate-400">
            Create and manage API endpoint monitors for uptime and status checks.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
        >
          Create Monitor
        </button>
      </div>

      {feedback ? (
        <p className="rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-slate-200">
          {feedback}
        </p>
      ) : null}

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      {loading ? (
        <div className="space-y-3 rounded-xl border border-slate-800 p-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : monitors.length === 0 ? (
        <EmptyState
          title="No monitors configured"
          description="Add your first monitor to start tracking API availability, expected status codes, and response times."
          action={
            <button
              type="button"
              onClick={openCreateModal}
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
            >
              Create Monitor
            </button>
          }
        />
      ) : (
        <MonitorList
          monitors={monitors}
          onEdit={openEditModal}
          onDelete={handleDelete}
          onPause={handlePause}
          onResume={handleResume}
          actionLoadingId={actionLoadingId}
        />
      )}

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="monitor-modal-title"
            className="w-full max-w-lg rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-xl"
          >
            <h3 id="monitor-modal-title" className="text-lg font-semibold text-white">
              {editingMonitor ? "Edit Monitor" : "Create Monitor"}
            </h3>
            <div className="mt-4">
              <MonitorForm
                initial={editingMonitor}
                onSubmit={handleSubmit}
                onCancel={closeModal}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MonitorsPage;
