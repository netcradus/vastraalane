import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut, Menu, ShieldCheck, X } from "lucide-react";
import toast from "react-hot-toast";

const adminLinks = [
  { to: "/admin/products", label: "Products" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/coupons", label: "Coupons" },
];

export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("adminToken");
    setMobileOpen(false);
    toast.success("Logged out successfully");
    navigate("/", { replace: true });
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(213,174,111,0.18),transparent_30%),linear-gradient(180deg,#fcf8f2_0%,#f4ede1_100%)]">
      <div className="border-b border-ink/10 bg-white/80 px-4 py-4 shadow-sm backdrop-blur xl:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-clay">
              <ShieldCheck size={16} />
              Admin Only
            </div>
            <div className="mt-1 font-display text-2xl text-ink">Vastra Admin</div>
          </div>
          <button
            type="button"
            className="rounded-full border border-ink/10 bg-white p-3 text-ink"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label={mobileOpen ? "Close admin navigation" : "Open admin navigation"}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <div className="grid min-h-screen xl:grid-cols-[280px_1fr]">
        <aside className={`${mobileOpen ? "block" : "hidden"} border-r border-white/10 bg-ink px-6 py-8 text-white shadow-[0_20px_60px_rgba(31,26,23,0.22)] xl:block`}>
          <Link to="/admin/products" className="font-display text-2xl text-gold" onClick={() => setMobileOpen(false)}>
            Vastra Admin
          </Link>
          <div className="mt-3 text-sm text-white/60">Only the admin account can access and manage this admin panel.</div>
          <div className="mt-10 grid gap-2">
            {adminLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 text-sm transition ${isActive ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <LogOut size={16} />
            Logout
          </button>
        </aside>
        <section className="min-w-0 p-4 sm:p-6 xl:p-10">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
