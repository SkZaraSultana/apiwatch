import api from "./api";

export type SecurityEventType =
  | "server_error_spike"
  | "high_latency"
  | "repeated_failure"
  | "malformed_url";

export type SecuritySeverity = "low" | "medium" | "high" | "critical";
export type RiskLevel = "low" | "medium" | "high" | "critical";

export type SecurityEvent = {
  id: string;
  monitorId: string | null;
  monitorName: string | null;
  type: SecurityEventType;
  typeLabel: string;
  severity: SecuritySeverity;
  title: string;
  description: string;
  riskPoints: number;
  metadata: Record<string, unknown>;
  detectedAt: string;
  isDismissed: boolean;
  createdAt: string;
};

export type RiskScore = {
  score: number;
  level: RiskLevel;
  activeEvents: number;
  breakdown: Record<SecurityEventType, number>;
  evaluatedAt: string;
};

export const SECURITY_TYPE_LABELS: Record<SecurityEventType, string> = {
  server_error_spike: "5xx Spike",
  high_latency: "High Latency",
  repeated_failure: "Repeated Failure",
  malformed_url: "Malformed URL",
};

export const fetchSecurityOverview = async (params?: {
  type?: SecurityEventType;
  limit?: number;
}) => {
  const response = await api.get<{ risk: RiskScore; events: SecurityEvent[] }>(
    "/security/overview",
    { params }
  );
  return response.data;
};

export const dismissSecurityEvent = async (id: string) => {
  const response = await api.patch<{
    message: string;
    event: SecurityEvent;
    risk: RiskScore;
  }>(`/security/events/${id}/dismiss`);
  return response.data;
};

export const deleteSecurityEvent = async (id: string) => {
  const response = await api.delete<{ message: string; risk: RiskScore }>(
    `/security/events/${id}`
  );
  return response.data;
};
