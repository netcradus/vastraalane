import React, { useState } from "react";
import "../scss/_sunglasses.scss";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import CustomModal from "../Sidebar/CustomModal"; // ✅ Import modal

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
  { id: 1, name: "Dolce & Gabbana 5011", img: DolceGabbana, price: "₹1499", oldPrice: "₹7,000", discount: "50% off" },
  { id: 2, name: "Gucci 10318", img: Gucci, price: "₹1299", oldPrice: "₹8,500", discount: "49% off" },
  { id: 3, name: "Marc Jacobs 515", img: MarcJacobs515, price: "₹1899", oldPrice: "₹7,800", discount: "50% off" },
  { id: 4, name: "Tom Ford 23533", img: TomFord, price: "₹1199", oldPrice: "₹10,000", discount: "48% off" },
  { id: 5, name: "Balmain 28015 Black", img: BalmainBlack, price: "₹1299", oldPrice: "₹9,000", discount: "49% off" },
  { id: 6, name: "Balmain 28015 Brown", img: BalmainBrown, price: "₹1599", oldPrice: "₹9,200", discount: "50% off" },
  { id: 7, name: "Balmain 28015 Tiger Brown", img: BalmainTigerBrown, price: "₹1299", oldPrice: "₹9,300", discount: "48% off" },
  { id: 8, name: "Balmain 28015 Tiger Green", img: BalmainTigerGreen, price: "₹1399", oldPrice: "₹9,300", discount: "48% off" },
  { id: 9, name: "Boss Ice 0618", img: BossIce, price: "₹1299", oldPrice: "₹6,600", discount: "50% off" },
  { id: 10, name: "Burberry 8769 Black Silver Mercury", img: Burberry, price: "₹1499", oldPrice: "₹11,000", discount: "50% off" },
  { id: 11, name: "Calvin Klein Y06 Grey Black", img: CalvinKlein, price: "₹1799", oldPrice: "₹7,500", discount: "49% off" },
  { id: 12, name: "Cartier Gold Black 3072", img: Cartier1, price: "₹1999", oldPrice: "₹14,000", discount: "50% off" },
  { id: 13, name: "Cartier Gold Black 3072", img: Cartier2, price: "₹1299", oldPrice: "₹14,000", discount: "50% off" },
  { id: 14, name: "David Beckham 2208 Water Brown Green", img: DavidBrownGreen, price: "₹1299", oldPrice: "₹8,400", discount: "50% off" },
  { id: 15, name: "David Beckham Black 220", img: DavidBlack1, price: "₹1,199", oldPrice: "₹8,400", discount: "50% off" },
  { id: 16, name: "David Beckham Black 220", img: DavidBlack2, price: "₹1,199", oldPrice: "₹8,400", discount: "50% off" },
  { id: 17, name: "Dior WMNS 8875 Black Blue DC", img: Dior, price: "₹1299", oldPrice: "₹11,800", discount: "50% off" },
  { id: 18, name: "Jacques Marie Mage 3959 Black Plano", img: Jacques, price: "₹1299", oldPrice: "₹12,500", discount: "50% off" },
  { id: 19, name: "Loewe 8419 Grey", img: Loewe1, price: "₹1499", oldPrice: "₹19,000", discount: "50% off" },
  { id: 20, name: "Loewe 8419 Grey", img: Loewe2, price: "₹1,499", oldPrice: "₹9,000", discount: "50% off" },
  { id: 21, name: "Louis Vuitton Silver Blue 2608", img: LouisVuitton, price: "₹1,499", oldPrice: "₹15,000", discount: "50% off" },
  { id: 22, name: "Marc Jacobs 510 Gold Black", img: MarcJacobsGoldBlack, price: "₹1,999", oldPrice: "₹8,000", discount: "50% off" },
  { id: 23, name: "Marc Jacobs Black", img: MarcJacobsBlack, price: "₹1,999", oldPrice: "₹8,000", discount: "50% off" },
  { id: 24, name: "Marc Jacobs Gold-Multi Luxury Shades 9025", img: MarcJacobsLuxury, price: "₹1,499", oldPrice: "₹9,000", discount: "50% off" },
  { id: 25, name: "Mont Blanc Y07 Black", img: MontBlanc, price: "₹1,699", oldPrice: "₹1,400", discount: "50% off" },
  { id: 26, name: "Oakley 0221 Gold Yellow", img: Oakley, price: "₹1399", oldPrice: "₹1,600", discount: "50% off" },
  { id: 27, name: "Prada 21 Grey Blue", img: Prada, price: "₹1099", oldPrice: "₹1,500", discount: "50% off" },
  { id: 28, name: "Rayban 04 Lite Grey Black", img: Rayban, price: "₹1,499", oldPrice: "₹7,000", discount: "50% off" },
  { id: 29, name: "Suocchi 4413 Gold Yellow", img: Suocchi, price: "₹1,999", oldPrice: "₹6,000", discount: "50% off" },
  { id: 30, name: "Versace 127 Gold Blue", img: Versace, price: "₹2199", oldPrice: "₹12,400", discount: "50% off" },
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
            <img
              src={selectedProduct.img}
              alt={selectedProduct.name}
              className="detail-image"
            />
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
