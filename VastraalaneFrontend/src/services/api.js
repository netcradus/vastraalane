import axios from "axios";
import { useAuthStore } from "../store/authStore";

function resolveApiBaseUrl() {
  const rawBaseUrl = String(import.meta.env.VITE_API_URL || "http://localhost:5000/api").trim();
  return /\/api\/?$/i.test(rawBaseUrl) ? rawBaseUrl.replace(/\/+$/, "") : `${rawBaseUrl.replace(/\/+$/, "")}/api`;
}

const apiBaseUrl = resolveApiBaseUrl();

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(
          `${apiBaseUrl}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        useAuthStore.getState().setAccessToken(response.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
