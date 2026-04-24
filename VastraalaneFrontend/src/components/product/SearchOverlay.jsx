import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { productService } from "../../services/productService";
import { formatPrice } from "../../utils/formatPrice";

export function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      const data = await productService.search(query);
      setResults(data.items || []);
      localStorage.setItem(
        "va-searches",
        JSON.stringify([query, ...JSON.parse(localStorage.getItem("va-searches") || "[]")].slice(0, 6))
      );
    }, 350);

    return () => clearTimeout(timeout);
  }, [query]);

  const recentSearches = JSON.parse(localStorage.getItem("va-searches") || "[]");

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-auto bg-ink/80 p-6 text-white backdrop-blur"
        >
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-4xl">Search the collection</h2>
              <button onClick={onClose}>Close</button>
            </div>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products, brands, tags..."
              className="w-full rounded-full border border-white/20 bg-white/10 px-6 py-4 text-white outline-none placeholder:text-white/50"
            />
            {!query && recentSearches.length ? (
              <div className="mt-8">
                <p className="text-sm uppercase tracking-[0.2em] text-white/50">Recent searches</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {recentSearches.map((item) => (
                    <button key={item} className="button-3d rounded-full border border-white/15 px-4 py-2 text-sm" onClick={() => setQuery(item)}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {results.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 transition hover:-translate-y-1 hover:bg-white/10"
                  onClick={onClose}
                >
                  <p className="text-sm text-white/60">{product.category?.name || product.brand}</p>
                  <h3 className="mt-2 font-semibold">{product.name}</h3>
                  <p className="mt-2 text-gold">{formatPrice(product.salePrice || product.basePrice)}</p>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
