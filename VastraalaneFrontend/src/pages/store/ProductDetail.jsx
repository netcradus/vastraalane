import { useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Heart, Share2, Star } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { productService } from "../../services/productService";
import { ProductGrid } from "../../components/product/ProductGrid";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { formatPrice } from "../../utils/formatPrice";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { useAuthStore } from "../../store/authStore";

export default function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);
  const modalTouchStartXRef = useRef(0);
  const modalTouchEndXRef = useRef(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const productQuery = useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getProduct(id),
  });

  const product = productQuery.data?.item;
  const availableSizes = useMemo(
    () => (product?.sizes?.length ? product.sizes : ["One Size"]),
    [product]
  );
  const isOutOfStock = product?.inStock === false;
  const availableColors = useMemo(() => product?.colors || [], [product]);
  const selectedVariant = useMemo(() => {
    if (!product) return {};

    const matchingVariant = (product.variants || []).find((variant) => {
      const sizeMatches = selectedSize ? variant.size === selectedSize : true;
      const colorMatches = selectedColor ? variant.color === selectedColor : true;
      return sizeMatches && colorMatches;
    });

    return matchingVariant || {
      size: selectedSize || (availableSizes.length === 1 ? availableSizes[0] : ""),
      color: selectedColor || availableColors[0] || "",
    };
  }, [availableColors, availableSizes, product, selectedColor, selectedSize]);
  const productImages = useMemo(() => {
    const images = (product?.images || [])
      .map((image) => (typeof image === "string" ? { url: image } : image))
      .filter((image) => image?.url);

    if (!images.length && product?.image) {
      images.push({ url: product.image });
    }

    return images;
  }, [product]);
  const user = useAuthStore((state) => state.user);
  const toggleCartItem = useCartStore((state) => state.toggleItem);
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const inWishlist = useWishlistStore((state) => state.items.some((item) => item._id === product?._id));
  const inCart = useCartStore((state) =>
    product?._id && selectedVariant?.size ? state.hasItem(product._id, selectedVariant) : false
  );

  function redirectToLogin(message) {
    toast(message);
    navigate("/login");
  }

  function requireSizeSelection() {
    if (availableSizes.length > 1 && !selectedSize) {
      toast("Please select a size first.");
      return false;
    }

    return true;
  }

  function handleCartToggle() {
    if (!user) {
      redirectToLogin("Please login to add products to your cart.");
      return;
    }

    if (isOutOfStock) {
      toast.error("This product is currently out of stock.");
      return;
    }

    if (!requireSizeSelection()) {
      return;
    }

    const wasAdded = toggleCartItem(product, quantity, selectedVariant);
    toast.success(wasAdded ? "Added to cart" : "Removed from cart");
  }

  function handleBuyNow() {
    if (!user) {
      redirectToLogin("Please login before continuing to checkout.");
      return;
    }

    if (isOutOfStock) {
      toast.error("This product is currently out of stock.");
      return;
    }

    if (!requireSizeSelection()) {
      return;
    }

    const buyNowItem = {
      key: `buy-now-${product._id}-${selectedVariant.size || ""}-${selectedVariant.color || ""}`,
      productId: product._id,
      name: product.name,
      image: productImages[0]?.url || "",
      price: product.salePrice || product.basePrice,
      quantity,
      size: selectedVariant.size || "",
      color: selectedVariant.color || "",
    };

    sessionStorage.setItem("va-buy-now", JSON.stringify([buyNowItem]));
    navigate("/checkout?mode=buy-now");
  }

  function handleWishlistToggle() {
    if (!user) {
      redirectToLogin("Please login to save products to your wishlist.");
      return;
    }

    toggleWishlist(product);
    toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
  }

  async function handleShare() {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} on Vastraleena`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      if (navigator.clipboard?.writeText && shareUrl) {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Product link copied");
        return;
      }

      throw new Error("Sharing is not supported");
    } catch (error) {
      if (error?.name === "AbortError") {
        return;
      }

      toast.error("Unable to share this product right now.");
    }
  }

  function showPreviousImage() {
    if (!productImages.length) {
      return;
    }

    setSelectedImage((current) => (current === 0 ? productImages.length - 1 : current - 1));
  }

  function showNextImage() {
    if (!productImages.length) {
      return;
    }

    setSelectedImage((current) => (current === productImages.length - 1 ? 0 : current + 1));
  }

  function handleTouchStart(event) {
    touchStartXRef.current = event.changedTouches[0]?.clientX || 0;
  }

  function handleTouchEnd(event) {
    touchEndXRef.current = event.changedTouches[0]?.clientX || 0;
    const deltaX = touchStartXRef.current - touchEndXRef.current;

    if (Math.abs(deltaX) < 40) {
      return;
    }

    if (deltaX > 0) {
      showNextImage();
      return;
    }

    showPreviousImage();
  }

  function handleModalTouchStart(event) {
    modalTouchStartXRef.current = event.changedTouches[0]?.clientX || 0;
  }

  function handleModalTouchEnd(event) {
    modalTouchEndXRef.current = event.changedTouches[0]?.clientX || 0;
    const deltaX = modalTouchStartXRef.current - modalTouchEndXRef.current;

    if (Math.abs(deltaX) < 40) {
      return;
    }

    if (deltaX > 0) {
      showNextImage();
      return;
    }

    showPreviousImage();
  }

  if (productQuery.isLoading) {
    return <div className="container-shell py-16">Loading product...</div>;
  }

  if (!product) {
    return <div className="container-shell py-16">Product not found.</div>;
  }

  return (
    <div className="container-shell product-detail-page py-12" data-reveal>
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-4" data-reveal>
          <div
            className="product-gallery-shell"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {productImages.length > 1 ? (
              <>
                <button
                  type="button"
                  className="product-gallery-nav product-gallery-nav--left"
                  onClick={showPreviousImage}
                  aria-label="Show previous image"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  className="product-gallery-nav product-gallery-nav--right"
                  onClick={showNextImage}
                  aria-label="Show next image"
                >
                  <ChevronRight size={18} />
                </button>
                <div className="product-gallery-status">
                  {selectedImage + 1} / {productImages.length}
                </div>
              </>
            ) : null}
            <div className="product-gallery-viewport">
              <button
                type="button"
                className="product-detail-image-button"
                onClick={() => setIsGalleryOpen(true)}
                aria-label="Open product image in full screen"
              >
                <span
                  className="product-detail-image-frame"
                  style={{
                    backgroundImage: `url("${productImages[selectedImage]?.url || "https://placehold.co/1000x1200/f4ede1/1f1a17?text=Product"}")`,
                  }}
                  role="img"
                  aria-label={`${product.name} image ${selectedImage + 1}`}
                />
              </button>
            </div>
          </div>
          {productImages.length > 1 ? (
            <p className="px-1 text-xs uppercase tracking-[0.2em] text-ink/45 md:hidden">
              Swipe left or right to view more images
            </p>
          ) : null}
          <div className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-6 md:overflow-visible md:pb-0">
            {productImages.map((image, index) => (
              <button
                key={`${image.url}-${index}`}
                type="button"
                className={`min-w-[4.75rem] overflow-hidden rounded-[1.25rem] border p-1 md:min-w-0 ${selectedImage === index ? "border-clay" : "border-ink/10"}`}
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={image.url}
                  alt={`${product.name} view ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                  sizes="80px"
                  className="aspect-square w-full rounded-[1rem] bg-[#f4ede1] object-contain"
                />
              </button>
            ))}
          </div>
        </div>

        <div data-reveal>
          <Link to={`/category/${product.category?.slug || "all"}`}>
            <Badge>{product.category?.name || "Collection"}</Badge>
          </Link>
          <h1 className="mt-4 font-display text-[clamp(1.9rem,4.1vw,3.9rem)] leading-[1.08]">{product.name}</h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-ink/60">
            <span className="inline-flex items-center gap-1">
              <Star size={16} className="fill-gold text-gold" />
              {product.ratings?.average?.toFixed?.(1) || "0.0"}
            </span>
            <span>({product.ratings?.count || 0} reviews)</span>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <span className="text-3xl font-semibold text-clay">
              {formatPrice(product.salePrice || product.basePrice)}
            </span>
            {product.discountPercent > 0 ? (
              <span className="text-lg text-ink/40 line-through">{formatPrice(product.basePrice)}</span>
            ) : null}
            {isOutOfStock ? (
              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-red-600">
                Out of Stock
              </span>
            ) : null}
          </div>
          <p className="mt-6 max-w-xl text-sm leading-7 text-ink/70">{product.description}</p>

          <div className="mt-8">
            <p className="text-sm font-semibold text-ink/70">Size</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {availableSizes.map((size, index) => (
                <button
                  key={`${size}-${index}`}
                  className={`rounded-full border px-4 py-2 transition ${
                    (selectedSize || (availableSizes.length === 1 ? availableSizes[0] : "")) === size
                      ? "border-clay bg-clay text-white"
                      : "border-ink/10 bg-white hover:border-clay/40"
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {product.colors?.length ? (
            <div className="mt-8">
              <p className="text-sm font-semibold text-ink/70">Color</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {product.colors.slice(0, 8).map((color, index) => (
                  <button
                    key={`${color}-${index}`}
                    className={`inline-flex rounded-full border px-4 py-2 text-sm transition ${
                      (selectedColor || availableColors[0] || "") === color
                        ? "border-ink bg-ink text-white"
                        : "border-ink/10 bg-white hover:border-ink/30"
                    }`}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-full border border-ink/10">
              <button type="button" className="px-4 py-3" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
                -
              </button>
              <span className="px-3">{quantity}</span>
              <button type="button" className="px-4 py-3" onClick={() => setQuantity((value) => value + 1)}>
                +
              </button>
            </div>
            <Button
              className={`min-w-[12rem] ${inCart ? "bg-forest hover:bg-forest/90" : ""}`}
              onClick={handleCartToggle}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? "Out of Stock" : inCart ? "Added to cart" : "Add to cart"}
            </Button>
            <Button
              variant="secondary"
              className="min-w-[12rem]"
              onClick={handleBuyNow}
              disabled={isOutOfStock}
            >
              Buy Now
            </Button>
            <Button
              variant="secondary"
              className={`min-w-[11rem] ${inWishlist ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100" : ""}`}
              onClick={handleWishlistToggle}
            >
              <Heart size={16} className={`mr-2 ${inWishlist ? "fill-red-500 text-red-500" : ""}`} />
              {inWishlist ? "Wishlisted" : "Wishlist"}
            </Button>
            <Button variant="ghost" onClick={handleShare}>
              <Share2 size={16} className="mr-2" /> Share
            </Button>
          </div>

          <div className="mt-10 grid gap-4">
            <div className="rounded-[1.5rem] bg-white/70 p-5">
              <h3 className="font-semibold">Shipping Info</h3>
              <p className="mt-2 text-sm text-ink/70">Delivery charges and address confirmation are shown directly during checkout.</p>
            </div>
            <div className="rounded-[1.5rem] bg-white/70 p-5">
              <h3 className="font-semibold">Returns Policy</h3>
              <p className="mt-2 text-sm text-ink/70">Easy returns and exchange states are ready for policy copy and backend rules.</p>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-20" data-reveal>
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-clay">Related products</p>
          <h2 className="section-title mt-2">You may also like</h2>
        </div>
        <ProductGrid products={productQuery.data?.related || []} />
      </section>

      {isGalleryOpen ? (
        <div className="product-lightbox" onClick={() => setIsGalleryOpen(false)}>
          <button
            type="button"
            className="product-lightbox-close"
            onClick={() => setIsGalleryOpen(false)}
            aria-label="Close full screen gallery"
          >
            Close
          </button>
          {productImages.length > 1 ? (
            <>
              <button
                type="button"
                className="product-gallery-nav product-gallery-nav--left"
                onClick={(event) => {
                  event.stopPropagation();
                  showPreviousImage();
                }}
                aria-label="Show previous image"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                className="product-gallery-nav product-gallery-nav--right"
                onClick={(event) => {
                  event.stopPropagation();
                  showNextImage();
                }}
                aria-label="Show next image"
              >
                <ChevronRight size={18} />
              </button>
            </>
          ) : null}
          <div
            className="product-lightbox-inner"
            onClick={(event) => event.stopPropagation()}
            onTouchStart={handleModalTouchStart}
            onTouchEnd={handleModalTouchEnd}
          >
            <img
              src={productImages[selectedImage]?.url || "https://placehold.co/1000x1200/111111/ffffff?text=Product"}
              alt={`${product.name} enlarged image ${selectedImage + 1}`}
              loading="eager"
              decoding="async"
              className="product-lightbox-image"
            />
            {productImages.length > 1 ? (
              <div className="product-gallery-status">
                {selectedImage + 1} / {productImages.length}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
