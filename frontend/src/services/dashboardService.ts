import api from "./api";

export type KpiMetric = {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
};

export type ActivityItem = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: "success" | "warning" | "error" | "info";
};

import type { HealthSummaryData } from "../components/dashboard/HealthSummary";

export type DashboardOverviewResponse = {
  metrics: KpiMetric[];
  activities: ActivityItem[];
  health: HealthSummaryData | null;
};

export const fetchDashboardOverview = async () => {
  const response = await api.get<DashboardOverviewResponse>("/dashboard/overview");
  return response.data;
};
