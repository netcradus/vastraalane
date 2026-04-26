import axios from "axios";

function resolveApiBaseUrl() {
  const rawBaseUrl = String(import.meta.env.VITE_API_URL || "http://localhost:5000/api").trim();
  return /\/api\/?$/i.test(rawBaseUrl) ? rawBaseUrl.replace(/\/+$/, "") : `${rawBaseUrl.replace(/\/+$/, "")}/api`;
}

const adminApi = axios.create({
  baseURL: resolveApiBaseUrl(),
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("adminToken");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export default adminApi;
