import React, { useEffect, useMemo, useState } from "react";
import "../scss/_products.scss";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import CustomModal from "../Sidebar/CustomModal";
import axios from "axios";
import config from "../config";
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

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(20000);
  const [sortOrder, setSortOrder] = useState("featured");
  const [quantity, setQuantity] = useState(1);
  const [popup, setPopup] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [totalItems, setTotalItems] = useState(0);

  const { addToCart, addToWishlist, isProductInWishlist } = useCart();
  const navigate = useNavigate();

  const showPopup = (message) => {
    setPopup(message);
    setTimeout(() => setPopup(""), 2000);
  };

  const handleAddToCart = async (product) => {
    const availableSizes = normalizeSizes(product);
    const sizeToUse = availableSizes.length ? selectedSize || availableSizes[0] : null;
    const result = await addToCart({ ...product, quantity, size: sizeToUse });
    if (result === "auth_required") {
      showPopup("Please login to add products to cart.");
      setTimeout(() => navigate("/login"), 600);
      return;
    }

    if (result) {
      showPopup("Product added to Cart!");
    }
  };

  const handleAddToWishlist = async (product) => {
    const wasAdded = await addToWishlist(product);
    if (wasAdded === "auth_required") {
      showPopup("Please login to use wishlist.");
      setTimeout(() => navigate("/login"), 600);
    } else if (wasAdded === true) {
      showPopup("Product added to Wishlist!");
    } else if (wasAdded === false) {
      showPopup("Product removed from Wishlist!");
    }
  };

  const handleBuyNow = (product) => {
    if (!localStorage.getItem("token")) {
      showPopup("Please login to continue.");
      setTimeout(() => navigate("/login"), 600);
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
          size: sizeToUse,
          quantity,
        },
      },
    });
  };

  const incrementQty = () => setQuantity((prev) => prev + 1);
  const decrementQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const apiBase = config.API_URL;
  const queryParams = useMemo(
    () => ({
      page,
      limit: 48,
      search,
      minPrice,
      maxPrice,
      sort: sortOrder,
    }),
    [page, search, minPrice, maxPrice, sortOrder]
  );

  // We intentionally reset the list only when filters change, not when the user loads more pages.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setProducts([]);
    setPage(1);
  }, [search, minPrice, maxPrice, sortOrder]);

  useEffect(() => {
    if (!apiBase) return;
    let cancelled = false;

    const fetchProducts = async () => {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setLoadError("");
      try {
        const res = await axios.get(`${apiBase}/api/products`, { params: queryParams });
        if (cancelled) return;
        const returnedProducts = res.data?.products || [];
        const totalFromApi = Number(res.data?.totalItems || 0);
        setProducts((current) => {
          if (page === 1) return returnedProducts;
          const seen = new Set(current.map((product) => product._id));
          return [...current, ...returnedProducts.filter((product) => !seen.has(product._id))];
        });
        setTotalItems(totalFromApi || returnedProducts.length);
      } catch (err) {
        if (cancelled) return;
        setLoadError("Failed to load products from server");
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
  }, [apiBase, page, queryParams]);

  const relatedProducts = selectedProduct
    ? products.filter(
        (p) => p.category === selectedProduct.category && p.name !== selectedProduct.name
      )
    : [];
  const availableSizes = normalizeSizes(selectedProduct);

  useEffect(() => {
    if (!selectedProduct) {
      setSelectedSize("");
      setQuantity(1);
      return;
    }

    const availableSizes = normalizeSizes(selectedProduct);
    setSelectedSize(availableSizes[0] || "");
    setQuantity(1);
  }, [selectedProduct]);

  useEffect(() => {
    if (!selectedProduct) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedProduct]);

  if (selectedProduct) {
    return (
      <div className="products-page">
        {popup && <div className="popup">{popup}</div>}

        <div className="product-detail-expanded">
          <div className="product-detail-left">
            <ProductGallery product={selectedProduct} />

            <div className="product-actions-side">
              <div className="quantity-selector">
                <label>Quantity:</label>
                <div className="quantity-box">
                  <button onClick={decrementQty}>-</button>
                  <input type="number" value={quantity} readOnly />
                  <button onClick={incrementQty}>+</button>
                </div>
              </div>

              {availableSizes.length > 0 && (
                <div className="size-selector">
                  <label htmlFor="product-size">Size:</label>
                  <select
                    id="product-size"
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
                  {isProductInWishlist(selectedProduct) ? "Remove from Wishlist" : "Wishlist"}
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
            <div className="size-summary">
              <strong>Available Sizes:</strong>{" "}
              {availableSizes.length > 0 ? availableSizes.join(", ") : "Not available"}
            </div>
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
  }

  return (
    <div className="products-page">
      {popup && <div className="popup">{popup}</div>}
      <h2>Your Online Style Hub</h2>

      <div className="products-filters">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <div className="price-box">
          <label>PRICE</label>
          <div className="price-range">
            <span>{formatPrice(minPrice)}</span>
            <input
              type="range"
              min={0}
              max={20000}
              value={minPrice}
              onChange={(e) => {
                setMinPrice(Number(e.target.value));
              }}
            />
            <input
              type="range"
              min={0}
              max={20000}
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
              }}
            />
            <span>{formatPrice(maxPrice)}</span>
          </div>
        </div>
        <select
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
          }}
        >
          <option value="featured">Featured</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
        </select>
      </div>

      {!apiBase && (
        <div style={{ padding: 12, color: "#b00020" }}>
          Missing `REACT_APP_API_URL` (frontend env). Set it to your backend URL.
        </div>
      )}

      {loadError && <div style={{ padding: 12, color: "#b00020" }}>{loadError}</div>}
      {!loading && !loadError && (
        <div style={{ padding: "0 0 12px" }}>Showing {products.length} of {totalItems} products</div>
      )}

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

      <CustomModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmPurchase}
        product={selectedProduct}
      />
    </div>
  );
};

export default Products;
