import api from "./api";

export const productService = {
  getProducts: async (params = {}) => (await api.get("/products", { params })).data,
  getFeatured: async () => (await api.get("/products/featured")).data,
  getProduct: async (id) => (await api.get(`/products/${id}`)).data,
  search: async (query) => (await api.get("/products/search", { params: { q: query } })).data,
  getCategories: async () => (await api.get("/categories")).data,
};
