import { useCallback, useEffect, useState } from "react";
import {
  deleteAlert,
  listAlerts,
  markAlertRead,
  markAllAlertsRead,
  type Alert,
  type AlertSummary,
  type AlertType,
} from "../services/alertService";

export const useAlerts = (typeFilter?: AlertType | "") => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [summary, setSummary] = useState<AlertSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listAlerts({
        type: typeFilter || undefined,
        limit: 100,
      });
      setAlerts(data.alerts);
      setSummary(data.summary);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to load alerts.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [typeFilter]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleMarkRead = async (id: string) => {
    await markAlertRead(id);
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, isRead: true } : alert))
    );
    setSummary((prev) =>
      prev ? { ...prev, unread: Math.max(0, prev.unread - 1) } : prev
    );
  };

  const handleMarkAllRead = async () => {
    await markAllAlertsRead();
    setAlerts((prev) => prev.map((alert) => ({ ...alert, isRead: true })));
    setSummary((prev) => (prev ? { ...prev, unread: 0 } : prev));
  };

  const handleDelete = async (id: string) => {
    await deleteAlert(id);
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    await fetchAlerts();
  };

  return {
    alerts,
    summary,
    loading,
    error,
    refresh: fetchAlerts,
    markRead: handleMarkRead,
    markAllRead: handleMarkAllRead,
    remove: handleDelete,
  };
};
