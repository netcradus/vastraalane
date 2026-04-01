import React, { useState } from "react";
import "../scss/_luxuryWatch.scss";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import CustomModal from "../Sidebar/CustomModal"; // ✅ Import your reusable modal

// Images import
import ArmaniExchange from "../assets/Arman_i_ Exchange watch.jpg";
import Audemars1 from "../assets/AUDEMAR.S PIGUET.jpg";
import Audemars2 from "../assets/AUDEMARS_PIGUET AUTOMATIC WATCH ROYAL OAK 2308 - Copy (2).png";
import Audemars3 from "../assets/AUDEMARS_PIGUET ROYAL OAK (2303) - Copy.png";

import Emporio1 from "../assets/Emporio Arman_i AR1143 - J1457.png";
import Emporio2 from "../assets/Emporio Arman_i Classic Silver-Black 2341 - Copy (2).png";
import Emporio3 from "../assets/Emporio Arman_i For her 2317 - Copy.png";

import Hublot1 from "../assets/Hublo t big bang classic 2164.png";
import Hublot2 from "../assets/HUBLO_T BIGBANG UNICO SKY BLUE WATCH 2304 - Copy (2).png";

import Omega1 from "../assets/Omeg a Seamaster Aqua Terra Blue Japanese Automatic 2298 - Copy.png";
import Omega2 from "../assets/OMEG A SPEEDMASTER MOONWATCH PROFESSIONAL 2294.png";
import Omega3 from "../assets/OMEG A SPEEDMASTER PILOT AUTO.png";

import Panerai from "../assets/Panerai Radiomir California 2309.png";
import Patek1 from "../assets/patek_philippe_nautilus_2342.png";

import Rado from "../assets/Rad_o diastar open heart.png";
import Rolex1 from "../assets/Role_x Oyster perpetual - Copy.png";
import Rolex8 from "../assets/ROLE_X_YACHTMASRER.jpg";

import Seiko1 from "../assets/SEIKO 5 quartz WATCH Bluee 014.png";
import Seiko2 from "../assets/SEIKO 5 quartz WATCH Green 014.png";

import Tissot1 from "../assets/TISSO T COUPLE WATCH 2291.png";
import Tissot2 from "../assets/Tisso t PRX Premium Watch Back open 2289.png";

import Tommy1 from "../assets/Tommy_Hilfiger Decker - J1458.png";
import Versace1 from "../assets/Versace Aion Chronograph.png";

// ✅ Product Data Array
const products = [
  { id: 1, name: "Arman_i_ Exchange watch.jpg", image: ArmaniExchange, price: 1999, oldPrice: 24999 },
  { id: 2, name: "AUDEMAR.S PIGUET.jpg", image: Audemars1, price: 2999, oldPrice: 29999 },
  { id: 3, name: "AUDEMARS_PIGUET AUTOMATIC WATCH ROYAL OAK 2308 - Copy (2).png", image: Audemars2, price: 1999, oldPrice: 31999 },
  { id: 4, name: "AUDEMARS_PIGUET ROYAL OAK (2303) - Copy.png", image: Audemars3, price: 2789.0, oldPrice: 32999 },
  { id: 5, name: "Emporio Arman_i AR1143 - J1457.png", image: Emporio1, price: 2599.0, oldPrice: 22999 },
  { id: 6, name: "Emporio Arman_i Classic Silver-Black 2341 - Copy (2).png", image: Emporio2, price: 1299, oldPrice: 26999 },
  { id: 7, name: "Emporio Arman_i For her 2317 - Copy.png", image: Emporio3, price: 1899, oldPrice: 25999 },
  { id: 8, name: "Hublo t big bang classic 2164.png", image: Hublot1, price: 1679, oldPrice: 49999 },
  { id: 9, name: "HUBLO_T BIGBANG UNICO SKY BLUE WATCH 2304 - Copy (2).png", image: Hublot2, price: 1999, oldPrice: 52999 },
  { id: 10, name: "Omeg a Seamaster Aqua Terra Blue Japanese Automatic 2298 - Copy.png", image: Omega1, price: 2999, oldPrice: 37999 },
  { id: 11, name: "OMEG A SPEEDMASTER MOONWATCH PROFESSIONAL 2294.png", image: Omega2, price: 1199, oldPrice: 39999 },
  { id: 12, name: "OMEG A SPEEDMASTER PILOT AUTO.png", image: Omega3, price: 1299, oldPrice: 41999 },
  { id: 13, name: "Panerai Radiomir California 2309.png", image: Panerai, price: 1399, oldPrice: 59999 },
  { id: 14, name: "patek_philippe_nautilus_2342.png", image: Patek1, price: 1499, oldPrice: 69999 },
  { id: 15, name: "Rad_o diastar open heart.png", image: Rado, price: 2999, oldPrice: 29999 },
  { id: 16, name: "Role_x Oyster perpetual - Copy.png", image: Rolex1, price: 12999, oldPrice: 79999 },
  { id: 17, name: "ROLE_X_YACHTMASRER.jpg", image: Rolex8, price: 1999, oldPrice: 84999 },
  { id: 18, name: "SEIKO 5 quartz WATCH Bluee 014.png", image: Seiko1, price: 1599, oldPrice: 22999 },
  { id: 19, name: "SEIKO 5 quartz WATCH Green 014.png", image: Seiko2, price: 2599, oldPrice: 22999 },
  { id: 20, name: "TISSO T COUPLE WATCH 2291.png", image: Tissot1, price: 1999, oldPrice: 34999 },
  { id: 21, name: "Tisso t PRX Premium Watch Back open 2289.png", image: Tissot2, price: 1299, oldPrice: 35999 },
  { id: 22, name: "Tommy_Hilfiger Decker - J1458.png", image: Tommy1, price: 1599, oldPrice: 19999 },
  { id: 23, name: "Versace Aion Chronograph.png", image: Versace1, price: 1999, oldPrice: 42999 },
];

const priceIncrement = Number(process.env.REACT_APP_PRODUCT_PRICE);
const updatedProductList = products.map(product => ({
  ...product,
  price: product.price + priceIncrement
}));

const LuxuryWatch = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart } = useCart();
  const [popup, setPopup] = useState("");
  const [showConfirm, setShowConfirm] = useState(false); // ✅ Confirmation state
  const navigate = useNavigate();

  const showPopup = (message) => {
    setPopup(message);
    setTimeout(() => setPopup(""), 2000);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    showPopup(`✅ ${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (selectedProduct) {
      setShowConfirm(true); // ✅ open confirmation modal
    }
  };

  const confirmPurchase = () => {
    setShowConfirm(false);
    navigate("/customer-details", { state: { product: selectedProduct } });
  };

  return (
    <div className="luxurywatch-page">
      <h2 className="page-title">Luxury Watches Collection</h2>

      {!selectedProduct ? (
        <div className="luxurywatch-grid">
          {updatedProductList.map((item) => (
            <div
              key={item.id}
              className="watch-card"
              onClick={() => setSelectedProduct(item)}
            >
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <p className="price">
                {item.price} <span className="old-price">{item.oldPrice}</span>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* ✅ Product Details Section */}
          <div className="product-detail">
            <div className="detail-left">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="detail-image"
              />
            </div>

            <div className="detail-right">
              <h2>{selectedProduct.name}</h2>
              <p className="price">
                <span className="new-price">{selectedProduct.price}</span>
                <span className="old-price">{selectedProduct.oldPrice}</span>
              </p>

              <div className="product-actions">
                <button
                  className="btn-cart"
                  onClick={() => handleAddToCart(selectedProduct)}
                >
                  Add to Cart
                </button>
                <button className="btn-wishlist">Wishlist</button>
                <button className="btn-buy" onClick={handleBuyNow}>
                  Buy Now
                </button>
              </div>

              <div className="extra-info">
                <p>Pay on delivery available</p>
                <p>Easy 14 days return & exchange available</p>
                <p>Type: Regular</p>
              </div>

              <div className="product-specs">
                <h3>Product Details</h3>
                <ul>
                  <li><strong>Display:</strong> Analogue</li>
                  <li><strong>Movement:</strong> Quartz</li>
                  <li><strong>Dial style:</strong> Solid round stainless steel dial</li>
                  <li><strong>Strap style:</strong> Black bracelet style, stainless steel strap with a foldover closure</li>
                  <li><strong>Water resistance:</strong> 50 m</li>
                  <li><strong>Warranty:</strong> 2 years (provided by brand/manufacturer)</li>
                  <li><strong>Disclaimer:</strong> The Watch Cases might differ from the image shown.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ✅ Related Products */}
          <div className="related-products">
            <h3>Related Products</h3>
            <div className="related-grid">
              {updatedProductList
                .filter((item) => item.id !== selectedProduct.id)
                .slice(0, 12)
                .map((item) => (
                  <div
                    key={item.id}
                    className="related-card"
                    onClick={() => setSelectedProduct(item)}
                  >
                    <img src={item.image} alt={item.name} />
                    <h4>{item.name}</h4>
                    <p className="price">
                      {item.price} <span className="old-price">{item.oldPrice}</span>
                    </p>
                  </div>
                ))}
            </div>
          </div>

          {/* 🔹 Popup message */}
          {popup && <div className="popup">{popup}</div>}

          {/* 🔹 Confirmation Modal */}
          {showConfirm && (
            <CustomModal
              isOpen={showConfirm}
              onClose={() => setShowConfirm(false)}
              onConfirm={confirmPurchase}
              product={selectedProduct}
            />
          )}
        </>
      )}
    </div>
  );
};

export default LuxuryWatch;
