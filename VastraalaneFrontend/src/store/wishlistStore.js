import { create } from "zustand";
import { useAuthStore } from "./authStore";
import { getUserScopedKey } from "./storageKeys";

function readWishlistFromStorage(user) {
  const scopedKey = getUserScopedKey("va-wishlist", user);
  if (!scopedKey) return [];
  return JSON.parse(localStorage.getItem(scopedKey) || "[]");
}

export const useWishlistStore = create((set, get) => ({
  items: readWishlistFromStorage(useAuthStore.getState().user),
  hydrateForCurrentUser: () => {
    set({ items: readWishlistFromStorage(useAuthStore.getState().user) });
  },
  resetForLogout: () => {
    set({ items: [] });
  },
  toggle: (product) => {
    const user = useAuthStore.getState().user;
    const scopedKey = getUserScopedKey("va-wishlist", user);

    if (!scopedKey) {
      set({ items: [] });
      return;
    }

    const exists = get().items.some((item) => item._id === product._id);
    const nextItems = exists
      ? get().items.filter((item) => item._id !== product._id)
      : [...get().items, product];

    localStorage.setItem(scopedKey, JSON.stringify(nextItems));
    set({ items: nextItems });
  },
}));
