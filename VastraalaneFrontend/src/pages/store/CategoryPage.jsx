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

const categoryMeta = {
  "luxury-watch": {
    title: "Luxury Watches",
    description: "Browse premium timepieces and narrow the collection by men's and women's styles in one place.",
  },
  "flipflops-crocs": {
    title: "Flipflops, Crocs & Loafers",
    description: "Explore easy everyday footwear with quick filters at the top to jump between loafers and flipflops/crocs.",
  },
  "cordset-and-tracksuit": {
    title: "Cordset & Tracksuit",
    description: "Shop coordinated casual styles together and switch between cordset/tracksuit looks and jeans/trackpant options from the top filters.",
  },
};

export default function CategoryPage() {
  const { slug } = useParams();
  const productsSectionRef = useRef(null);
  const [sort, setSort] = useState("");
  const [audience, setAudience] = useState("");
  const [footwearFilter, setFootwearFilter] = useState("");
  const [apparelFilter, setApparelFilter] = useState("");
  const [priceMax, setPriceMax] = useState(5000000);
  const [draftPriceMax, setDraftPriceMax] = useState(5000000);
  const [page, setPage] = useState(1);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const isLuxuryWatchCategory = slug === "luxury-watch";
  const isFlipflopsCrocsCategory = slug === "flipflops-crocs";
  const isApparelGroupCategory = slug === "cordset-and-tracksuit";

  const params = useMemo(
    () => ({
      category: slug === "all" ? undefined : slug,
      sort,
      audience: isLuxuryWatchCategory && audience ? audience : undefined,
      subtype: isFlipflopsCrocsCategory && footwearFilter ? footwearFilter : undefined,
      ...(isApparelGroupCategory && apparelFilter ? { subtype: apparelFilter } : {}),
      price_max: priceMax,
      page,
      limit: 24,
    }),
    [slug, sort, audience, isLuxuryWatchCategory, isFlipflopsCrocsCategory, footwearFilter, isApparelGroupCategory, apparelFilter, priceMax, page]
  );

  const productsQuery = useProducts(params);
  const categoriesQuery = useCategories();
  const totalProducts = productsQuery.data?.pagination?.total || 0;
  const isInitialProductLoad =
    (productsQuery.isLoading || productsQuery.isFetching) && visibleProducts.length === 0;
  const hasMore = visibleProducts.length < totalProducts;
  const activeCategoryMeta = categoryMeta[slug] || {
    title: slug.replace(/-/g, " "),
    description: "Explore styles curated under this collection and browse the pieces that best match your mood.",
  };

  useEffect(() => {
    setPage(1);
    setVisibleProducts([]);
  }, [slug, sort, audience, footwearFilter, apparelFilter, priceMax]);

  useEffect(() => {
    if (!isLuxuryWatchCategory && audience) {
      setAudience("");
    }
  }, [audience, isLuxuryWatchCategory]);

  useEffect(() => {
    if (!isFlipflopsCrocsCategory && footwearFilter) {
      setFootwearFilter("");
    }
  }, [footwearFilter, isFlipflopsCrocsCategory]);

  useEffect(() => {
    if (!isApparelGroupCategory && apparelFilter) {
      setApparelFilter("");
    }
  }, [apparelFilter, isApparelGroupCategory]);

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
        </aside>
        <div ref={productsSectionRef}>
          <div className="mb-8" data-reveal>
            <h1 className="font-display text-[clamp(2.3rem,5vw,4.5rem)] capitalize">{activeCategoryMeta.title}</h1>
            <p className="mt-3 text-[clamp(0.95rem,1.2vw,1.05rem)] text-ink/60">{activeCategoryMeta.description}</p>
            <p className="mt-2 text-sm text-ink/50">
              {isInitialProductLoad ? "Loading products..." : totalProducts ? `${visibleProducts.length} of ${totalProducts} products loaded` : "Loading category count..."}
            </p>
          </div>
          <div className="mb-8 rounded-[2rem] border border-white/60 bg-white/85 p-5 shadow-card backdrop-blur-xl lg:sticky lg:top-24 lg:z-10" data-reveal>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">Refine collection</p>
                <p className="mt-1 text-sm text-ink/55">Use the top filters to narrow products faster.</p>
              </div>
            </div>
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_240px_auto] lg:items-end">
              <div>
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
              <div>
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
                className="text-sm font-semibold text-clay lg:justify-self-end"
                onClick={() => {
                  setSort("");
                  setAudience("");
                  setFootwearFilter("");
                  setApparelFilter("");
                  setPriceMax(5000000);
                  setDraftPriceMax(5000000);
                  setPage(1);
                  setVisibleProducts([]);
                }}
              >
                Clear Filters
              </button>
            </div>
            {isLuxuryWatchCategory ? (
              <div className="mt-6">
                <label className="text-sm font-medium text-ink/70">Watch filter</label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    { value: "", label: "All Watches" },
                    { value: "men", label: "Men's Watch" },
                    { value: "women", label: "Women's Watch" },
                  ].map((option) => (
                    <button
                      key={option.value || "all"}
                      type="button"
                      onClick={() => setAudience(option.value)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        audience === option.value
                          ? "bg-ink text-white"
                          : "border border-ink/10 bg-white text-ink/70 hover:bg-mist"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            {isFlipflopsCrocsCategory ? (
              <div className="mt-6">
                <label className="text-sm font-medium text-ink/70">Footwear filter</label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    { value: "", label: "All" },
                    { value: "loafers", label: "Loafers" },
                    { value: "flipflops-crocs", label: "Flipflops/Crocs" },
                  ].map((option) => (
                    <button
                      key={option.value || "all"}
                      type="button"
                      onClick={() => setFootwearFilter(option.value)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        footwearFilter === option.value
                          ? "bg-ink text-white"
                          : "border border-ink/10 bg-white text-ink/70 hover:bg-mist"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            {isApparelGroupCategory ? (
              <div className="mt-6">
                <label className="text-sm font-medium text-ink/70">Style filter</label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    { value: "", label: "All" },
                    { value: "cordset-and-tracksuit", label: "Cordset & Tracksuit" },
                    { value: "jeans-and-trouser-and-trackpant", label: "Jeans & Trackpants" },
                  ].map((option) => (
                    <button
                      key={option.value || "all"}
                      type="button"
                      onClick={() => setApparelFilter(option.value)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        apparelFilter === option.value
                          ? "bg-ink text-white"
                          : "border border-ink/10 bg-white text-ink/70 hover:bg-mist"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          {visibleProducts.length === 0 && !isInitialProductLoad && !productsQuery.isError ? (
            <div className="rounded-[2rem] bg-white/80 p-8 text-ink/70 shadow-card">
              No products matched this category with the current filters. Try increasing the price range or clearing filters.
            </div>
          ) : null}
          <ProductGrid
            products={visibleProducts}
            isLoading={isInitialProductLoad && page === 1}
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
