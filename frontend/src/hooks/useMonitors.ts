import { useCallback, useEffect, useState } from "react";
import {
  createMonitor,
  deleteMonitor,
  listMonitors,
  pauseMonitor,
  resumeMonitor,
  updateMonitor,
  type Monitor,
  type MonitorInput,
} from "../services/monitorService";

export const useMonitors = () => {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMonitors = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listMonitors();
      setMonitors(data);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to load monitors.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMonitors();

    // subscribe to real-time updates
    let socket: any = null;

    const setup = async () => {
      try {
        const mod = await import("../services/socketClient");
        socket = mod.getSocket();
        if (!socket) return;

        const onChecked = (payload: any) => {
          setMonitors((prev) =>
            prev.map((m) =>
              String(m.id) === String(payload.id) ? { ...m, ...payload } : m
            )
          );
        };

        const onCreated = (payload: any) => {
          setMonitors((prev) => [payload, ...prev]);
        };

        socket.on("monitor:checked", onChecked);
        socket.on("monitor:created", onCreated);

        // cleanup function will close listeners
        const cleanup = () => {
          try {
            socket.off("monitor:checked", onChecked);
            socket.off("monitor:created", onCreated);
          } catch (e) {
            // noop
          }
        };

        // attach cleanup to window so return below can call it
        (setup as any)._cleanup = cleanup;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("Failed to setup monitor socket listeners:", err);
      }
    };

    void setup();

    return () => {
      try {
        const cleanup = (setup as any)._cleanup;
        if (cleanup) cleanup();
      } catch (e) {
        // noop
      }
    };
  }, [fetchMonitors]);

  const handleCreate = async (payload: MonitorInput) => {
    const result = await createMonitor(payload);
    setMonitors((prev) => [result.monitor, ...prev]);
    return result.message;
  };

  const handleUpdate = async (id: string, payload: MonitorInput) => {
    const result = await updateMonitor(id, payload);
    setMonitors((prev) =>
      prev.map((monitor) => (monitor.id === id ? result.monitor : monitor))
    );
    return result.message;
  };

  const handleDelete = async (id: string) => {
    await deleteMonitor(id);
    setMonitors((prev) => prev.filter((monitor) => monitor.id !== id));
  };

  const handlePause = async (id: string) => {
    const result = await pauseMonitor(id);
    setMonitors((prev) =>
      prev.map((monitor) => (monitor.id === id ? result.monitor : monitor))
    );
  };

  const handleResume = async (id: string) => {
    const result = await resumeMonitor(id);
    setMonitors((prev) =>
      prev.map((monitor) => (monitor.id === id ? result.monitor : monitor))
    );
  };

  return {
    monitors,
    loading,
    error,
    refresh: fetchMonitors,
    createMonitor: handleCreate,
    updateMonitor: handleUpdate,
    deleteMonitor: handleDelete,
    pauseMonitor: handlePause,
    resumeMonitor: handleResume,
  };
};
