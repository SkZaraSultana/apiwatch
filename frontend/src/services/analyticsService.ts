import api from "./api";

export type AnalyticsRange = "24h" | "7d" | "30d";

export type ResponseTimePoint = {
  label: string;
  timestamp: string;
  avgResponseTimeMs: number;
};

export type UptimePoint = {
  label: string;
  timestamp: string;
  uptimePercent: number;
};

export type HealthPoint = {
  monitorId: string;
  name: string;
  state: "up" | "down" | "unknown";
  uptimePercent: number;
  isAvailable: boolean | null;
  lastCheckedAt: string | null;
};

export type IncidentPoint = {
  label: string;
  timestamp: string;
  count: number;
};

export type IncidentDetail = {
  monitorId: string;
  monitorName: string;
  startedAt: string;
  resolvedAt: string | null;
  durationSeconds: number;
};

export type AnalyticsData = {
  range: AnalyticsRange;
  monitorId: string | null;
  hasData: boolean;
  responseTime: ResponseTimePoint[];
  uptime: UptimePoint[];
  health: HealthPoint[];
  incidents: IncidentPoint[];
  incidentDetails: IncidentDetail[];
  summary: {
    totalChecks: number;
    monitorCount: number;
    openIncidents: number;
    avgUptimePercent: number;
  };
};

export const fetchAnalytics = async (params?: {
  range?: AnalyticsRange;
  monitorId?: string;
}) => {
  const query: Record<string, string> = {};

  if (params?.range) {
    query.range = params.range;
  }

  if (params?.monitorId) {
    query.monitorId = params.monitorId;
  }

  const response = await api.get<AnalyticsData>("/analytics", { params: query });
  return response.data;
};
