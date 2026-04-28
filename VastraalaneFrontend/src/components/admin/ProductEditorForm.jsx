import { useEffect, useState } from "react";
import { Button } from "../ui/Button";

const baseDefaults = {
  name: "",
  slug: "",
  category: "",
  brand: "",
  description: "",
  basePrice: 0,
  discountPercent: 0,
  tags: "",
  size: "",
  color: "",
  stock: 0,
  isFeatured: false,
  isActive: true,
};

export function ProductEditorForm({
  title,
  description,
  initialValues,
  submitLabel,
  submittingLabel,
  isSubmitting,
  onSubmit,
}) {
  const [values, setValues] = useState(baseDefaults);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    setValues({
      ...baseDefaults,
      ...initialValues,
      category: initialValues?.category || "",
      size: initialValues?.size || initialValues?.sizes?.[0] || "",
      color: initialValues?.color || initialValues?.colors?.[0] || "",
      stock: initialValues?.stock ?? 0,
      tags: Array.isArray(initialValues?.tags) ? initialValues.tags.join(", ") : initialValues?.tags || "",
    });
  }, [initialValues]);

  function updateField(field, nextValue) {
    setValues((current) => ({ ...current, [field]: nextValue }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await onSubmit(
      {
        ...values,
        salePrice: values.basePrice,
        discountPercent: 0,
      },
      selectedFiles,
    );
  }

  return (
    <div className="rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-card backdrop-blur-xl">
      <h1 className="font-display text-4xl text-ink">{title}</h1>
      <p className="mt-3 text-sm text-ink/60">{description}</p>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-5 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-ink">Product name</span>
          <input
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Example: Tom Ford Premium Sunglasses"
            className="rounded-2xl border border-ink/10 bg-white px-4 py-3"
            required
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-ink">Slug</span>
          <input
            value={values.slug}
            onChange={(event) => updateField("slug", event.target.value)}
            placeholder="tom-ford-premium-sunglasses"
            className="rounded-2xl border border-ink/10 bg-white px-4 py-3"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-ink">Category</span>
          <input
            value={values.category}
            onChange={(event) => updateField("category", event.target.value)}
            placeholder="Example: Sunglasses"
            className="rounded-2xl border border-ink/10 bg-white px-4 py-3"
            required
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-ink">Brand</span>
          <input
            value={values.brand}
            onChange={(event) => updateField("brand", event.target.value)}
            placeholder="Example: Tom Ford"
            className="rounded-2xl border border-ink/10 bg-white px-4 py-3"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-ink">Base price</span>
          <input
            type="number"
            min="0"
            value={values.basePrice}
            onChange={(event) => updateField("basePrice", Number(event.target.value))}
            placeholder="MRP / base price"
            className="rounded-2xl border border-ink/10 bg-white px-4 py-3"
            required
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-ink">Size</span>
          <input
            value={values.size}
            onChange={(event) => updateField("size", event.target.value)}
            placeholder="Example: Free Size, M, 42"
            className="rounded-2xl border border-ink/10 bg-white px-4 py-3"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-ink">Color</span>
          <input
            value={values.color}
            onChange={(event) => updateField("color", event.target.value)}
            placeholder="Example: Black"
            className="rounded-2xl border border-ink/10 bg-white px-4 py-3"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-ink">Stock quantity</span>
          <input
            type="number"
            min="0"
            value={values.stock}
            onChange={(event) => updateField("stock", Number(event.target.value))}
            placeholder="Example: 5"
            className="rounded-2xl border border-ink/10 bg-white px-4 py-3"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-ink">Tags</span>
          <input
            value={values.tags}
            onChange={(event) => updateField("tags", event.target.value)}
            placeholder="Comma separated tags"
            className="rounded-2xl border border-ink/10 bg-white px-4 py-3"
          />
        </label>

        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm font-medium text-ink">Description</span>
          <textarea
            value={values.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="Add product description"
            className="min-h-40 rounded-2xl border border-ink/10 bg-white px-4 py-3"
            required
          />
        </label>

        <label className="rounded-2xl border border-dashed border-ink/20 bg-mist/60 px-4 py-4 md:col-span-2">
          <span className="mb-2 block text-sm font-medium text-ink">Product images</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => setSelectedFiles(Array.from(event.target.files || []))}
            className="block w-full text-sm text-ink/70"
          />
          <span className="mt-2 block text-xs text-ink/50">
            {selectedFiles.length ? `${selectedFiles.length} image(s) selected` : "Upload one or multiple product images"}
          </span>
        </label>

        <label className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-white px-4 py-3">
          <input
            type="checkbox"
            checked={Boolean(values.isFeatured)}
            onChange={(event) => updateField("isFeatured", event.target.checked)}
          />
          <span className="text-sm text-ink">Show in featured sections</span>
        </label>

        <label className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-white px-4 py-3">
          <input
            type="checkbox"
            checked={Boolean(values.isActive)}
            onChange={(event) => updateField("isActive", event.target.checked)}
          />
          <span className="text-sm text-ink">Active on storefront</span>
        </label>

        <div className="md:col-span-2">
          <Button type="submit" className="w-fit" disabled={isSubmitting}>
            {isSubmitting ? submittingLabel : submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}
