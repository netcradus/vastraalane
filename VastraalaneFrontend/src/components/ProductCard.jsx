import React from "react";
import { getPrimaryProductImage } from "../utils/productImages";

function formatPrice(value) {
  return `Rs ${Number(value || 0).toLocaleString("en-IN")}`;
}

function ProductCard({ product }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "15px",
        textAlign: "center",
        width: "200px",
        margin: "10px",
      }}
    >
      <img
        src={getPrimaryProductImage(product)}
        alt={product.name}
        style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }}
      />
      <h3>{product.name}</h3>
      <p>{formatPrice(product.price)}</p>
      <button
        style={{
          padding: "8px 12px",
          backgroundColor: "#111",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;
