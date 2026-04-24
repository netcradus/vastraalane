import { useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";

export function UserStoreSync() {
  const userId = useAuthStore((state) => state.user?._id || "");
  const hydrateCart = useCartStore((state) => state.hydrateForCurrentUser);
  const resetCart = useCartStore((state) => state.resetForLogout);
  const hydrateWishlist = useWishlistStore((state) => state.hydrateForCurrentUser);
  const resetWishlist = useWishlistStore((state) => state.resetForLogout);

  useEffect(() => {
    if (userId) {
      hydrateCart();
      hydrateWishlist();
      return;
    }

    resetCart();
    resetWishlist();
  }, [hydrateCart, hydrateWishlist, resetCart, resetWishlist, userId]);

  return null;
}
