import axios from "axios";
import { API_BASE_URL } from "./api";

export const publicApi = axios.create({
  baseURL: API_BASE_URL,
});

export type ServiceStatus = "operational" | "degraded" | "outage";

export type PublicService = {
  id: string;
  name: string;
  state: ServiceStatus;
  label: string;
  message: string;
  uptimePercent: number;
  lastCheckedAt: string | null;
  responseTimeMs: number | null;
};

export type PublicStatus = {
  title: string;
  slug: string;
  overall: {
    state: ServiceStatus;
    label: string;
    message: string;
  };
  services: PublicService[];
  updatedAt: string;
};

export const fetchPublicStatus = async (slug: string) => {
  const response = await publicApi.get<PublicStatus>(
    `/status-page/public/${slug}`
  );
  return response.data;
};
