import api from "./api";

export type AlertType = "api_down" | "recovery" | "latency";
export type AlertSeverity = "critical" | "warning" | "info";

export type Alert = {
  id: string;
  monitorId: string;
  monitorName: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  metadata: {
    url?: string;
    method?: string;
    statusCode?: number | null;
    responseTimeMs?: number;
    latencyThresholdMs?: number;
    errorMessage?: string;
    downtimeSeconds?: number;
    checkedAt?: string;
  };
  emailSent: boolean;
  emailSentAt: string | null;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AlertSummary = {
  total: number;
  unread: number;
  apiDown: number;
  recovery: number;
  latency: number;
};

export const listAlerts = async (params?: { type?: AlertType; limit?: number }) => {
  const response = await api.get<{ alerts: Alert[]; summary: AlertSummary }>(
    "/alerts",
    { params }
  );
  return response.data;
};

export const markAlertRead = async (id: string) => {
  const response = await api.patch<{ message: string; alert: Alert }>(
    `/alerts/${id}/read`
  );
  return response.data;
};

export const markAllAlertsRead = async () => {
  const response = await api.patch<{ message: string }>("/alerts/read-all");
  return response.data;
};

export const deleteAlert = async (id: string) => {
  const response = await api.delete<{ message: string }>(`/alerts/${id}`);
  return response.data;
};

export const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  api_down: "API Down",
  recovery: "Recovery",
  latency: "Latency",
};
