import React, { useState } from "react";
import "../scss/_LuxuryPage.scss";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import CustomModal from "../Sidebar/CustomModal"; 
import ProductGallery from "../components/ProductGallery";

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
];

const priceIncrement = Number(process.env.REACT_APP_PRODUCT_PRICE);
const productsList = products.map(product => ({
  ...product,
  price: product.price + priceIncrement
}));

const LuxuryPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const { addToCart, addToWishlist } = useCart();
  const navigate = useNavigate();

  const handleBuyNow = (product) => {
    setSelectedProduct(product);
    setShowConfirm(true);
  };

  const confirmBuyNow = () => {
    setShowConfirm(false);
    navigate("/customer-details", { state: { product: selectedProduct, quantity: 1 } });
  };

  // ✅ Grid view
  if (!selectedProduct) {
    return (
      <div className="luxury-page">
        <h2 className="page-title">Luxury Collection</h2>
        <div className="products-grid">
          {productsList.map((prod) => (
            <div
              key={prod.id}
              className="product-card"
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedProduct(prod)}
            >
              <div className="product-image">
                <img src={prod.image} alt={prod.name} />
              </div>
              <div className="product-info">
                <h4>{prod.name}</h4>
                <div className="price-box">
                  <span className="old-price">₹{prod.oldPrice}</span>
                  <span className="current-price">₹{prod.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ✅ Related products
  const relatedProducts = productsList
    .filter((p) => p.category === selectedProduct.category && p.id !== selectedProduct.id)
    .slice(0, 3);

  return (
    <div className="product-details">
      <div className="details-container">
        {/* Left - Image */}
        <div className="details-image">
          <ProductGallery product={selectedProduct} />
        </div>

        {/* Right - Info */}
        <div className="details-info">
          <h2>{selectedProduct.name}</h2>
          <div className="price-box">
            <span className="old-price">₹{selectedProduct.oldPrice}</span>
            <span className="current-price">₹{selectedProduct.price}</span>
          </div>

          <div className="action-buttons">
            <button className="buy-btn" onClick={() => handleBuyNow(selectedProduct)}>Buy Now</button>
            <button
              className="cart-btn"
              onClick={() =>
                addToCart({
                  id: selectedProduct.id,
                  name: selectedProduct.name,
                  price: selectedProduct.price,
                  image: selectedProduct.image,
                  quantity: 1,
                })
              }
            >
              Add to Cart
            </button>
            <button
              className="wishlist-btn"
              onClick={() =>
                addToWishlist({
                  id: selectedProduct.id,
                  name: selectedProduct.name,
                  price: selectedProduct.price,
                  image: selectedProduct.image,
                })
              }
            >
              Wishlist
            </button>
          </div>

          <div className="policy-box">
            <h3>Why Shop With Us?</h3>
            <ul>
              <li>✔ 7 Days Easy Exchange Policy</li>
              <li>✔ Free Shipping on All Orders</li>
              <li>✔ 100% Original Products</li>
              <li>✔ Secure Online Payments</li>
              <li>✔ 24/7 Customer Support</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="related-products">
          <h3>Related Products</h3>
          <div className="products-grid">
            {relatedProducts.map((prod) => (
              <div
                key={prod.id}
                className="product-card"
                onClick={() => setSelectedProduct(prod)}
              >
                <div className="product-image">
                  <img src={prod.image} alt={prod.name} />
                </div>
                <div className="product-info">
                  <h4>{prod.name}</h4>
                  <div className="price-box">
                    <span className="old-price">₹{prod.oldPrice}</span>
                    <span className="current-price">₹{prod.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ✅ Buy Now Confirmation Modal */}
      <CustomModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmBuyNow}
        product={selectedProduct}
      />
    </div>
  );
};

export default LuxuryPage;
