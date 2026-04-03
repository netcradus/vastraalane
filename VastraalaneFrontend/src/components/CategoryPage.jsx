import React, { useEffect, useMemo, useState } from "react";
import "../scss/_CategoryPage.scss";
import { Link } from "react-router-dom";
import axios from "axios";
import config from "../config";

const CategoryPage = () => {
  const apiBase = config.API_URL;
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const categoryRoutes = useMemo(
    () => ({
      "Shirts & Tshirt": "/shirts",
      Loafers: "/loafers-page",
      Shoes: "/shoes-page",
      "Luxury Watch": "/Luxury-page",
      "Jeans & Trouser & Trackpant": "/jeans-page",
      "HandBags and Bag": "/handbag-page",
      Perfumes: "/perfume-page",
      Sunglasses: "/sunglasse-page",
      "Cordset & Tracksuit": "/cordset-page",
      "Girls Sandals and jutti": "/Sandals-page",
    }),
    []
  );

  useEffect(() => {
    if (!apiBase) return;
    let cancelled = false;

    const fetchCategoryCounts = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const res = await axios.get(`${apiBase}/api/products/categories`);
        if (cancelled) return;
        setCategories((res.data?.categories || []).filter((item) => categoryRoutes[item._id]));
      } catch (error) {
        if (cancelled) return;
        setLoadError("Failed to load categories.");
        setCategories([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCategoryCounts();
    return () => {
      cancelled = true;
    };
  }, [apiBase, categoryRoutes]);

  return (
    <div className="category-page">
      <aside className="category-sidebar">
        <h3>Category</h3>
        <ul>
          {categories.map((item) => (
            <li key={item._id}>
              <Link
                to={categoryRoutes[item._id]}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {item._id} ({item.count})
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      <main className="products-section">
        <h2>Browse By Category</h2>
        {!apiBase && (
          <div style={{ padding: 12, color: "#b00020" }}>
            Missing `REACT_APP_API_URL`. Set it to your backend URL.
          </div>
        )}
        {loadError && <div style={{ padding: 12, color: "#b00020" }}>{loadError}</div>}
        {loading && <div style={{ padding: 12 }}>Loading categories...</div>}
        {!loading && !loadError && (
          <div className="products-grid">
            {categories.map((item) => (
              <Link
                key={item._id}
                to={categoryRoutes[item._id]}
                className="product-card"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="product-info">
                  <h4>{item._id}</h4>
                  <p className="current-price">{item.count} products</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CategoryPage;
