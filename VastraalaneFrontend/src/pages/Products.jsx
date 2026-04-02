import React, { useEffect, useMemo, useState } from "react";
import "../scss/_products.scss";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import CustomModal from "../Sidebar/CustomModal";
import axios from "axios";
import config from "../config";

const DEFAULT_LIMIT = 24;

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(20000);
  const [sortOrder, setSortOrder] = useState("featured");
  const [quantity, setQuantity] = useState(1);
  const [popup, setPopup] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const { addToCart, wishlist, setWishlist } = useCart();
  const navigate = useNavigate();

  const showPopup = (message) => {
    setPopup(message);
    setTimeout(() => setPopup(""), 2000);
  };

  const handleAddToCart = (product) => {
    addToCart({ ...product, quantity });
    showPopup("Product added to Cart!");
  };

  const handleAddToWishlist = (product) => {
    setWishlist([...wishlist, product]);
    showPopup("Product added to Wishlist!");
  };

  // ✅ Open confirmation modal
  const handleBuyNow = (product) => {
    setSelectedProduct(product);
    setShowConfirm(true);
  };

  // ✅ Confirm navigation
  const confirmPurchase = () => {
    setShowConfirm(false);
    navigate("/customer-details", { state: { product: selectedProduct } });
  };

  const incrementQty = () => setQuantity((prev) => prev + 1);
  const decrementQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const apiBase = config.API_URL;
  const limit = DEFAULT_LIMIT;

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      search,
      minPrice,
      maxPrice,
      sort: sortOrder,
    }),
    [page, limit, search, minPrice, maxPrice, sortOrder]
  );

  useEffect(() => {
    if (!apiBase) return;
    let cancelled = false;

    const fetchProducts = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const res = await axios.get(`${apiBase}/api/products`, { params: queryParams });
        if (cancelled) return;
        setProducts(res.data?.products || []);
        setTotalPages(res.data?.totalPages || 1);
      } catch (err) {
        if (cancelled) return;
        setLoadError("Failed to load products from server");
        setProducts([]);
        setTotalPages(1);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, [apiBase, queryParams]);

  const relatedProducts = selectedProduct
    ? products.filter(
        (p) =>
          p.category === selectedProduct.category &&
          p.name !== selectedProduct.name
      )
    : [];

  // ✅ Product Detail Page
  if (selectedProduct) {
    return (
      <div className="products-page">
        {popup && <div className="popup">{popup}</div>}

        <div className="product-detail-expanded">
          {/* Left: Image + Actions */}
          <div className="product-detail-left">
            <img
              src={selectedProduct.image || (selectedProduct.images && selectedProduct.images[0])}
              alt={selectedProduct.name}
              className="product-image-large"
            />

            <div className="product-actions-side">
              {/* Quantity */}
              <div className="quantity-selector">
                <label>Quantity:</label>
                <div className="quantity-box">
                  <button onClick={decrementQty}>-</button>
                  <input type="number" value={quantity} readOnly />
                  <button onClick={incrementQty}>+</button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="product-actions">
                <button
                  className="btn-wishlist"
                  onClick={() => handleAddToWishlist(selectedProduct)}
                >
                  ♡ Wishlist
                </button>
                <button
                  className="btn-add-cart"
                  onClick={() => handleAddToCart(selectedProduct)}
                >
                  Add to Cart
                </button>
                <button
                  className="btn-buy-now"
                  onClick={() => handleBuyNow(selectedProduct)}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="product-detail-right">
            <h2>{selectedProduct.name}</h2>
            <p className="product-price">₹{selectedProduct.price}</p>
            {selectedProduct.description && <p>{selectedProduct.description}</p>}

            <ul className="product-points">
              <li>✔ 7 Days Easy Return</li>
              <li>✔ Free Shipping on orders above ₹2000</li>
              <li>✔ 100% Authentic Products</li>
              <li>✔ Cash on Delivery Available</li>
              <li>✔ Warranty Included (if applicable)</li>
            </ul>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="related-products">
            <h3>Related Products</h3>
            <div className="related-grid">
              {relatedProducts.map((product, index) => (
                <div
                  key={index}
                  className="related-card"
                  onClick={() => setSelectedProduct(product)}
                >
                  <img
                    src={product.image || (product.images && product.images[0])}
                    alt={product.name}
                    className="related-image"
                  />
                  <h4>{product.name}</h4>
                  <p>₹{product.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        <CustomModal
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={confirmPurchase}
          product={selectedProduct}
        />
      </div>
    );
  }

  // ✅ Product Grid Page
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
            setPage(1);
          }}
        />
        <div className="price-box">
          <label>PRICE</label>
          <div className="price-range">
            <span>₹{minPrice.toFixed(2)}</span>
            <input
              type="range"
              min={0}
              max={20000}
              value={minPrice}
              onChange={(e) => {
                setMinPrice(Number(e.target.value));
                setPage(1);
              }}
            />
            <input
              type="range"
              min={0}
              max={20000}
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
                setPage(1);
              }}
            />
            <span>₹{maxPrice.toFixed(2)}</span>
          </div>
        </div>
        <select
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            setPage(1);
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

      <div className="product-grid">
        {loading && <div style={{ padding: 12 }}>Loading…</div>}
        {!loading &&
          products.map((product) => (
            <div
              key={product._id}
              className="product-card"
              onClick={() => setSelectedProduct(product)}
            >
              <img
                src={product.image || (product.images && product.images[0])}
                alt={product.name}
                className="product-image"
              />
              <h3>{product.name}</h3>
              <p>₹{product.price}</p>
            </div>
          ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 12, padding: "16px 0" }}>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1 || loading}
          style={{ padding: "8px 12px" }}
        >
          Prev
        </button>
        <div style={{ alignSelf: "center" }}>
          Page {page} / {totalPages}
        </div>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages || loading}
          style={{ padding: "8px 12px" }}
        >
          Next
        </button>
      </div>

      {/* Confirmation Modal */}
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
