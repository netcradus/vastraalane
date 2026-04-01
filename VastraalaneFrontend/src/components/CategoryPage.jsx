import React, { useState } from "react";
import "../scss/_CategoryPage.scss";
import { Link } from "react-router-dom";

// 🔽 Product images
import ShoesImg from "../assets/Adidass Fear Of God Athletic 1 Indiana.png";
import SandalImg from "../assets/Alexander_Mcqueen_Alex_Leather_For_Women_With_OG_Box_&_Carry_Bag_Black_1892 - Copy (3).png";
import PerfumeImg from "../assets/AZZARO WANTED TONIC EDT - Copy (3).png";
import TshirtImg from "../assets/Balmai n Paris Logo Imported Black Collar Neck Premium T-shirt F2831-BL - Copy (2).png";
import crocImg from "../assets/Croc s literide Black White - Copy.png";
import HandbagImg from "../assets/Bags.jpg";
import Sunglasses from "../assets/_David_becham_70066.png";

// 🔽 Categories
const categories = [
  "Shirts & Tshirt",
  "Loafers",
  "Shoes",
  "Luxury Watch",
  "Jeans & Trouser & Trackpant",
  "HandBags and Bag",
  "Perfumes",
  "Sunglasses",
  "Cordset & Tracksuit",
  "Girls Sandals and jutti"
];

// 🔽 Products
const products = [
  {
    id: 1,
    name: "Premium T-Shirt – Classic Edition",
    category: "Shirts & Tshirt",
    oldPrice: 8000,
    currentPrice: 1999,
    image: TshirtImg
  },
  {
    id: 2,
    name: "Signature Perfume – Tonic Edition",
    category: "Perfumes",
    oldPrice: 4217,
    currentPrice: 1500,
    image: PerfumeImg
  },
  {
    id: 3,
    name: "Luxury Heels & Sandals",
    category: "Shoes",
    oldPrice: 1830,
    currentPrice: 1117,
    image: SandalImg
  },
  {
    id: 4,
    name: "Premium Sneakers – Retro Edition",
    category: "Shoes",
    oldPrice: 3999,
    currentPrice: 2179,
    image: ShoesImg
  },
  {
    id: 5,
    name: "Premium Sling Bag – Model 201",
    category: "HandBags and Bag",
    oldPrice: 4000,
    currentPrice: 1340,
    image: crocImg
  },
  {
    id: 6,
    name: "Premium Sling Bag – Classic Edition",
    category: "HandBags and Bag",
    oldPrice: 7830,
    currentPrice: 1217,
    image: HandbagImg
  },
  {
    id: 7,
    name: "Premium Sunglasses – Classic Edition",
    category: "Sunglasses",
    oldPrice: 1200,
    currentPrice: 1017,
    image: Sunglasses
  }
];
const CategoryPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const handleProductClick = (prod) => setSelectedProduct(prod);
  const handleBack = () => setSelectedProduct(null);

  const relatedProducts = selectedProduct
    ? products.filter((p) => p.id !== selectedProduct.id)
    : [];

  const displayedProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  return (
    <div className="category-page">
      {/* Sidebar */}
      <aside className="category-sidebar">
        <h3>Category</h3>
        <ul>
          {categories.map((cat, index) => {
            let path = "";
            if (cat === "Shirts & Tshirt") path = "/shirts";
            else if (cat === "Loafers") path = "/loafers-page";
            else if (cat === "Shoes") path = "/shoes-page";
            else if (cat === "Jeans & Trouser & Trackpant") path = "/jeans-page";
            else if (cat === "HandBags and Bag") path = "/handbag-page";
            else if (cat === "Luxury Watch") path = "/Luxury-page";
            else if (cat === "Perfumes") path = "/Perfume-page";
            else if (cat === "Cordset & Tracksuit") path = "/Cordset-page";
            else if (cat === "Girls Sandals and jutti") path = "/Sandals-page";
            else if (cat === "Sunglasses") path = "/Sunglasse-page";

            return path ? (
              <li key={index}>
                <Link
                  to={path}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    fontWeight: selectedCategory === cat ? "bold" : "normal",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Link>
              </li>
            ) : (
              <li
                key={index}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  cursor: "pointer",
                  fontWeight: selectedCategory === cat ? "bold" : "normal",
                }}
              >
                {cat}
              </li>
            );
          })}

          {/* Reset category */}
          <li
            onClick={() => setSelectedCategory(null)}
            style={{
              cursor: "pointer",
              fontWeight: selectedCategory === null ? "bold" : "normal",
              marginTop: "10px",
            }}
          >
            All Products
          </li>
        </ul>
      </aside>

      {/* Products Section */}
      <main className="products-section">
        {!selectedProduct ? (
          <>
            {/* Products Grid */}
            <div className="products-grid">
              {displayedProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="product-card"
                  onClick={() => handleProductClick(prod)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="product-image">
                    <img src={prod.image} alt={prod.name} />
                  </div>
                  <div className="product-info">
                    <h4>{prod.name}</h4>
                    <p className="old-price">₹{prod.oldPrice}</p>
                    <p className="current-price">₹{prod.currentPrice}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Info Boxes */}
            <div className="info-container">
              <div className="info-item">
                <h4>Latest Styles</h4>
                <p>
                  Our designs follow the latest fashion styles to help you stay
                  updated with new trends.
                </p>
                <button>Read More</button>
              </div>
              <div className="info-item">
                <h4>Best Prices</h4>
                <p>We ensure premium quality at the most affordable rates.</p>
                <button>Read More</button>
              </div>
              <div className="info-item">
                <h4>Free Shipping</h4>
                <p>
                  Enjoy free delivery on all products, hassle-free shopping
                  guaranteed.
                </p>
                <button>Read More</button>
              </div>
            </div>

            {/* Extra Info Section */}
            {/* <div className="policy-info">
              <h3>Need Help?</h3>
              <p>
                For any queries, reach us at{" "}
                <a href="mailto:info@vastraalane.com">info@vastraalane.com</a>{" "}
                or call <strong>+91-9910678434</strong>.
              </p>

              <div className="policy-points">
                <p>✔ Returns accepted within 7 days (unused with tags).</p>
                <p>✔ Customized or sale items are non-returnable.</p>
                <p>✔ Refunds processed within 7–10 business days.</p>
                <p>✔ Monday – Saturday: 10:00 AM – 8:00 PM | Sunday: Closed</p>
              </div>
            </div> */}
          </>
        ) : (
          // Product Details
          <div className="product-details-page">
            <button className="back-btn" onClick={handleBack}>
              &larr; Back
            </button>
            <div className="main-product">
              <img src={selectedProduct.image} alt={selectedProduct.name} />
              <h2>{selectedProduct.name}</h2>
              <p className="old-price">₹{selectedProduct.oldPrice}</p>
              <p className="current-price">₹{selectedProduct.currentPrice}</p>

              {/* Action Buttons */}
              <div className="product-action-buttons">
                <button className="buy-btn">Buy Now</button>
                <button className="cart-btn">Add to Cart</button>
                <button className="wishlist-btn">Wishlist</button>
              </div>
            </div>

            {relatedProducts.length > 0 && (
              <>
                <h3>Related Products</h3>
                <div className="related-products-grid">
                  {relatedProducts.map((p) => (
                    <div
                      key={p.id}
                      className="related-product-card"
                      onClick={() => handleProductClick(p)}
                      style={{ cursor: "pointer" }}
                    >
                      <img src={p.image} alt={p.name} />
                      <h4>{p.name}</h4>
                      <p className="current-price">₹{p.currentPrice}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default CategoryPage;