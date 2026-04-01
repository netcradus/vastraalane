import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "../scss/_CategoryPage.scss";

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

const Layout = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

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
            else if (cat === "Luxury Watch") path = "/luxury-page";
            else if (cat === "Perfumes") path = "/perfume-page";
            else if (cat === "Cordset & Tracksuit") path = "/cordset-page";
            else if (cat === "Girls Sandals and jutti") path = "/sandals-page";
            else if (cat === "Sunglasses") path = "/sunglasse-page";

            return (
              <li key={index}>
                <Link
                  to={path}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    fontWeight: selectedCategory === cat ? "bold" : "normal",
                  }}
                >
                  {cat}
                </Link>
              </li>
            );
          })}

          {/* Reset */}
          <li
            onClick={() => setSelectedCategory(null)}
            style={{
              cursor: "pointer",
              fontWeight: selectedCategory === null ? "bold" : "normal",
              marginTop: "10px",
            }}
          >
            <Link to="/">All Products</Link>
          </li>
        </ul>
      </aside>

      {/* Main content (category pages will render here) */}
      <main className="products-section">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
