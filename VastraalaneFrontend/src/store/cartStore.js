import { create } from "zustand";
import { useAuthStore } from "./authStore";
import { getUserScopedKey } from "./storageKeys";

function readCartFromStorage(user) {
  const scopedKey = getUserScopedKey("va-cart", user);
  if (!scopedKey) return [];
  return JSON.parse(localStorage.getItem(scopedKey) || "[]");
}

function createCartKey(productId, variant = {}) {
  return `${productId}-${variant.size || ""}-${variant.color || ""}`;
}

function getProductImage(product) {
  const firstImage = product.images?.[0];
  return (typeof firstImage === "string" ? firstImage : firstImage?.url) || product.image || "";
}

export const useCartStore = create((set, get) => ({
  items: readCartFromStorage(useAuthStore.getState().user),
  isOpen: false,
  persist: (items) => {
    const user = useAuthStore.getState().user;
    const scopedKey = getUserScopedKey("va-cart", user);

    if (!scopedKey) {
      set({ items: [] });
      return;
    }

    localStorage.setItem(scopedKey, JSON.stringify(items));
    set({ items });
  },
  hydrateForCurrentUser: () => {
    set({ items: readCartFromStorage(useAuthStore.getState().user) });
  },
  resetForLogout: () => {
    set({ items: [], isOpen: false });
  },
  addItem: (product, quantity = 1, variant = {}) => {
    const items = [...get().items];
    const key = createCartKey(product._id, variant);
    const existing = items.find((item) => item.key === key);
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({
        key,
        productId: product._id,
        name: product.name,
        image: getProductImage(product),
        price: product.salePrice || product.basePrice,
        quantity,
        size: variant.size || "",
        color: variant.color || "",
      });
    }
    get().persist(items);
  },
  hasItem: (productId, variant = {}) =>
    get().items.some((item) => item.key === createCartKey(productId, variant)),
  toggleItem: (product, quantity = 1, variant = {}) => {
    const key = createCartKey(product._id, variant);
    const exists = get().items.some((item) => item.key === key);

    if (exists) {
      get().removeItem(key);
      return false;
    }

    get().addItem(product, quantity, variant);
    return true;
  },
  updateQuantity: (key, quantity) => {
    const items = get().items.map((item) =>
      item.key === key ? { ...item, quantity: Math.max(1, quantity) } : item
    );
    get().persist(items);
  },
  removeItem: (key) => {
    get().persist(get().items.filter((item) => item.key !== key));
  },
  clearCart: () => get().persist([]),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
