import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import adminApi from "../../utils/adminApi";
import { formatPrice } from "../../utils/formatPrice";

export default function ProductsAdmin() {
  const queryClient = useQueryClient();
  const productsQuery = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => (await adminApi.get("/admin/products")).data,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => (await adminApi.delete(`/admin/products/${id}`)).data,
    onSuccess: () => {
      toast.success("Product deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Unable to delete product");
    },
  });

  function handleDelete(product) {
    const confirmed = window.confirm(`Delete "${product.name}"?`);
    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(product._id);
  }

  return (
    <div className="rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-card backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl text-ink">Products</h1>
          <p className="mt-2 text-sm text-ink/60">
            Showing {productsQuery.data?.items?.length || 0} products on this page out of{" "}
            {productsQuery.data?.pagination?.total || 0} total products already stored in the database.
          </p>
        </div>
        <Link to="/admin/products/add" className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">
          Add Product
        </Link>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-ink/55">
            <tr>
              <th className="pb-3">Name</th>
              <th className="pb-3">Category</th>
              <th className="pb-3">Price</th>
              <th className="pb-3">Stock</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(productsQuery.data?.items || []).map((product) => (
              <tr key={product._id} className="border-t border-ink/8">
                <td className="py-4 font-medium text-ink">{product.name}</td>
                <td className="py-4 text-ink/65">{product.category?.name || "-"}</td>
                <td className="py-4 text-ink/65">{formatPrice(product.salePrice || product.basePrice)}</td>
                <td className="py-4 text-ink/65">{product.stock || 0}</td>
                <td className="py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      to={`/admin/products/${product._id}/edit`}
                      className="rounded-full border border-ink/10 px-4 py-2 text-xs font-semibold text-ink transition hover:bg-mist"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(product)}
                      className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
