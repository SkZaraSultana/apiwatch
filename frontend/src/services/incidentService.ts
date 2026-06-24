import api from "./api";

export type IncidentStatus = "open" | "investigating" | "resolved";

export type TimelineEntry = {
  id: string;
  status: IncidentStatus;
  message: string;
  actor: "system" | "user";
  createdAt: string;
};

export type Incident = {
  id: string;
  monitorId: string;
  monitorName: string;
  title: string;
  status: IncidentStatus;
  timeline: TimelineEntry[];
  startedAt: string;
  resolvedAt: string | null;
  metadata: {
    url?: string;
    method?: string;
    statusCode?: number | null;
    responseTimeMs?: number;
    errorMessage?: string;
    downtimeSeconds?: number;
  };
  createdAt: string;
  updatedAt: string;
};

export type IncidentSummary = {
  total: number;
  open: number;
  investigating: number;
  resolved: number;
};

export const INCIDENT_STATUS_LABELS: Record<IncidentStatus, string> = {
  open: "Open",
  investigating: "Investigating",
  resolved: "Resolved",
};

export const listIncidents = async (params?: {
  status?: IncidentStatus;
  monitorId?: string;
  limit?: number;
}) => {
  const response = await api.get<{ incidents: Incident[]; summary: IncidentSummary }>(
    "/incidents",
    { params }
  );
  return response.data;
};

export const getIncident = async (id: string) => {
  const response = await api.get<{ incident: Incident }>(`/incidents/${id}`);
  return response.data.incident;
};

export const updateIncidentStatus = async (
  id: string,
  payload: { status: IncidentStatus; note?: string }
) => {
  const response = await api.patch<{ message: string; incident: Incident }>(
    `/incidents/${id}/status`,
    payload
  );
  return response.data;
};

export const deleteIncident = async (id: string) => {
  const response = await api.delete<{ message: string }>(`/incidents/${id}`);
  return response.data;
};
