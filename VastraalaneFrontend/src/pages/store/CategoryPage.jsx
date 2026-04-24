import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCategories, useProducts } from "../../hooks/useProducts";
import { ProductGrid } from "../../components/product/ProductGrid";
import { formatPrice } from "../../utils/formatPrice";
import { Button } from "../../components/ui/Button";

const sortOptions = [
  { value: "", label: "Featured" },
  { value: "price_asc", label: "Price Low-High" },
  { value: "price_desc", label: "Price High-Low" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Best Rating" },
];

export default function CategoryPage() {
  const { slug } = useParams();
  const productsSectionRef = useRef(null);
  const [sort, setSort] = useState("");
  const [priceMax, setPriceMax] = useState(5000000);
  const [draftPriceMax, setDraftPriceMax] = useState(5000000);
  const [page, setPage] = useState(1);
  const [visibleProducts, setVisibleProducts] = useState([]);

  const params = useMemo(
    () => ({
      category: slug === "all" ? undefined : slug,
      sort,
      price_max: priceMax,
      page,
      limit: 24,
    }),
    [slug, sort, priceMax, page]
  );

  const productsQuery = useProducts(params);
  const categoriesQuery = useCategories();
  const totalProducts = productsQuery.data?.pagination?.total || 0;
  const hasMore = visibleProducts.length < totalProducts;

  useEffect(() => {
    setPage(1);
    setVisibleProducts([]);
  }, [slug, sort, priceMax]);

  useEffect(() => {
    if (!productsSectionRef.current) {
      return;
    }

    productsSectionRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [slug]);

  useEffect(() => {
    if (!productsQuery.data?.items) {
      return;
    }

    setVisibleProducts((currentProducts) => {
      if (page === 1) {
        return productsQuery.data.items;
      }

      const seenIds = new Set(currentProducts.map((product) => product._id));
      const nextProducts = productsQuery.data.items.filter((product) => !seenIds.has(product._id));
      return [...currentProducts, ...nextProducts];
    });
  }, [page, productsQuery.data]);

  return (
    <div className="container-shell py-12" data-reveal>
      <p className="text-sm text-ink/50">Home / Category / {slug}</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="glass-panel h-fit p-6" data-reveal>
          <h2 className="font-display text-2xl">Categories</h2>
          <div className="mt-6 grid gap-2">
            <Link
              to="/category/all"
              className={`rounded-2xl px-4 py-3 text-sm transition ${
                slug === "all" ? "bg-ink text-white" : "bg-white/70 text-ink/70 hover:bg-white"
              }`}
            >
              All Products
            </Link>
            {(categoriesQuery.data?.items || []).map((category) => (
              <Link
                key={category._id}
                to={`/category/${category.slug}`}
                className={`rounded-2xl px-4 py-3 text-sm transition ${
                  slug === category.slug ? "bg-ink text-white" : "bg-white/70 text-ink/70 hover:bg-white"
                }`}
              >
                <span className="block font-medium">{category.name}</span>
                <span className={`mt-1 block text-xs ${slug === category.slug ? "text-white/70" : "text-ink/45"}`}>
                  {category.productCount || 0} products
                </span>
              </Link>
            ))}
          </div>

          <div className="my-6 h-px bg-ink/10" />
          <h2 className="font-display text-2xl">Filters</h2>
          <div className="mt-6">
            <label className="text-sm font-medium text-ink/70">Max price</label>
            <p className="mt-2 text-sm text-ink/50">{formatPrice(draftPriceMax)}</p>
            <input
              type="range"
              min="10000"
              max="5000000"
              step="10000"
              value={draftPriceMax}
              onChange={(event) => setDraftPriceMax(Number(event.target.value))}
              onMouseUp={() => setPriceMax(draftPriceMax)}
              onTouchEnd={() => setPriceMax(draftPriceMax)}
              className="mt-3 w-full"
            />
          </div>
          <div className="mt-6">
            <label className="text-sm font-medium text-ink/70">Sort by</label>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="mt-3 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <button
            className="mt-6 text-sm font-semibold text-clay"
            onClick={() => {
              setSort("");
              setPriceMax(5000000);
              setDraftPriceMax(5000000);
              setPage(1);
              setVisibleProducts([]);
            }}
          >
            Clear Filters
          </button>
        </aside>
        <div ref={productsSectionRef}>
          <div className="mb-8" data-reveal>
            <h1 className="font-display text-[clamp(2.3rem,5vw,4.5rem)] capitalize">{slug.replace(/-/g, " ")}</h1>
            <p className="mt-3 text-[clamp(0.95rem,1.2vw,1.05rem)] text-ink/60">Explore styles curated under this collection and browse the pieces that best match your mood.</p>
            <p className="mt-2 text-sm text-ink/50">
              {totalProducts ? `${visibleProducts.length} of ${totalProducts} products loaded` : "Loading category count..."}
            </p>
          </div>
          {visibleProducts.length === 0 && !productsQuery.isLoading ? (
            <div className="rounded-[2rem] bg-white/80 p-8 text-ink/70 shadow-card">
              No products matched this category with the current filters. Try increasing the price range or clearing filters.
            </div>
          ) : null}
          <ProductGrid
            products={visibleProducts}
            isLoading={productsQuery.isLoading && page === 1}
            isError={productsQuery.isError}
            errorMessage="This category could not be loaded right now."
          />
          {hasMore ? (
            <div className="mt-8 flex justify-center">
              <Button
                onClick={() => setPage((currentPage) => currentPage + 1)}
                disabled={productsQuery.isLoading}
              >
                {productsQuery.isLoading ? "Loading more..." : "View More"}
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
