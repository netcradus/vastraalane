import { create } from "zustand";

const LEGACY_AUTH_KEY = "va-auth";

function clearLegacyAuth() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(LEGACY_AUTH_KEY);
}

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: "",
  setSession: ({ user, accessToken }) => {
    clearLegacyAuth();
    set({ user, accessToken });
  },
  setAccessToken: (accessToken) => {
    clearLegacyAuth();
    set({ accessToken });
  },
  clearSession: () => {
    clearLegacyAuth();
    set({ user: null, accessToken: "" });
  },
  logout: () => {
    clearLegacyAuth();
    localStorage.removeItem("va-cart");
    localStorage.removeItem("va-wishlist");
    set({ user: null, accessToken: "" });
  },
}));
