import { Heart, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { formatPrice } from "../../utils/formatPrice";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { useAuthStore } from "../../store/authStore";

export function ProductCard({ product }) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const toggleCartItem = useCartStore((state) => state.toggleItem);
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const inWishlist = useWishlistStore((state) => state.items.some((item) => item._id === product._id));
  const availableSizes = product.sizes?.length ? product.sizes : ["One Size"];
  const isOutOfStock = product.inStock === false;
  const defaultVariant = {
    size: availableSizes.length === 1 ? availableSizes[0] : "",
    color: product.colors?.[0] || "",
  };
  const inCart = useCartStore((state) =>
    defaultVariant.size ? state.hasItem(product._id, defaultVariant) : false
  );
  const imageUrl =
    (typeof product.images?.[0] === "string" ? product.images[0] : product.images?.[0]?.url) ||
    product.image ||
    "https://placehold.co/600x750/f4ede1/1f1a17?text=Vastra+Alane";

  function redirectToLogin(message) {
    toast(message);
    navigate("/login");
  }

  function handleCartClick(event) {
    event.stopPropagation();

    if (!user) {
      redirectToLogin("Please login to add products to your cart.");
      return;
    }

    if (isOutOfStock) {
      toast.error("This product is currently out of stock.");
      return;
    }

    if (availableSizes.length > 1) {
      toast("Please select a size first.");
      navigate(`/product/${product._id}`);
      return;
    }

    const wasAdded = toggleCartItem(product, 1, defaultVariant);
    toast.success(wasAdded ? "Added to cart" : "Removed from cart");
  }

  function handleWishlistClick(event) {
    event.stopPropagation();

    if (!user) {
      redirectToLogin("Please login to save products to your wishlist.");
      return;
    }

    toggleWishlist(product);
    toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
  }

  return (
    <article className="group product-card-shell">
      <Link to={`/product/${product._id}`} className="flex h-full flex-col">
        <div className="product-card-image-wrap">
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-white/20 via-transparent to-ink/10" />
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            decoding="async"
            sizes="(max-width: 640px) 46vw, (max-width: 1024px) 45vw, 320px"
            className="product-card-image"
          />
        </div>

        <div className="product-card-meta">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="product-card-category text-ink/50">
                {product.category?.name || product.brand || "Collection"}
              </p>
              <h3 className="product-card-title mt-2 font-semibold text-ink">{product.name}</h3>
              <p className="product-card-description mt-3">
                Crafted to bring a cleaner silhouette and an elevated everyday finish.
              </p>
            </div>
          </div>

          <div className="product-card-footer">
            <div className="product-card-price-row">
              <div>
                <span className="product-card-price text-clay">
                  {formatPrice(product.salePrice || product.basePrice)}
                </span>
                {product.discountPercent > 0 ? (
                  <span className="ml-2 text-sm text-ink/40 line-through">
                    {formatPrice(product.basePrice)}
                  </span>
                ) : null}
              </div>
              {isOutOfStock ? <span className="text-xs font-semibold uppercase tracking-[0.16em] text-red-500">Out of Stock</span> : null}
            </div>
          </div>
        </div>
      </Link>

      <div className="product-card-actions">
        <button
          className={`icon-button-3d product-card-wishlist-button inline-flex items-center justify-center rounded-full border transition ${
            inWishlist
              ? "border-red-200 bg-red-50 text-red-500"
              : "border-ink/10 bg-white text-ink/60 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
          }`}
          onClick={handleWishlistClick}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          type="button"
        >
          <Heart className={inWishlist ? "fill-current" : ""} size={18} />
        </button>

        <button
          className={`button-3d product-card-cart-button inline-flex items-center justify-center gap-2 rounded-full border text-sm font-semibold transition ${
            isOutOfStock
              ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
              : availableSizes.length > 1
              ? "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100"
              : inCart
                ? "border-forest bg-forest text-white hover:bg-forest/90"
                : "border-ink/10 bg-white text-ink/70 hover:border-forest/30 hover:bg-forest/5 hover:text-forest"
          }`}
          onClick={handleCartClick}
          aria-label={isOutOfStock ? "Out of stock" : availableSizes.length > 1 ? "Select size" : inCart ? "Remove from cart" : "Add to cart"}
          type="button"
          disabled={isOutOfStock}
        >
          <ShoppingBag size={16} />
          {isOutOfStock ? "Out of Stock" : availableSizes.length > 1 ? "Select Size" : inCart ? "Added to Cart" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
}
