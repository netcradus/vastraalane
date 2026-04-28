import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authService } from "../../services/authService";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { Button } from "../../components/ui/Button";

export default function Login() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const hydrateCart = useCartStore((state) => state.hydrateForCurrentUser);
  const hydrateWishlist = useWishlistStore((state) => state.hydrateForCurrentUser);
  const form = useForm({ defaultValues: { email: "", password: "" } });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const response = await authService.login(values);
      setSession({ user: response.user, accessToken: response.tokens.accessToken });
      hydrateCart();
      hydrateWishlist();
      toast.success("Welcome back");

      if (response.user.role === "admin" && response.tokens.adminToken) {
        localStorage.setItem("adminToken", response.tokens.adminToken);
        navigate("/admin/products", { replace: true });
        return;
      }

      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  });

  return (
    <div className="container-shell py-16">
      <div className="mx-auto max-w-md rounded-[2.5rem] bg-white/80 p-8 shadow-card">
        <h1 className="font-display text-4xl">Login</h1>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <input {...form.register("email")} placeholder="Email" className="w-full rounded-2xl border border-ink/10 px-4 py-3" />
          <input
            {...form.register("password")}
            type="password"
            placeholder="Password"
            className="w-full rounded-2xl border border-ink/10 px-4 py-3"
          />
          <Button type="submit" className="w-full">
            {form.formState.isSubmitting ? "Signing in..." : "Login"}
          </Button>
        </form>
        <div className="mt-6 flex items-center justify-between text-sm text-ink/60">
          <Link to="/register">Create account</Link>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
      </div>
    </div>
  );
}
