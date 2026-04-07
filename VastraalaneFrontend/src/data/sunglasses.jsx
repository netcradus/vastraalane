import React, { useState } from "react";
import "../scss/_sunglasses.scss";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import CustomModal from "../Sidebar/CustomModal"; // ✅ Import modal
import ProductGallery from "../components/ProductGallery";

// ✅ Import all sunglasses images
import DolceGabbana from "../assets/_Dolce_and_gabbana_5011.png";
import Gucci from "../assets/_Gucci_10318_.png";
import MarcJacobs515 from "../assets/_Marc_jacobs_515.png";
import TomFord from "../assets/_Tom_ford_23533.png";
import BalmainBlack from "../assets/Balmain_28015_black.png";
import BalmainBrown from "../assets/Balmain_28015_brown - Copy.png";
import BalmainTigerBrown from "../assets/Balmain_28015_tiger_brown.png";
import BalmainTigerGreen from "../assets/Balmain_28015_tiger_green.png";
import BossIce from "../assets/Boss ice 0618.png";
import Burberry from "../assets/Burberry_8769_Black_Silver_Mercury.jpg";
import CalvinKlein from "../assets/Calvin_klein_Y06_grey_black - Copy (2).png";
import Cartier1 from "../assets/Cartier_gold_black_3072 - Copy (2).jpg";
import Cartier2 from "../assets/Cartier_gold_black_3072 - Copy.jpg";
import DavidBrownGreen from "../assets/David Beckham 2208 Water Brown Green - Copy.png";
import DavidBlack1 from "../assets/David Beckham black 220 - Copy.jpg";
import DavidBlack2 from "../assets/David Beckham black 220.jpg";
import Dior from "../assets/Dior_WMNS_8875_Black_Blue_DC.png";
import Jacques from "../assets/Jacques marie mage 3959 black plano.png";
import Loewe1 from "../assets/Loewe 8419 grey - Copy.png";
import Loewe2 from "../assets/Loewe 8419 grey.png";
import LouisVuitton from "../assets/Louis_vuitton_silver_blue_2608.png";
import MarcJacobsGoldBlack from "../assets/Marc Jacobs 510 Gold Black.png";
import MarcJacobsBlack from "../assets/MARC JACOBS BLACK.jpg";
import MarcJacobsLuxury from "../assets/Marc Jacobs Gold-Multi Luxury Shades 9025 - Copy.png";
import MontBlanc from "../assets/Mont_blanc_Y07_black.png";
import Oakley from "../assets/Oakley_0221_Gold_Yellow - Copy.png";
import Prada from "../assets/prada_21_grey_blue.png";
import Rayban from "../assets/Rayban 04 lite grey black.jpg";
import Suocchi from "../assets/Suocchi 4413 gold yellow.jpg";
import Versace from "../assets/Versace 127 Gold Blue.png";

const sunglasses = [
  { id: 1, name: "Luxury Sunglasses – Model 5011", img: DolceGabbana, price: "₹2499", oldPrice: "₹7000", discount: "50% off" },

  { id: 2, name: "Premium Sunglasses – Model 10318", img: Gucci, price: "₹1299", oldPrice: "₹8500", discount: "49% off" },

  { id: 3, name: "Premium Sunglasses – Model 515", img: MarcJacobs515, price: "₹1899", oldPrice: "₹7800", discount: "50% off" },

  { id: 4, name: "Luxury Sunglasses – Model 23533", img: TomFord, price: "₹1199", oldPrice: "₹10000", discount: "48% off" },

  { id: 5, name: "Premium Sunglasses – Black Edition 28015", img: BalmainBlack, price: "₹1599", oldPrice: "₹9000", discount: "49% off" },
  { id: 6, name: "Premium Sunglasses – Brown Edition 28015", img: BalmainBrown, price: "₹1599", oldPrice: "₹9200", discount: "50% off" },
  { id: 7, name: "Premium Sunglasses – Tiger Brown 28015", img: BalmainTigerBrown, price: "₹1799", oldPrice: "₹9300", discount: "48% off" },
  { id: 8, name: "Premium Sunglasses – Tiger Green 28015", img: BalmainTigerGreen, price: "₹1799", oldPrice: "₹9300", discount: "48% off" },

  { id: 9, name: "Premium Sunglasses – Ice Edition 0618", img: BossIce, price: "₹1299", oldPrice: "₹6600", discount: "50% off" },

  { id: 10, name: "Luxury Sunglasses – Black Silver Mercury 8769", img: Burberry, price: "₹1499", oldPrice: "₹11000", discount: "50% off" },

  { id: 11, name: "Premium Sunglasses – Grey Black Y06", img: CalvinKlein, price: "₹1799", oldPrice: "₹7500", discount: "49% off" },

  { id: 12, name: "Luxury Sunglasses – Gold Black 3072", img: Cartier1, price: "₹1999", oldPrice: "₹14000", discount: "50% off" },
  { id: 13, name: "Luxury Sunglasses – Gold Black 3072 (Alt)", img: Cartier2, price: "₹1999", oldPrice: "₹14000", discount: "50% off" },

  { id: 14, name: "Premium Sunglasses – Brown Green 2208", img: DavidBrownGreen, price: "₹1199", oldPrice: "₹8400", discount: "50% off" },
  { id: 15, name: "Premium Sunglasses – Black 220", img: DavidBlack1, price: "₹1199", oldPrice: "₹8400", discount: "50% off" },
  { id: 16, name: "Premium Sunglasses – Black 220 (Alt)", img: DavidBlack2, price: "₹1199", oldPrice: "₹8400", discount: "50% off" },

  { id: 17, name: "Luxury Sunglasses – Black Blue 8875", img: Dior, price: "₹1199", oldPrice: "₹11800", discount: "50% off" },

  { id: 18, name: "Luxury Sunglasses – Black Plano 3959", img: Jacques, price: "₹1299", oldPrice: "₹12500", discount: "50% off" },

  { id: 19, name: "Premium Sunglasses – Grey 8419", img: Loewe1, price: "₹1499", oldPrice: "₹9000", discount: "50% off" },
  { id: 20, name: "Premium Sunglasses – Grey 8419 (Alt)", img: Loewe2, price: "₹1499", oldPrice: "₹9000", discount: "50% off" },

  { id: 21, name: "Luxury Sunglasses – Silver Blue 2608", img: LouisVuitton, price: "₹1499", oldPrice: "₹15000", discount: "50% off" },

  { id: 22, name: "Premium Sunglasses – Gold Black 510", img: MarcJacobsGoldBlack, price: "₹1999", oldPrice: "₹8000", discount: "50% off" },
  { id: 23, name: "Premium Sunglasses – Black Classic", img: MarcJacobsBlack, price: "₹1999", oldPrice: "₹8000", discount: "50% off" },

  { id: 24, name: "Luxury Sunglasses – Gold Multi 9025", img: MarcJacobsLuxury, price: "₹1499", oldPrice: "₹9000", discount: "50% off" },

  { id: 25, name: "Premium Sunglasses – Black Y07", img: MontBlanc, price: "₹1099", oldPrice: "₹1400", discount: "50% off" },

  { id: 26, name: "Premium Sunglasses – Gold Yellow 0221", img: Oakley, price: "₹1299", oldPrice: "₹6600", discount: "50% off" },

  { id: 27, name: "Luxury Sunglasses – Grey Blue 21", img: Prada, price: "₹1799", oldPrice: "₹11500", discount: "50% off" },

  { id: 28, name: "Premium Sunglasses – Lite Grey Black 04", img: Rayban, price: "₹1499", oldPrice: "₹7000", discount: "50% off" },

  { id: 29, name: "Premium Sunglasses – Gold Yellow 4413", img: Suocchi, price: "₹1999", oldPrice: "₹6000", discount: "50% off" },

  { id: 30, name: "Luxury Sunglasses – Gold Blue 127", img: Versace, price: "₹1199", oldPrice: "₹12400", discount: "50% off" },
];

const priceIncrement = Number(process.env.REACT_APP_PRODUCT_PRICE);
const sunglassesList = sunglasses.map((sunglass) => {
  const numericPrice = Number(sunglass.price.replace(/[₹,]/g, ""));
  const updatedPrice = numericPrice + priceIncrement;
  return {
    ...sunglass,
    price: `₹${updatedPrice.toLocaleString("en-IN")}`,
  };
});

const Sunglasses = () => {
  const [activeCard, setActiveCard] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart } = useCart();
  const [popup, setPopup] = useState("");
  const [showConfirm, setShowConfirm] = useState(false); // ✅ modal state
  const navigate = useNavigate();

  // Handle card click
  const handleClick = (product) => {
    setActiveCard(product.id);
    setSelectedProduct(product);
  };

  // ✅ Buy Now → open confirmation modal
  const handleBuyNow = (product) => {
    setSelectedProduct(product);
    setShowConfirm(true);
  };

  // ✅ Confirm purchase → navigate
  const confirmPurchase = () => {
    setShowConfirm(false);
    navigate("/customer-details", { state: { product: selectedProduct } });
  };

  // Add to Cart
  const handleAddToCart = async (product) => {
    const payload = {
      id: product.id,
      name: product.name,
      price: parseFloat(product.price.replace("₹", "").replace(",", "")),
      quantity: 1,
      image: product.img,
    };

    try {
      const response = await addToCart(payload);
      console.log("Cart API response:", response);
      setPopup(`${product.name} added to cart!`);
    } catch (err) {
      console.error("Failed to add to cart:", err.response?.data || err.message);
      setPopup(`Failed to add ${product.name} to cart.`);
    }
  };

  // If product is selected → Detail Page
  if (selectedProduct && !showConfirm) {
    return (
      <div className="product-detail-page">
        <div className="detail-content">
          <div className="detail-left">
            <ProductGallery product={selectedProduct} />
          </div>

          <div className="detail-right">
            <h2>{selectedProduct.name}</h2>
            <p className="price">
              {selectedProduct.price}{" "}
              <span className="old-price">{selectedProduct.oldPrice}</span> (
              {selectedProduct.discount})
            </p>

            <div className="quantity-selector">
              <label>Quantity:</label>
              <input type="number" value={1} readOnly />
            </div>

            <div className="product-actions">
              {/* <button className="btn-wishlist">♡ Add to Wishlist</button> */}
              <button
                className="btn-cart"
                onClick={() => handleAddToCart(selectedProduct)}
              >
                Add to Cart
              </button>
              <button className="btn-buy" onClick={() => handleBuyNow(selectedProduct)}>
                Buy Now
              </button>
            </div>

            <ul className="product-features">
              <li>7 Days Return Policy</li>
              <li>Free Shipping Available</li>
              <li>100% Original Product</li>
              <li>Pay on delivery available</li>
            </ul>
          </div>
        </div>

        {/* Related Sunglasses Section */}
        <div className="related-sunglasses-section">
          <h3 className="related-title">Related Sunglasses</h3>
          <div className="related-items-grid">
            {sunglassesList
              .filter((item) => item.id !== selectedProduct.id)
              .slice(0, 4)
              .map((item) => (
                <div
                  key={item.id}
                  className="related-card"
                  onClick={() => handleClick(item)}
                >
                  <img src={item.img} alt={item.name} />
                  <p className="related-name">{item.name}</p>
                  <p className="related-price">{item.price}</p>
                  <button
                    className="btn-cart"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(item);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
          </div>
        </div>

        {popup && <div className="popup">{popup}</div>}
      </div>
    );
  }

  // Else → Show Sunglasses Grid
  return (
    <div className="sunglasses-container">
      <h2 className="section-title">Stylish Sunglasses Collection</h2>

      <div className="sunglasses-grid">
        {sunglassesList.map((product) => (
          <div
            key={product.id}
            className={`sunglasses-card ${activeCard === product.id ? "active" : ""}`}
          >
            <img
              src={product.img}
              alt={product.name}
              className="sunglasses-image"
              onClick={() => handleClick(product)}
            />
            <h3 className="sunglasses-name">{product.name}</h3>
            <p className="sunglasses-price">
              {product.price} <span className="old-price">{product.oldPrice}</span>
            </p>
            <p className="discount">{product.discount}</p>

            <div className="btn-group">
              <button className="buy-btn" onClick={() => handleBuyNow(product)}>
                Buy Now
              </button>
              <button className="cart-btn" onClick={() => handleAddToCart(product)}>
                Add to Cart
              </button>
              <button className="wishlist-btn">Wishlist</button>
            </div>
          </div>
        ))}
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

export default Sunglasses;
