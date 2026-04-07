import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import ProductSlider from "../components/ProductSlider";
import VideoSection from "../components/VideoSection";
import config from "../config";
import { fetchProductsPage } from "../utils/productApi";
import { getPrimaryProductImage } from "../utils/productImages";

import "../scss/_home.scss";
import "../scss/_navbar.scss";
import "../scss/_banner.scss";
import "../scss/_productSlider.scss";
import "../scss/_footer.scss";

function formatPrice(value) {
  return `Rs ${Number(value || 0).toLocaleString("en-IN")}`;
}

function Home() {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const handleShopNow = () => {
    navigate("/new-arrivals");
  };

  useEffect(() => {
    if (!config.API_URL) return undefined;

    let cancelled = false;

    const loadFeaturedProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const data = await fetchProductsPage(config.API_URL, {
          page: 1,
          limit: 84,
          sort: "featured",
        });

        if (!cancelled) {
          setFeaturedProducts(Array.isArray(data?.products) ? data.products : []);
        }
      } catch (error) {
        if (!cancelled) {
          setFeaturedProducts([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingProducts(false);
        }
      }
    };

    loadFeaturedProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="home-container">
      <Navbar />
      <Banner onShopNow={handleShopNow} />
      <ProductSlider />
      <VideoSection />

      <section className="home-products-section">
        <div className="home-products-section__header">
          <div>
            <h2>Popular Picks</h2>
            <p>Fresh mixed products from the database.</p>
          </div>
          <button type="button" onClick={() => navigate("/products")}>
            View All Products
          </button>
        </div>

        {isLoadingProducts ? (
          <div className="home-products-section__loading">Loading products...</div>
        ) : (
          <div className="home-products-grid">
            {featuredProducts.map((product) => (
              <div
                key={product._id}
                className="home-product-card"
                onClick={() => navigate("/products")}
              >
                <img src={getPrimaryProductImage(product)} alt={product.name} loading="lazy" />
                <span className="home-product-card__brand">
                  {product.brandName || product.brand_name || "Premium"}
                </span>
                <h3>{product.name}</h3>
                <p>{formatPrice(product.price)}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
