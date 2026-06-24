import { useCallback, useEffect, useState } from "react";
import { getSocket } from "../services/socketClient";
import {
  fetchAnalytics,
  type AnalyticsData,
  type AnalyticsRange,
} from "../services/analyticsService";

export const useAnalytics = (range: AnalyticsRange, monitorId?: string) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchAnalytics({ range, monitorId });
      setData(result);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to load analytics.";
      setError(message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [range, monitorId]);

  useEffect(() => {
    load();
  }, [load]);

  // Listen for real-time updates
  useEffect(() => {
    const socket = getSocket();

    if (socket) {
      const handleUpdate = () => {
        // Refresh analytics when monitors are checked
        load();
      };

      socket.on("monitor:checked", handleUpdate);
      socket.on("analytics:updated", handleUpdate);

      return () => {
        socket.off("monitor:checked", handleUpdate);
        socket.off("analytics:updated", handleUpdate);
      };
    }
  }, [load]);

  return { data, loading, error, refresh: load };
};
