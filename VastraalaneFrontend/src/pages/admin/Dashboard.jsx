import { useQuery } from "@tanstack/react-query";
import adminApi from "../../utils/adminApi";
import { formatPrice } from "../../utils/formatPrice";

export default function Dashboard() {
  const dashboardQuery = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => (await adminApi.get("/admin/dashboard")).data,
    staleTime: 60 * 1000,
  });

  const dashboard = dashboardQuery.data?.item;

  const cards = [
    { label: "Total Revenue", value: formatPrice(dashboard?.totalRevenue || 0) },
    { label: "Total Orders", value: dashboard?.totalOrders || 0 },
    { label: "Total Products", value: dashboard?.totalProducts || 0 },
    { label: "Total Users", value: dashboard?.totalUsers || 0 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-[clamp(2.2rem,6vw,4rem)] text-ink">Dashboard</h1>
        <p className="mt-3 text-ink/60">Track product, order, and user activity across the Vastraalane storefront.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-[2rem] border border-white/60 bg-white/80 p-5 shadow-card backdrop-blur-xl sm:p-6">
            <p className="text-sm text-ink/55">{card.label}</p>
            <p className="mt-4 break-words text-[clamp(1.6rem,4vw,2.25rem)] font-semibold text-ink">{card.value}</p>
          </div>
        ))}
      </div>
      {dashboardQuery.isError ? (
        <div className="rounded-[2rem] border border-red-100 bg-red-50/90 px-5 py-4 text-sm text-red-700 shadow-card">
          {dashboardQuery.error?.response?.data?.message || "Unable to load dashboard data right now."}
        </div>
      ) : null}
      <div className="grid gap-6 2xl:grid-cols-2">
        <div className="rounded-[2rem] border border-white/60 bg-white/80 p-5 shadow-card backdrop-blur-xl sm:p-6">
          <h2 className="text-lg font-semibold text-ink">Recent Orders</h2>
          <div className="mt-6 space-y-3">
            {dashboardQuery.isLoading ? <p className="text-sm text-ink/55">Loading recent orders...</p> : null}
            {(dashboard?.recentOrders || []).map((order) => (
              <div key={order._id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-mist/70 px-4 py-3">
                <span className="text-sm text-ink/75">{order.user?.name || "Customer"}</span>
                <span className="text-sm font-medium text-ink">{formatPrice(order.total)}</span>
              </div>
            ))}
            {!dashboardQuery.isLoading && !(dashboard?.recentOrders || []).length ? (
              <p className="text-sm text-ink/55">No orders available yet.</p>
            ) : null}
          </div>
        </div>
        <div className="rounded-[2rem] border border-white/60 bg-white/80 p-5 shadow-card backdrop-blur-xl sm:p-6">
          <h2 className="text-lg font-semibold text-ink">Low Stock Alerts</h2>
          <div className="mt-6 space-y-3">
            {dashboardQuery.isLoading ? <p className="text-sm text-ink/55">Loading stock alerts...</p> : null}
            {(dashboard?.lowStockProducts || []).map((product) => (
              <div key={product._id} className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {product.name}
              </div>
            ))}
            {!dashboardQuery.isLoading && !(dashboard?.lowStockProducts || []).length ? (
              <p className="text-sm text-ink/55">No low stock items right now.</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
