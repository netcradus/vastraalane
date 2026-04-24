import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { Button } from "../../components/ui/Button";
import { authService } from "../../services/authService";

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const resetCart = useCartStore((state) => state.resetForLogout);
  const resetWishlist = useWishlistStore((state) => state.resetForLogout);
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await authService.logout();
    } catch (error) {
      // Local logout still clears the session reliably.
    } finally {
      resetCart();
      resetWishlist();
      logout();
      toast.success("Logged out successfully");
      navigate("/login");
    }
  }

  return (
    <div className="container-shell py-12">
      <div className="glass-panel p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="font-display text-4xl">Profile</h1>
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
        <div className="mt-8 grid gap-4 text-sm text-ink/70">
          <p>Name: {user?.name}</p>
          <p>Email: {user?.email}</p>
          <p>Role: {user?.role}</p>
        </div>
      </div>
    </div>
  );
}
