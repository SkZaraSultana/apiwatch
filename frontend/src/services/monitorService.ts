import api from "./api";

export type MonitorStatus = "active" | "paused";

export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

export type Monitor = {
  id: string;
  name: string;
  url: string;
  method: HttpMethod;
  expectedStatus: number;
  interval: number;
  timeout: number;
  latencyThresholdMs: number;
  status: MonitorStatus;
  createdAt: string;
  updatedAt: string;
};

export type MonitorInput = {
  name: string;
  url: string;
  method: HttpMethod;
  expectedStatus: number;
  interval: number;
  timeout: number;
  latencyThresholdMs: number;
};

export const HTTP_METHODS: HttpMethod[] = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
];

export const listMonitors = async () => {
  const response = await api.get<{ monitors: Monitor[] }>("/monitors");
  return response.data.monitors;
};

export const getMonitor = async (id: string) => {
  const response = await api.get<{ monitor: Monitor }>(`/monitors/${id}`);
  return response.data.monitor;
};

export const createMonitor = async (payload: MonitorInput) => {
  const response = await api.post<{ message: string; monitor: Monitor }>(
    "/monitors",
    payload
  );
  return response.data;
};

export const updateMonitor = async (id: string, payload: MonitorInput) => {
  const response = await api.put<{ message: string; monitor: Monitor }>(
    `/monitors/${id}`,
    payload
  );
  return response.data;
};

export const deleteMonitor = async (id: string) => {
  const response = await api.delete<{ message: string }>(`/monitors/${id}`);
  return response.data;
};

export const pauseMonitor = async (id: string) => {
  const response = await api.patch<{ message: string; monitor: Monitor }>(
    `/monitors/${id}/pause`
  );
  return response.data;
};

export const resumeMonitor = async (id: string) => {
  const response = await api.patch<{ message: string; monitor: Monitor }>(
    `/monitors/${id}/resume`
  );
  return response.data;
};
