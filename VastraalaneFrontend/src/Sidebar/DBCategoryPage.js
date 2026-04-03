import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CustomModal from "./CustomModal";
import config from "../config";
import { fetchAllProducts } from "../utils/productApi";
import "../scss/_products.scss";

function formatPrice(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

const DBCategoryPage = ({ category, title }) => {
  const navigate = useNavigate();
  const { addToCart, addToWishlist, wishlist } = useCart();

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  const apiBase = config.API_URL;

  const queryParams = useMemo(
    () => ({
      all: true,
      category,
      sort: "featured",
    }),
    [category]
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
        const returnedProducts = res.data?.products || [];
        const returnedCount = returnedProducts.length;
        const totalFromApi = Number(res.data?.totalItems || 0);
        const totalPages = Number(res.data?.totalPages || 1);

        if (totalPages > 1 || (totalFromApi > returnedCount && returnedCount <= 100)) {
          const allData = await fetchAllProducts(apiBase, queryParams);
          if (cancelled) return;
          setProducts(allData.products);
          setTotalItems(allData.totalItems);
        } else {
          setProducts(returnedProducts);
          setTotalItems(totalFromApi || returnedCount);
        }
      } catch (error) {
        if (cancelled) return;
        setLoadError("Failed to load products for this category.");
        setProducts([]);
        setTotalItems(0);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [apiBase, queryParams]);

  useEffect(() => {
    setSelectedProduct(null);
  }, [category]);

  const relatedProducts = selectedProduct
    ? products.filter((product) => product._id !== selectedProduct._id).slice(0, 8)
    : [];

  const handleAddToCart = async (product) => {
    await addToCart(product);
  };

  const handleBuyNow = (product) => {
    setSelectedProduct(product);
    setShowConfirm(true);
  };

  const confirmPurchase = () => {
    setShowConfirm(false);
    navigate("/customer-details", {
      state: {
        product: {
          ...selectedProduct,
          price: Number(selectedProduct?.price || 0),
          quantity: 1,
        },
      },
    });
  };

  if (!selectedProduct) {
    return (
      <div className="products-page">
        <h2>{title}</h2>
        {!loading && !loadError && (
          <div style={{ padding: "0 0 12px" }}>Showing {totalItems} products</div>
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
                  src={product.image || (product.images && product.images[0])}
                  alt={product.name}
                  className="product-image"
                />
                <h3>{product.name}</h3>
                <p>{formatPrice(product.price)}</p>
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="product-detail-expanded">
        <div className="product-detail-left">
          <img
            src={selectedProduct.image || (selectedProduct.images && selectedProduct.images[0])}
            alt={selectedProduct.name}
            className="product-image-large"
          />

          <div className="product-actions-side">
            <div className="product-actions">
              <button className="btn-wishlist" onClick={() => addToWishlist(selectedProduct)}>
                {wishlist.some((item) => item._id === selectedProduct._id || item.productId === selectedProduct._id)
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
          <h2>{selectedProduct.name}</h2>
          <p className="product-price">{formatPrice(selectedProduct.price)}</p>
          {selectedProduct.description && <p>{selectedProduct.description}</p>}

          <ul className="product-points">
            <li>✔ 7 Days Easy Return</li>
            <li>✔ Free Shipping on orders above ₹2000</li>
            <li>✔ 100% Authentic Products</li>
            <li>✔ Cash on Delivery Available</li>
            <li>✔ Warranty Included if applicable</li>
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
                  src={product.image || (product.images && product.images[0])}
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
};

export default DBCategoryPage;
