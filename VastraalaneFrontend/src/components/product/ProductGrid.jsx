import { ProductCard } from "./ProductCard";
import { Skeleton } from "../ui/Skeleton";

export function ProductGrid({
  products = [],
  isLoading = false,
  isError = false,
  errorMessage = "Unable to load products right now.",
  emptyMessage = "No products available right now.",
}) {
  if (isLoading) {
    return (
      <div className="product-grid">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="product-skeleton-card" data-reveal>
            <Skeleton className="aspect-square w-full rounded-[1.4rem]" />
            <Skeleton className="mt-4 h-4 w-1/2" />
            <Skeleton className="mt-3 h-6 w-4/5" />
            <Skeleton className="mt-auto h-11 w-full rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-[2rem] border border-dashed border-ink/10 bg-white/70 p-8 text-center text-sm text-ink/65 shadow-card">
        {errorMessage}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="rounded-[2rem] border border-dashed border-ink/10 bg-white/70 p-8 text-center text-sm text-ink/65 shadow-card">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
