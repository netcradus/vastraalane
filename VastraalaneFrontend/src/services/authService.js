import api from "./api";

export const authService = {
  login: async (payload) => (await api.post("/auth/login", payload, { withCredentials: true })).data,
  register: async (payload) => (await api.post("/auth/register", payload, { withCredentials: true })).data,
  logout: async () => (await api.post("/auth/logout", {}, { withCredentials: true })).data,
  me: async () => (await api.get("/users/me")).data,
};
