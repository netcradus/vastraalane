import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import { Button } from "../../components/ui/Button";
import { authService } from "../../services/authService";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";

export default function Settings() {
  const form = useForm({ defaultValues: { currentPassword: "", newPassword: "" } });
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const resetCart = useCartStore((state) => state.resetForLogout);
  const resetWishlist = useWishlistStore((state) => state.resetForLogout);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await api.patch("/users/me/password", values);
      toast.success("Password updated");
      form.reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update password");
    }
  });

  async function handleLogout() {
    try {
      await authService.logout();
    } catch (error) {
      // Clear local session even if the API call fails.
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
      <div className="glass-panel max-w-2xl p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="font-display text-4xl">Settings</h1>
          <Button variant="secondary" type="button" onClick={handleLogout}>
            Logout
          </Button>
        </div>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <input
            {...form.register("currentPassword")}
            type="password"
            placeholder="Current password"
            className="w-full rounded-2xl border border-ink/10 px-4 py-3"
          />
          <input
            {...form.register("newPassword")}
            type="password"
            placeholder="New password"
            className="w-full rounded-2xl border border-ink/10 px-4 py-3"
          />
          <Button type="submit">Update password</Button>
        </form>
      </div>
    </div>
  );
}
