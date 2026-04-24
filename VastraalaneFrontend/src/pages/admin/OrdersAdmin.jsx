import { useQuery } from "@tanstack/react-query";
import adminApi from "../../utils/adminApi";
import { formatPrice } from "../../utils/formatPrice";

export default function OrdersAdmin() {
  const ordersQuery = useQuery({
    queryKey: ["admin-orders-page"],
    queryFn: async () => (await adminApi.get("/admin/orders")).data,
  });

  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-sm">
      <h1 className="font-display text-4xl text-slate-900">Orders</h1>
      <div className="mt-6 space-y-4">
        {(ordersQuery.data?.items || []).map((order) => (
          <div key={order._id} className="rounded-2xl border border-slate-100 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">{order._id}</p>
                <p className="text-sm text-slate-500">{order.user?.name || "Customer"}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-900">{formatPrice(order.total)}</p>
                <p className="text-sm capitalize text-slate-500">{order.fulfillmentStatus}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
