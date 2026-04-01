import React from "react";
import { useNavigate } from "react-router-dom";
import  products  from "./ProductDetail";

const ProductList = () => {
  const navigate = useNavigate();

  return (
    <div className="product-section">
      <h2>Your City's Best Deals Hand picked for you</h2>
      <div className="product-grid">
        {products.map((product, index) => (
          <div
            key={index}
            className="product-card"
            onClick={() => navigate(`/product/${index}`)} // navigate to product detail page
          >
            <img src={product.image} alt={product.name} className="product-image" />
            <h3 className="product-name">{product.name}</h3>
            <p className="product-category">{product.category}</p>
            <p className="product-price">₹{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
