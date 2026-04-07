import React, { useState } from "react";
import "../scss/_trackSuit.scss";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import CustomModal from "../Sidebar/CustomModal"; // ✅ Import modal
import ProductGallery from "../components/ProductGallery";

// ✅ Tracksuit Images
import AdidasRedLogo from "../assets/Adida s Red Logo Print Premium Imported Tracksuit.png";
import AirJordanBlack from "../assets/Air Jordan Black Premium Oversized Cord Set - Copy (2).png";
import AirJordanCream from "../assets/Air Jordan Cream Premium Oversized Cord Set - Copy (2).png";
import AirJordanNavy from "../assets/Air Jordan Navy Blue Premium Oversized Cord Set - Copy (3).png";
import ArmaniExchangeWhite from "../assets/Arman i Exchange White Embroidered Patch Logo Eagle Edition Imported Fabric Tracksuit With Carry Bag 2631.png";
import BalmainBlack from "../assets/Balmai n Paris Black Premium Imported Japanese Fabric Monogram Printed Tracksuit 2844.png";
import BalmainNavy from "../assets/Balmai n Paris Navy Premium Imported Japanese Fabric Monogram Printed Tracksuit 2843 - Copy (3).png";
import BalmainWhite from "../assets/Balmai n Paris White Premium Imported Japanese Fabric Monogram Printed Tracksuit 2845 - Copy (3).png";
import BossDarkGrey from "../assets/Boss Dark Grey Embroidered Logo Design with Jacquard Fabric Premium Tracksuit with Carry Bag 22572.png";
import BurberryWhite from "../assets/Burberr y White Embroidered Logo Imported Fabric Tracksuit With Carry Bag 2461 - Copy.png";
import DieselBeige from "../assets/Diese l Beige Back Print Premium Oversized Cord Set - Copy (2).png";
import DieselCream from "../assets/Diese l Cream Back Print Premium Oversized Cord Set - Copy.png";
import DieselGreen from "../assets/Diese l Green Back Print Premium Oversized Cord Set - Copy.png";
import HoodRichGrey from "../assets/HoodRich Grey Embroidery Logo Imported Tracksuit - Copy (2).png";
import LouisVuittonBlackBeige from "../assets/Louis Vuitton Black Beige Monogram Imported Premium Tracksuit With Carry Bag - Copy.png";
import LouisVuittonBlackWhite from "../assets/Louis Vuitton Black White Monogram Imported Premium Tracksuit With Carry Bag - Copy.png";
import LouisVuittonWhite from "../assets/Louis Vuitton White Monogram Imported Premium Tracksuit With Carry Bag - Copy.png";
import ZaraBlack from "../assets/Zar a Black Premium Knitted Classic Cord Set.png";

// ✅ Tracksuit Array
const tracksuits = [
  { id: 1, name: "Premium Tracksuit – Red Logo Print Edition", price: 1500, oldPrice: 16000, discount: "6% off", image: AdidasRedLogo },

  { id: 2, name: "Luxury Cord Set – Black Oversized Edition", price: 1800, oldPrice: 20000, discount: "10% off", image: AirJordanBlack },

  { id: 3, name: "Luxury Cord Set – Cream Oversized Edition", price: 1800, oldPrice: 20000, discount: "10% off", image: AirJordanCream },

  { id: 4, name: "Luxury Cord Set – Navy Blue Oversized Edition", price: 1800, oldPrice: 20000, discount: "10% off", image: AirJordanNavy },

  { id: 5, name: "Premium Tracksuit – White Embroidered Edition", price: 2200, oldPrice: 24000, discount: "8% off", image: ArmaniExchangeWhite },

  { id: 7, name: "Luxury Tracksuit – Black Monogram Edition", price: 2500, oldPrice: 27000, discount: "7% off", image: BalmainBlack },

  { id: 8, name: "Luxury Tracksuit – Navy Monogram Edition", price: 2500, oldPrice: 27000, discount: "7% off", image: BalmainNavy },

  { id: 9, name: "Luxury Tracksuit – White Monogram Edition", price: 2500, oldPrice: 27000, discount: "7% off", image: BalmainWhite },

  { id: 10, name: "Premium Tracksuit – Dark Grey Embroidered Edition", price: 1800, oldPrice: 20000, discount: "10% off", image: BossDarkGrey },

  { id: 11, name: "Premium Tracksuit – White Embroidery Edition", price: 2200, oldPrice: 24000, discount: "8% off", image: BurberryWhite },

  { id: 12, name: "Luxury Cord Set – Beige Back Print Edition", price: 1700, oldPrice: 18000, discount: "6% off", image: DieselBeige },

  { id: 13, name: "Luxury Cord Set – Cream Back Print Edition", price: 1700, oldPrice: 18000, discount: "6% off", image: DieselCream },

  { id: 14, name: "Luxury Cord Set – Green Back Print Edition", price: 1700, oldPrice: 18000, discount: "6% off", image: DieselGreen },

  { id: 16, name: "Premium Tracksuit – Grey Embroidery Edition", price: 1600, oldPrice: 1700, discount: "6% off", image: HoodRichGrey },

  { id: 17, name: "Luxury Tracksuit – Black Beige Designer Edition", price: 2000, oldPrice: 42000, discount: "5% off", image: LouisVuittonBlackBeige },

  { id: 18, name: "Luxury Tracksuit – Black White Designer Edition", price: 2000, oldPrice: 42000, discount: "5% off", image: LouisVuittonBlackWhite },

  { id: 19, name: "Luxury Tracksuit – White Designer Edition", price: 2799, oldPrice: 42000, discount: "5% off", image: LouisVuittonWhite },

  { id: 20, name: "Premium Cord Set – Black Knitted Edition", price: 1400, oldPrice: 15000, discount: "6% off", image: ZaraBlack },
];
const priceIncrement = Number(process.env.REACT_APP_PRODUCT_PRICE);
const tracksuitsList = tracksuits.map((t) => ({ ...t, price: t.price + priceIncrement }));

const Tracksuits = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart } = useCart();
  const [popup, setPopup] = useState("");
  const [showConfirm, setShowConfirm] = useState(false); // ✅ modal state
  const navigate = useNavigate();

  const showPopup = (message) => {
    setPopup(message);
    setTimeout(() => setPopup(""), 2000);
  };

  // ✅ Buy Now → open modal
  const handleBuyNow = (product) => {
    setSelectedProduct(product);
    setShowConfirm(true);
  };

  // ✅ Confirm Purchase
  const confirmPurchase = () => {
    setShowConfirm(false);
    navigate("/customer-details", { state: { product: selectedProduct } });
  };

  // Add to Cart
  const handleAddToCart = (product) => {
    addToCart(product);
    showPopup(`${product.name} added to cart!`);
  };

  // ✅ Product List
  if (!selectedProduct) {
    return (
      <div className="tracksuits-container">
        <h2 className="tracksuits-title">Tracksuit Collection</h2>
        <div className="tracksuits-grid">
          {tracksuitsList.map((item) => (
            <div
              key={item.id}
              className="product-card"
              onClick={() => setSelectedProduct(item)}
            >
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <p className="price">₹{item.price}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ✅ Product Detail
  return (
    <div className="product-detail">
      <div className="detail-content">
        {/* Left Image */}
        <div className="detail-left">
          <ProductGallery product={selectedProduct} />
        </div>

        {/* Right Info */}
        <div className="detail-right">
          <h2>{selectedProduct.name}</h2>
          <p className="price">
            ₹{selectedProduct.price}{" "}
            <span className="old-price">{selectedProduct.oldPrice}</span>{" "}
            <span className="discount">{selectedProduct.discount}</span>
          </p>

          {/* Sizes */}
          <div className="size-options">
            <h4>Size:</h4>
            <div className="sizes">
              <button>S</button>
              <button>M</button>
              <button>L</button>
              <button>XL</button>
            </div>
          </div>

          {/* Quantity */}
          <div className="quantity">
            <h4>Quantity:</h4>
            <div>
              <button>-</button>
              <input type="number" value={1} readOnly />
              <button>+</button>
            </div>
          </div>

          {/* Actions */}
          <div className="detail-actions">
            {/* <button className="btn-wishlist">♡ Add to Wishlist</button> */}
            <button className="btn-cart" onClick={() => handleAddToCart(selectedProduct)}>
              Add to Cart
            </button>
            <button className="btn-buy" onClick={() => handleBuyNow(selectedProduct)}>
              Buy Now
            </button>
          </div>

          {/* Extra Info */}
          <div className="extra-info">
            <h4>Product Details</h4>
            <ul>
              <li>✅ Free Delivery on all orders</li>
              <li>✅ 14 Days Return / Replacement Policy</li>
              <li>✅ Material: Polyester & Cotton Blend</li>
              <li>✅ Care Instructions: Machine Wash Cold</li>
              <li>✅ Perfect for Sports & Casual Wear</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Items */}
      <div className="related-items">
        <h3>Related Tracksuits</h3>
        <div className="related-grid">
          {tracksuitsList
            .filter((item) => item.id !== selectedProduct.id)
            .slice(0, 5)
            .map((item) => (
              <div
                key={item.id}
                className="related-card"
                onClick={() => setSelectedProduct(item)}
              >
                <img src={item.image} alt={item.name} />
                <p className="name">{item.name}</p>
                <p className="price">₹{item.price}</p>
              </div>
            ))}
        </div>
      </div>

      {popup && <div className="popup">{popup}</div>}

      {/* ✅ Confirmation Modal */}
      <CustomModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmPurchase}
        product={selectedProduct}
      />
    </div>
  );
};

export default Tracksuits;
