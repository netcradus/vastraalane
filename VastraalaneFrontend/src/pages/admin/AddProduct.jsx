import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import adminApi from "../../utils/adminApi";
import { ProductEditorForm } from "../../components/admin/ProductEditorForm";

export default function AddProduct() {
  const navigate = useNavigate();

  async function handleSubmit(values, selectedFiles) {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      await adminApi.post("/admin/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Product created");
      navigate("/admin/products");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to create product");
    }
  }

  return (
    <ProductEditorForm
      title="Add Product"
      description="Create a storefront product with clear fields for category, pricing, stock, images, and storefront visibility."
      submitLabel="Create product"
      submittingLabel="Creating..."
      onSubmit={handleSubmit}
    />
  );
}
