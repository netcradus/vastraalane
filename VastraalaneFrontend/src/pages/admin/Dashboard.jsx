import { useQuery } from "@tanstack/react-query";
import adminApi from "../../utils/adminApi";
import { formatPrice } from "../../utils/formatPrice";

export default function Dashboard() {
  const ordersQuery = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => (await adminApi.get("/admin/orders")).data,
  });
  const productsQuery = useQuery({
    queryKey: ["admin-products-dashboard"],
    queryFn: async () => (await adminApi.get("/admin/products")).data,
  });
  const usersQuery = useQuery({
    queryKey: ["admin-users-dashboard"],
    queryFn: async () => (await adminApi.get("/admin/users")).data,
  });

  const revenue = (ordersQuery.data?.items || []).reduce((sum, order) => sum + order.total, 0);

  const cards = [
    { label: "Total Revenue", value: formatPrice(revenue) },
    { label: "Total Orders", value: ordersQuery.data?.items?.length || 0 },
    { label: "Total Products", value: productsQuery.data?.pagination?.total || productsQuery.data?.items?.length || 0 },
    { label: "Total Users", value: usersQuery.data?.items?.length || 0 },
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
      <div className="grid gap-6 2xl:grid-cols-2">
        <div className="rounded-[2rem] border border-white/60 bg-white/80 p-5 shadow-card backdrop-blur-xl sm:p-6">
          <h2 className="text-lg font-semibold text-ink">Recent Orders</h2>
          <div className="mt-6 space-y-3">
            {(ordersQuery.data?.items || []).slice(0, 6).map((order) => (
              <div key={order._id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-mist/70 px-4 py-3">
                <span className="text-sm text-ink/75">{order.user?.name || "Customer"}</span>
                <span className="text-sm font-medium text-ink">{formatPrice(order.total)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[2rem] border border-white/60 bg-white/80 p-5 shadow-card backdrop-blur-xl sm:p-6">
          <h2 className="text-lg font-semibold text-ink">Low Stock Alerts</h2>
          <div className="mt-6 space-y-3">
            {(productsQuery.data?.items || [])
              .filter((product) => (product.variants || []).some((variant) => variant.stock < 10))
              .slice(0, 6)
              .map((product) => (
                <div key={product._id} className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  {product.name}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
