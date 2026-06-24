import { useEffect, useState, useCallback } from "react";
import { getSocket } from "../services/socketClient";
import { fetchDashboardOverview } from "../services/dashboardService";
import type { ActivityItem } from "../components/dashboard/RecentActivity";
import type { HealthSummaryData } from "../components/dashboard/HealthSummary";
import type { KpiMetric } from "../components/dashboard/KpiCards";

export type DashboardOverview = {
  metrics: KpiMetric[];
  activities: ActivityItem[];
  health: HealthSummaryData | null;
};

export const useDashboardOverview = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardOverview | null>(null);

  const loadDashboard = useCallback(async () => {
    try {
      const overview = await fetchDashboardOverview();
      setData({
        metrics: overview.metrics,
        activities: overview.activities,
        health: overview.health,
      });
    } catch (error) {
      console.error("Failed to load dashboard", error);
      // Set empty state on error
      setData({
        metrics: [],
        activities: [],
        health: null,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();

    const socket = getSocket();

    if (socket) {
      socket.on("monitor:created", loadDashboard);
      socket.on("monitor:checked", loadDashboard);
      socket.on("monitor:updated", loadDashboard);
      socket.on("monitor:deleted", loadDashboard);
      socket.on("dashboard:update", loadDashboard);
    }

    return () => {
      if (socket) {
        socket.off("monitor:created", loadDashboard);
        socket.off("monitor:checked", loadDashboard);
        socket.off("monitor:updated", loadDashboard);
        socket.off("monitor:deleted", loadDashboard);
        socket.off("dashboard:update", loadDashboard);
      }
    };
  }, [loadDashboard]);

  return {
    loading,
    data,
    isEmpty: !loading && data !== null,
  };
};