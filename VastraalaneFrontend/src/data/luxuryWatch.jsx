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
import RADO_AUTO1 from "../assets/RADO_AUTO_ROSE-TT-GREEN.jpeg";
import RADO_AUTO2 from "../assets/RADO_AUTO_SILVER-BLACK.jpeg";
import REDO_AUTO3 from "../assets/REDO_AUTO_GOLD_2.jpeg"
import REDO_AUTO4 from "../assets/REDO_AUTO_GOLD.jpeg";
import RADO_AUTO5 from "../assets/RADO_AUTO_BROWN.jpeg";
import RADO_AUTO6 from "../assets/RADO_TRUE_SQUARE_BLUE.jpg";
import RADO_AUTO7 from "../assets/RADO_TRUE_SQUARE_BLUEGREY.jpg";
import RADO_AUTO8 from "../assets/RADO_TRUE_SQUARE_REDSILVER.jpg";
import RADO_AUTO10 from "../assets/RADO_TRUE_SQUARE_GREENGREY.jpg";




// ✅ Product Data Array
const products = [
  { id: 1, name: "Exclusive Watch – Classic Edition", image: ArmaniExchange, price: 2999, oldPrice: 24999, category: "Exclusive" },

  { id: 2, name: "Premium Watch – Royal Edition", image: Audemars1, price: 2899, oldPrice: 6999, category: "Premium" },

  { id: 3, name: "Luxury Watch – Automatic Royal 2308", image: Audemars2, price: 1999, oldPrice: 31999, category: "Luxury" },

  { id: 4, name: "Premium Watch – Steel Royal 2303", image: Audemars3, price: 3699, oldPrice: 32999, category: "Premium" },

  { id: 5, name: "Exclusive Watch – Classic Dial 1143", image: Emporio1, price: 4599, oldPrice: 22999, category: "Exclusive" },

  { id: 6, name: "Premium Watch – Silver Black Edition", image: Emporio2, price: 1599, oldPrice: 26999, category: "Premium" },

  { id: 7, name: "Exclusive Watch – Elegant Series", image: Emporio3, price: 2899, oldPrice: 25999, category: "Exclusive" },

  { id: 8, name: "Luxury Watch – Big Dial Classic", image: Hublot1, price: 1983, oldPrice: 3999, category: "Luxury" },

  { id: 9, name: "Premium Watch – Chronograph Unico", image: Hublot2, price: 1999, oldPrice: 2999, category: "Premium" },

  { id: 10, name: "Luxury Watch – Aqua Blue Automatic", image: Omega1, price: 2999, oldPrice: 3799, category: "Luxury" },

  { id: 11, name: "Luxury Watch – Moon Chronograph", image: Omega2, price: 1899, oldPrice: 3999, category: "Luxury" },

  { id: 12, name: "Premium Watch – Pilot Automatic", image: Omega3, price: 1929, oldPrice: 4999, category: "Premium" },

  { id: 13, name: "Exclusive Watch – Radiant Classic", image: Panerai, price: 1199, oldPrice: 5999, category: "Exclusive" },

  { id: 14, name: "Luxury Watch – Nautilus Style 2342", image: Patek1, price: 1499, oldPrice: 6999, category: "Luxury" },

  { id: 15, name: "Premium Watch – Open Heart Edition", image: Rado, price: 1399, oldPrice: 29999, category: "Premium" },

  { id: 16, name: "Luxury Watch – Oyster Classic", image: Rolex1, price: 1299, oldPrice: 7999, category: "Luxury" },

  { id: 17, name: "Exclusive Watch – Yacht Series", image: Rolex8, price: 2999, oldPrice: 3999, category: "Exclusive" },

  { id: 18, name: "Luxury Watch – Quartz Blue Edition", image: Seiko1, price: 5599, oldPrice: 22999, category: "Luxury" },

  { id: 19, name: "Premium Watch – Quartz Green Edition", image: Seiko2, price: 2599, oldPrice: 22999, category: "Premium" },

  { id: 20, name: "Exclusive Watch – Couple Edition", image: Tissot1, price: 3999, oldPrice: 34999, category: "Exclusive" },

  { id: 21, name: "Premium Watch – Modern PRX Style", image: Tissot2, price: 3299, oldPrice: 35999, category: "Premium" },

  { id: 22, name: "Exclusive Watch – Decker Edition", image: Tommy1, price: 2599, oldPrice: 19999, category: "Exclusive" },

  { id: 23, name: "Luxury Watch – Chronograph Elite", image: Versace1, price: 999, oldPrice: 2999, category: "Luxury" },

  { id: 24, name: "Premium Watch – GOLD-TT-GREEN", image: RADO_AUTO1, price: 3300, oldPrice: 7500, category: "Premium" },

  { id: 25, name: "Premium Watch – SILVER-BLACK", image: RADO_AUTO2, price: 3300, oldPrice: 7500, category: "Premium" },

  { id: 26, name: "Premium Watch –GOLD", image: REDO_AUTO3, price: 3300, oldPrice: 7500, category: "Premium" },

  { id: 27, name: "Premium Watch – ROSE-TT-GREEN", image: REDO_AUTO4, price: 3300, oldPrice: 7500, category: "Premium" },
  { id: 28, name: "Premium Watch – BROWN", image: RADO_AUTO5, price: 1699, oldPrice: 10000, category: "Premium" },

  { id: 29, name: "Premium Watch – BLUE", image: RADO_AUTO6, price: 1699, oldPrice: 10000, category: "Premium" },

  { id: 30, name: "Premium Watch – SILVER-BLUE", image: RADO_AUTO7, price: 1699, oldPrice: 10000, category: "Premium" },

  { id: 31, name: "Premium Watch – SILVER-RED", image: RADO_AUTO8, price: 1699, oldPrice: 10000, category: "Premium" },

  { id: 33, name: "Premium Watch – BLACK-GREEN", image: RADO_AUTO10, price: 1699, oldPrice: 7500, category: "Premium" },

  
  

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
