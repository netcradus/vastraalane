import { useQuery } from "@tanstack/react-query";
import { orderService } from "../../services/orderService";
import { formatPrice } from "../../utils/formatPrice";

export default function Orders() {
  const ordersQuery = useQuery({
    queryKey: ["my-orders"],
    queryFn: orderService.mine,
  });

  return (
    <div className="container-shell py-12">
      <h1 className="font-display text-4xl">Orders</h1>
      <div className="mt-8 space-y-4">
        {(ordersQuery.data?.items || []).map((order) => (
          <div key={order._id} className="glass-panel p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{order._id}</p>
                <p className="text-sm text-ink/60">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatPrice(order.total)}</p>
                <p className="text-sm capitalize text-ink/60">{order.fulfillmentStatus}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
