import { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../../utils/adminApi";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await adminApi.post("/admin/login", { email, password });
      localStorage.setItem("adminToken", response.data.token);
      navigate("/admin/products", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(213,174,111,0.22),transparent_34%),linear-gradient(180deg,#fcf8f2_0%,#f4ede1_100%)] px-4 py-12">
      <section className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center">
        <div className="w-full rounded-[2rem] border border-white/70 bg-white/85 p-7 shadow-card backdrop-blur-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-clay">Seeded Admin Only</p>
          <h1 className="mt-3 font-display text-4xl text-ink">Admin Login</h1>
          <p className="mt-3 text-sm leading-6 text-ink/60">
            Use the seeded admin credentials from the backend environment. Admin accounts cannot be registered here.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
            <input
              type="email"
              placeholder="Admin email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-clay"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-clay"
            />
            {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
