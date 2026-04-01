import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../scss/_productRender.scss";

const ProductRender = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { product, related } = location.state || {};
  const [quantity, setQuantity] = useState(1);

  if (!product) return <h2>Product not found!</h2>;

  // ✅ Related products handling
  let relatedProducts = [];
  if (related) {
    if (product.category) {
      // agar category hai (jaise sunglasses, loafers)
      relatedProducts = related.filter(
        (p) => p.category === product.category && p.id !== product.id
      );
    } else {
      // agar category nahi hai (jaise trousers)
      relatedProducts = related.filter((p) => p.id !== product.id);
    }
  }

  return (
    <div className="product-detail">
      {/* Left: Image */}
      <div className="detail-left">
        <img src={product.image} alt={product.name} />
      </div>

      {/* Right: Name + Price + Quantity + Buttons */}
      <div className="detail-right">
        <h2>{product.name}</h2>

        {/* ✅ Price Section */}
        <p className="price">
          {product.price}{" "}
          {product.oldPrice && <span className="old-price">{product.oldPrice}</span>}
        </p>
        {product.discount && <p className="discount">{product.discount}</p>}

        {/* ✅ Quantity Selector */}
        <div className="quantity">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>

        {/* ✅ Action Buttons */}
        <div className="actions">
          <button className="btn-cart">🛒 Add to Cart</button>
          <button className="btn-buy">⚡ Buy Now</button>
          <button className="btn-wishlist">♡ Wishlist</button>
        </div>
      </div>

      {/* ✅ Related Products */}
      {relatedProducts.length > 0 && (
        <div className="related-section">
          <h3>Related Products</h3>
          <div className="related-grid">
            {relatedProducts.map((item) => (
              <div
                key={item.id}
                className="related-card"
                onClick={() =>
                  navigate(`/product/${item.id}`, {
                    state: { product: item, related },
                  })
                }
              >
                <img src={item.image} alt={item.name} />
                <h4>{item.name}</h4>
                <p className="price">
                  {item.price}{" "}
                  {item.oldPrice && <span className="old-price">{item.oldPrice}</span>}
                </p>
                {item.discount && <p className="discount">{item.discount}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductRender;
