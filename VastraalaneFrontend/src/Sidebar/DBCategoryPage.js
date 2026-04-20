import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CustomModal from "./CustomModal";
import config from "../config";
import "../scss/_products.scss";
import ProductGallery from "../components/ProductGallery";
import { getPrimaryProductImage } from "../utils/productImages";

function formatPrice(value) {
  return `Rs ${Number(value || 0).toLocaleString("en-IN")}`;
}

function normalizeSizes(product) {
  return Array.from(
    new Set(
      (Array.isArray(product?.sizes) ? product.sizes : [])
        .map((size) => String(size || "").trim())
        .filter(Boolean)
    )
  );
}

function passesCategoryGuard(product, categoryId) {
  const text = [product?.name, product?.slug, product?.productUrl]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (!text) return true;

  if (categoryId === "luxury") {
    const hasWatch =
      /\b(watch|rolex|omega|hublot|tissot|patek|audemars|chronograph|moonwatch|daytona|nautilus|speedmaster|seamaster|datejust|oyster|quartz)\b/i.test(
        text
      );
    const hasNonWatch =
      /\b(sunglass|sunglasses|aviator|frames?|shoe|shoes|sneaker|sneakers|loafer|sandals?|slides?|slipper|crocs|jutti|mules?|perfume|parfum|fragrance|edp|edt|cologne|gift set|eau de|pour homme|pour femme|sandalwood|acqua[\s-]*di[\s-]*gio|because[\s-]*its[\s-]*you|in[\s-]*love[\s-]*with[\s-]*you|stronger[\s-]*with[\s-]*you|si[\s-]*passione|code[\s-]*black[\s-]*eau|hoodie|t-?shirt|shirt|handbag|sling bag|shoulder bag|wallet)\b|adid[\W_]*as|nik[\W_]*e|pum[\W_]*a/i.test(
        text
      );
    return hasWatch && !hasNonWatch;
  }

  return true;
}

const CATEGORY_TO_ID = {
  "Shirts & Tshirt": "shirts",
  Loafers: "loafers",
  Shoes: "shoes",
  "Luxury Watch": "luxury",
  "Jeans & Trouser & Trackpant": "jeans",
  "HandBags and Bag": "handbags",
  Perfumes: "perfumes",
  Sunglasses: "sunglasses",
  "Cordset & Tracksuit": "cordset",
  "Girls Sandals and jutti": "sandals",
};

const DBCategoryPage = ({ category, title }) => {
  const navigate = useNavigate();
  const { addToCart, addToWishlist, wishlist, isProductInWishlist } = useCart();

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [totalItems, setTotalItems] = useState(0);

  const apiBase = config.API_URL;
  const categoryId = useMemo(() => CATEGORY_TO_ID[category] || "", [category]);

  useEffect(() => {
    setProducts([]);
    setPage(1);
  }, [categoryId]);

  useEffect(() => {
    if (!apiBase || !categoryId) return;
    let cancelled = false;

    const fetchProducts = async () => {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setLoadError("");

      try {
        const res = await axios.get(`${apiBase}/api/products/category/${categoryId}`, {
          params: {
            page,
            limit: 24,
            sort: "featured",
            compact: true,
          },
        });
        if (cancelled) return;

        const returnedProducts = (res.data?.products || []).filter((product) =>
          passesCategoryGuard(product, categoryId)
        );
        const totalFromApi = Number(res.data?.totalItems || 0);
        setProducts((current) => {
          if (page === 1) return returnedProducts;
          const seen = new Set(current.map((product) => product._id));
          return [...current, ...returnedProducts.filter((product) => !seen.has(product._id))];
        });
        setTotalItems(totalFromApi || returnedProducts.length);
      } catch (error) {
        if (cancelled) return;
        setLoadError("Failed to load products for this category.");
      } finally {
        if (!cancelled) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [apiBase, categoryId, page]);

  useEffect(() => {
    setSelectedProduct(null);
  }, [category]);

  useEffect(() => {
    const availableSizes = normalizeSizes(selectedProduct);
    setSelectedSize(availableSizes[0] || "");
  }, [selectedProduct]);

  useEffect(() => {
    if (!selectedProduct) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedProduct]);

  const relatedProducts = selectedProduct
    ? products.filter((product) => product._id !== selectedProduct._id).slice(0, 8)
    : [];
  const availableSizes = normalizeSizes(selectedProduct);
  const safeWishlist = Array.isArray(wishlist) ? wishlist : [];

  const handleAddToCart = async (product) => {
    const availableSizes = normalizeSizes(product);
    const sizeToUse = availableSizes.length ? selectedSize || availableSizes[0] : null;
    const result = await addToCart({ ...product, size: sizeToUse });
    if (result === "auth_required") {
      window.alert("Please login to add products to cart.");
      navigate("/login");
    }
  };

  const handleAddToWishlist = async (product) => {
    const result = await addToWishlist(product);
    if (result === "auth_required") {
      window.alert("Please login to use wishlist.");
      navigate("/login");
    }
  };

  const handleBuyNow = (product) => {
    if (!localStorage.getItem("token")) {
      window.alert("Please login to continue.");
      navigate("/login");
      return;
    }

    setSelectedProduct(product);
    setShowConfirm(true);
  };

  const confirmPurchase = () => {
    const availableSizes = normalizeSizes(selectedProduct);
    const sizeToUse = availableSizes.length ? selectedSize || availableSizes[0] : null;
    setShowConfirm(false);
    navigate("/customer-details", {
      state: {
        product: {
          ...selectedProduct,
          price: Number(selectedProduct?.price || 0),
          size: sizeToUse,
          quantity: 1,
        },
      },
    });
  };

  if (!selectedProduct) {
    return (
      <div className="products-page category-products-page">
        <h2>{title}</h2>
        {!loading && !loadError && (
          <div style={{ padding: "0 0 12px" }}>
            Showing {products.length} of {totalItems} products
          </div>
        )}

        {!apiBase && (
          <div style={{ padding: 12, color: "#b00020" }}>
            Missing `REACT_APP_API_URL`. Set it to your backend URL.
          </div>
        )}

        {loadError && <div style={{ padding: 12, color: "#b00020" }}>{loadError}</div>}

        <div className="product-grid">
          {loading && <div style={{ padding: 12 }}>Loading...</div>}
          {!loading &&
            products.map((product) => (
              <div
                key={product._id}
                className="product-card"
                onClick={() => setSelectedProduct(product)}
              >
                <img
                  src={getPrimaryProductImage(product)}
                  alt={product.name}
                  className="product-image"
                  loading="lazy"
                  decoding="async"
                />
                <span
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#6f5a2a",
                    marginBottom: "0.35rem",
                  }}
                >
                  {product.brandName || product.brand_name || "Premium"}
                </span>
                <h3>{product.name}</h3>
                <p>{formatPrice(product.price)}</p>
              </div>
            ))}
        </div>
        {!loading && !loadError && products.length < totalItems && (
          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <button
              type="button"
              onClick={() => setPage((current) => current + 1)}
              disabled={loadingMore}
              style={{
                padding: "0.8rem 1.6rem",
                borderRadius: "8px",
                border: "none",
                background: "#111",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              {loadingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="products-page category-products-page">
      <div className="product-detail-expanded">
        <div className="product-detail-left">
          <ProductGallery product={selectedProduct} />

          <div className="product-actions-side">
            {availableSizes.length > 0 && (
              <div className="size-selector">
                <label htmlFor="category-product-size">Size:</label>
                <select
                  id="category-product-size"
                  value={selectedSize}
                  onChange={(event) => setSelectedSize(event.target.value)}
                >
                  {availableSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="product-actions">
              <button className="btn-wishlist" onClick={() => handleAddToWishlist(selectedProduct)}>
                {(typeof isProductInWishlist === "function"
                  ? isProductInWishlist(selectedProduct)
                  : safeWishlist.some(
                      (item) =>
                        item?._id === selectedProduct?._id ||
                        item?.productId === selectedProduct?._id
                    ))
                  ? "In Wishlist"
                  : "Wishlist"}
              </button>
              <button className="btn-add-cart" onClick={() => handleAddToCart(selectedProduct)}>
                Add to Cart
              </button>
              <button className="btn-buy-now" onClick={() => handleBuyNow(selectedProduct)}>
                Buy Now
              </button>
            </div>
          </div>
        </div>

        <div className="product-detail-right">
          <p
            style={{
              marginBottom: "0.5rem",
              fontSize: "0.9rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#6f5a2a",
            }}
          >
            {selectedProduct.brandName || selectedProduct.brand_name || "Premium"}
          </p>
          <h2>{selectedProduct.name}</h2>
          <p className="product-price">{formatPrice(selectedProduct.price)}</p>
          {availableSizes.length > 0 && (
            <div className="size-summary">
              <strong>Available Sizes:</strong>{" "}
              {availableSizes.join(", ")}
            </div>
          )}
          {selectedProduct.description && <p>{selectedProduct.description}</p>}

          <ul className="product-points">
            <li>7 Days Easy Return</li>
            <li>Free Shipping on orders above Rs 2000</li>
            <li>100% Authentic Products</li>
            <li>Cash on Delivery Available</li>
            <li>Warranty Included if applicable</li>
          </ul>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="related-products">
          <h3>Related Products</h3>
          <div className="related-grid">
            {relatedProducts.map((product) => (
              <div
                key={product._id}
                className="related-card"
                onClick={() => setSelectedProduct(product)}
              >
                <img
                  src={getPrimaryProductImage(product)}
                  alt={product.name}
                  className="related-image"
                  loading="lazy"
                  decoding="async"
                />
                <h4>{product.name}</h4>
                <p>{formatPrice(product.price)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <CustomModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmPurchase}
        product={selectedProduct}
      />
    </div>
  );
};

export default DBCategoryPage;


