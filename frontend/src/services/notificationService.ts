import api from "./api";

export const fetchNotifications = async (limit = 50) => {
  const response = await api.get<{ notifications: any[] }>("/notifications", {
    params: { limit },
  });
  return response.data.notifications;
};

export const markNotificationRead = async (id: string) => {
  const response = await api.post(`/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await api.post(`/notifications/read-all`);
  return response.data;
};
