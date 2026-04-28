import api from "./api";

export const authService = {
  login: async (payload) => (await api.post("/auth/login", payload)).data,
  register: async (payload) => (await api.post("/auth/register", payload)).data,
  logout: async () => (await api.post("/auth/logout")).data,
  me: async () => (await api.get("/users/me")).data,
};
