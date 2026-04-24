import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../services/api";
import { Button } from "../../components/ui/Button";

export default function ForgotPassword() {
  const form = useForm({ defaultValues: { email: "" } });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const response = await api.post("/auth/forgot-password", values);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to send reset request");
    }
  });

  return (
    <div className="container-shell py-16">
      <div className="mx-auto max-w-md rounded-[2.5rem] bg-white/80 p-8 shadow-card">
        <h1 className="font-display text-4xl">Forgot Password</h1>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <input {...form.register("email")} placeholder="Email" className="w-full rounded-2xl border border-ink/10 px-4 py-3" />
          <Button type="submit" className="w-full">
            Send reset link
          </Button>
        </form>
      </div>
    </div>
  );
}
