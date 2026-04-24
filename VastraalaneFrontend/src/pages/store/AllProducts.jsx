import { useMemo, useState } from "react";
import { useProducts } from "../../hooks/useProducts";
import { ProductGrid } from "../../components/product/ProductGrid";
import { Button } from "../../components/ui/Button";

export default function AllProducts() {
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const params = useMemo(() => ({ sort, limit: 24, page }), [sort, page]);
  const productsQuery = useProducts(params);
  const products = productsQuery.data?.items || [];
  const pagination = productsQuery.data?.pagination;

  return (
    <div className="container-shell py-12" data-reveal>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-clay">All products</p>
          <h1 className="mt-2 font-display text-[clamp(2.3rem,5vw,4.4rem)]">Browse the full live collection</h1>
          <p className="mt-3 max-w-2xl text-[clamp(0.95rem,1.25vw,1.05rem)] text-ink/60">
            Explore the full Vastraalane collection and keep browsing beyond the featured edits and curated highlights.
          </p>
        </div>
        <select
          value={sort}
          onChange={(event) => {
            setSort(event.target.value);
            setPage(1);
          }}
          className="rounded-2xl border border-ink/10 bg-white px-4 py-3"
        >
          <option value="">Featured</option>
          <option value="newest">Newest</option>
          <option value="price_asc">Price Low-High</option>
          <option value="price_desc">Price High-Low</option>
        </select>
      </div>

      <ProductGrid
        products={products}
        isLoading={productsQuery.isLoading}
        isError={productsQuery.isError}
        errorMessage="The product catalog could not be loaded right now."
      />

      {pagination ? (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button variant="secondary" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1}>
            Previous
          </Button>
          <span className="text-sm text-ink/60">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            onClick={() => setPage((value) => value + 1)}
            disabled={pagination.page >= pagination.totalPages}
          >
            Next
          </Button>
        </div>
      ) : null}
    </div>
  );
}
