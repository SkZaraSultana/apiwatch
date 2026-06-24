import api from "./api";

export type StatusPageConfig = {
  title: string;
  slug: string;
  isPublished: boolean;
  publicUrl: string;
  createdAt: string;
  updatedAt: string;
};

export const fetchStatusPageConfig = async () => {
  const response = await api.get<{ statusPage: StatusPageConfig }>(
    "/status-page"
  );
  return response.data.statusPage;
};

export const generateStatusPageUrl = async () => {
  const response = await api.post<{
    message: string;
    statusPage: StatusPageConfig;
  }>("/status-page/generate");
  return response.data;
};

export const updateStatusPageConfig = async (payload: {
  title?: string;
  isPublished?: boolean;
}) => {
  const response = await api.patch<{
    message: string;
    statusPage: StatusPageConfig;
  }>("/status-page", payload);
  return response.data;
};
