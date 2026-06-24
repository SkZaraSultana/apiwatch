import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let accessTokenGetter: (() => string | null) | null = null;

export const setAccessTokenGetter = (getter: () => string | null) => {
  accessTokenGetter = getter;
};

api.interceptors.request.use((config) => {
  const token = accessTokenGetter?.();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
