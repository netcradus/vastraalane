import { useProducts } from "../../hooks/useProducts";
import { ProductGrid } from "../../components/product/ProductGrid";

export default function Sale() {
  const saleQuery = useProducts({ sort: "price_asc", limit: 16 });
  const discountedItems = (saleQuery.data?.items || []).filter((item) => item.discountPercent > 0);

  return (
    <div className="container-shell py-12" data-reveal>
      <div className="floating-3d-soft rounded-[3rem] bg-ink px-8 py-12 text-white shadow-card">
        <p className="text-xs uppercase tracking-[0.2em] text-gold">Sale edit</p>
        <h1 className="mt-3 font-display text-[clamp(2.3rem,5vw,4.5rem)]">Steeper markdowns, same premium mood.</h1>
        <p className="mt-4 max-w-2xl text-[clamp(0.95rem,1.25vw,1.05rem)] text-white/70">
          Discover limited-time offers across selected styles, with the same elevated presentation and smoother browsing experience.
        </p>
      </div>

      <div className="mt-12">
        <ProductGrid products={discountedItems} isLoading={saleQuery.isLoading} />
      </div>
    </div>
  );
}
