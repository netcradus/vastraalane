import React, { useState } from "react";
import "../scss/_loafers.scss";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CustomModal from "../Sidebar/CustomModal";
import ProductGallery from "../components/ProductGallery";

// ✅ Imports (images)
import Loafers1 from "../assets/Loro piana loaferrs.png";
import Loafers2 from "../assets/Loro piana loafers - Copy.png";
import Loafers3 from "../assets/Loro Piana Loafers 19051 Brown - Copy.jpg";
import Loafers4 from "../assets/Loro piana loafers.jpg";
import Loafers5 from "../assets/Loro piana loafers.png";
import Loafers6 from "../assets/Loro piana loafers1.png";
import Loafers7 from "../assets/Loro piana loafers2.png";
import Loafers8 from "../assets/Loro piana loafers3.png";
import Loafers9 from "../assets/Loro piana loafers4.jpg";
import Loafers10 from "../assets/Loro piana loaferss.jpg";
import Loafers11 from "../assets/Loro piana loafersss.jpg";
import Loafers12 from "../assets/Loro Piana_loafers.jpg";
import Loafers13 from "../assets/Loro Piano Loafers 19051 Beige - Copy.png";
import Loafers14 from "../assets/Loro Piano Loafers 19051 Blue - Copy.png";
import Loafers15 from "../assets/Loro Piano Loafers 19051 Green.png";
import Loafers16 from "../assets/Loro Piano Loafers 19051 Greyy - Copy.png";
import Loafers17 from "../assets/Loro Piano Loafers 19051 Greyy.png";
import Loafers18 from "../assets/Loro Piano Loafers 19051 Navy - Copy.png";
import Loafers19 from "../assets/LoroO piana loafers.png";

// ✅ Products array
const loafers = [
  { id: 1, name: "Premium Loafers – Classic Tan", price: "2799", image: Loafers1 },
  { id: 2, name: "Luxury Loafers – Soft Finish", price: "2500", image: Loafers2 },
  { id: 3, name: "Elite Loafers – Brown Edition", price: "3000", image: Loafers3 },
  { id: 4, name: "Classic Loafers – Everyday Comfort", price: "1500", image: Loafers4 },
  { id: 5, name: "Premium Loafers – Smooth Leather", price: "2000", image: Loafers5 },
  { id: 6, name: "Luxury Loafers – Elegant Finish", price: "3000", image: Loafers6 },
  { id: 7, name: "Elite Loafers – Signature Style", price: "2789", image: Loafers7 },
  { id: 8, name: "Classic Loafers – Minimal Look", price: "1299", image: Loafers8 },
  { id: 9, name: "Premium Loafers – Modern Fit", price: "2000", image: Loafers9 },
  { id: 10, name: "Luxury Loafers – Comfort Plus", price: "2000", image: Loafers10 },
  { id: 11, name: "Elite Loafers – Premium Finish", price: "3500", image: Loafers11 },
  { id: 12, name: "Classic Loafers – Daily Wear", price: "1000", image: Loafers12 },
  { id: 13, name: "Premium Loafers – Beige Edition", price: "3000", image: Loafers13 },
  { id: 14, name: "Luxury Loafers – Blue Edition", price: "2500", image: Loafers14 },
  { id: 15, name: "Elite Loafers – Green Edition", price: "2000", image: Loafers15 },
  { id: 16, name: "Classic Loafers – Grey Comfort", price: "1500", image: Loafers16 },
  { id: 17, name: "Premium Loafers – Grey Edition", price: "1500", image: Loafers17 },
  { id: 18, name: "Luxury Loafers – Navy Edition", price: "2500", image: Loafers18 },
  { id: 19, name: "Elite Loafers – Timeless Style", price: "2000", image: Loafers19 },
];
const priceIncrement = Number(process.env.REACT_APP_PRODUCT_PRICE);
const loafersList = loafers.map((loafer) => {
  const numericPrice = Number(loafer.price.replace(/[₹,]/g, ""));
  const updatedPrice = numericPrice + priceIncrement;
  return {
    ...loafer,
    price: `₹${updatedPrice.toLocaleString("en-IN")}`,
  };
});

const Loafers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const { id } = useParams();

  const [popup, setPopup] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const showPopup = (message) => {
    setPopup(message);
    setTimeout(() => setPopup(""), 2000);
  };

  const handleClick = (product) => {
    navigate(`/product/${product.id}`, {
      state: { product, related: loafersList },
    });
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    showPopup(`✅ ${product.name} added to cart!`);
  };

  const selectedProduct =
    location.state?.product || loafersList.find((p) => p.id === Number(id));

  const handleBuyNow = () => {
    if (selectedProduct) {
      setShowConfirm(true);
    }
  };

  const confirmPurchase = () => {
    setShowConfirm(false);
    navigate("/customer-details", { state: { product: selectedProduct } });
  };

  return (
    <div className="loafers-container">
      <h2 className="section-title">Luxury Loafers Collection</h2>

      {!selectedProduct ? (
        // 🔹 Grid view
        <div className="loafers-grid">
          {loafersList.map((product) => (
            <div
              key={product.id}
              className="loafers-card"
              onClick={() => handleClick(product)}
            >
              <img
                src={product.image}
                alt={product.name}
                className="loafers-image"
              />
              <h3 className="loafers-name">{product.name}</h3>
              <p className="loafers-price">{product.price}</p>
            </div>
          ))}
        </div>
      ) : (
        // 🔹 Detail view
        <div className="product-detail">
          <div className="detail-main">
            <ProductGallery product={selectedProduct} />

            <div className="detail-info">
              <h2>{selectedProduct.name}</h2>
              <p className="loafers-price">{selectedProduct.price}</p>

              <div className="product-actions">
                <button
                  className="btn-cart"
                  onClick={() => handleAddToCart(selectedProduct)}
                >
                  Add to Cart
                </button>
                <button className="btn-buy" onClick={handleBuyNow}>
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {popup && <div className="popup">{popup}</div>}

          {showConfirm && (
            <CustomModal
              isOpen={showConfirm}
              onClose={() => setShowConfirm(false)}
              onConfirm={confirmPurchase}
              product={selectedProduct}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Loafers;
