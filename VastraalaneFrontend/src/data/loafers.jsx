import React, { useState } from "react";
import "../scss/_loafers.scss";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CustomModal from "../Sidebar/CustomModal";

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
  { id: 1, name: "Loro Piana Loafers", price: "2799.00", image: Loafers1 },
  { id: 2, name: "Loro Piana Loafers", price: "2500", image: Loafers2 },
  { id: 3, name: "Loro Piana Loafers Brown", price: "3000", image: Loafers3 },
  { id: 4, name: "Loro Piana Loafers", price: "1500", image: Loafers4 },
  { id: 5, name: "Loro Piana Loafers", price: "2000", image: Loafers5 },
  { id: 6, name: "Loro Piana Loafers", price: "3000", image: Loafers6 },
  { id: 7, name: "Loro Piana Loafers", price: "2789.00", image: Loafers7 },
  { id: 8, name: "Loro Piana Loafers", price: "1299.00", image: Loafers8 },
  { id: 9, name: "Loro Piana Loafers", price: "2,000", image: Loafers9 },
  { id: 10, name: "Loro Piana Loafers", price: "2,000", image: Loafers10 },
  { id: 11, name: "Loro Piana Loafers", price: "3,500", image: Loafers11 },
  { id: 12, name: "Loro Piana Loafers", price: "1,000", image: Loafers12 },
  { id: 13, name: "Loro Piana Loafers Beige", price: "3,000", image: Loafers13 },
  { id: 14, name: "Loro Piana Loafers Blue", price: "2500", image: Loafers14 },
  { id: 15, name: "Loro Piana Loafers Green", price: "2,000", image: Loafers15 },
  { id: 16, name: "Loro Piana Loafers Grey", price: "1500", image: Loafers16 },
  { id: 17, name: "Loro Piana Loafers Grey", price: "1,500", image: Loafers17 },
  { id: 18, name: "Loro Piana Loafers Navy", price: "2,500", image: Loafers18 },
  { id: 19, name: "Loro Piana Loafers", price: "2,000", image: Loafers19 },
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
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="detail-image"
            />

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
