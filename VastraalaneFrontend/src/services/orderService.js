import api from "./api";

export const orderService = {
  create: async (payload) => (await api.post("/orders", payload)).data,
  verifyPayment: async (payload) => (await api.post("/orders/verify-payment", payload)).data,
  mine: async () => (await api.get("/orders/my-orders")).data,
};
