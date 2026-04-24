import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authService } from "../../services/authService";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { Button } from "../../components/ui/Button";

export default function Register() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const hydrateCart = useCartStore((state) => state.hydrateForCurrentUser);
  const hydrateWishlist = useWishlistStore((state) => state.hydrateForCurrentUser);
  const form = useForm({ defaultValues: { name: "", email: "", password: "" } });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const response = await authService.register(values);
      setSession({ user: response.user, accessToken: response.tokens.accessToken });
      hydrateCart();
      hydrateWishlist();
      toast.success("Account created");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  });

  return (
    <div className="container-shell py-16">
      <div className="mx-auto max-w-md rounded-[2.5rem] bg-white/80 p-8 shadow-card">
        <h1 className="font-display text-4xl">Register</h1>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <input {...form.register("name")} placeholder="Name" className="w-full rounded-2xl border border-ink/10 px-4 py-3" />
          <input {...form.register("email")} placeholder="Email" className="w-full rounded-2xl border border-ink/10 px-4 py-3" />
          <input
            {...form.register("password")}
            type="password"
            placeholder="Password"
            className="w-full rounded-2xl border border-ink/10 px-4 py-3"
          />
          <Button type="submit" className="w-full">
            {form.formState.isSubmitting ? "Creating..." : "Create account"}
          </Button>
        </form>
        <p className="mt-6 text-sm text-ink/60">
          Already have an account? <Link to="/login" className="text-clay">Login</Link>
        </p>
      </div>
    </div>
  );
}
