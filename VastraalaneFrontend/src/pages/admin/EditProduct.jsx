import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import adminApi from "../../utils/adminApi";
import { ProductEditorForm } from "../../components/admin/ProductEditorForm";

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  const productQuery = useQuery({
    queryKey: ["admin-product", id],
    queryFn: async () => (await adminApi.get(`/admin/products/${id}`)).data,
  });

  async function handleSubmit(values, selectedFiles) {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      await adminApi.put(`/admin/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Product updated");
      navigate("/admin/products");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update product");
    }
  }

  if (productQuery.isLoading) {
    return <div className="rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-card backdrop-blur-xl">Loading product...</div>;
  }

  return (
    <ProductEditorForm
      title="Edit Product"
      description="Update product details, replace images, adjust stock, and keep storefront listing in sync."
      initialValues={productQuery.data?.item}
      submitLabel="Update product"
      submittingLabel="Updating..."
      onSubmit={handleSubmit}
    />
  );
}
