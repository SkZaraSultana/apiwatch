import api from "./api";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  createdAt: string;
};

type AuthResponse = {
  message?: string;
  accessToken: string;
  user: AuthUser;
};

export const registerUser = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await api.post<AuthResponse & { message: string }>(
    "/auth/register",
    payload
  );
  return response.data;
};

export const loginUser = async (payload: { email: string; password: string }) => {
  const response = await api.post<AuthResponse>("/auth/login", payload);
  return response.data;
};

export const refreshUserToken = async () => {
  const response = await api.post<AuthResponse>("/auth/refresh-token");
  return response.data;
};

export const getProfile = async (accessToken: string) => {
  const response = await api.get<{ user: AuthUser }>("/auth/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.user;
};

export const logoutUser = async () => {
  await api.post("/auth/logout");
};

export const forgotPassword = async (email: string) => {
  const response = await api.post<{ message: string }>("/auth/forgot-password", {
    email,
  });
  return response.data;
};

export const resetPassword = async (token: string, password: string) => {
  const response = await api.post<{ message: string }>(
    `/auth/reset-password/${token}`,
    { password }
  );
  return response.data;
};

export const verifyEmail = async (token: string) => {
  const response = await api.post<{ message: string }>(`/auth/verify-email/${token}`);
  return response.data;
};

