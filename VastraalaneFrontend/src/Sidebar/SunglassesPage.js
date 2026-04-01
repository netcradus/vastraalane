import React, { useState } from "react";
import "../scss/_SunglassesPage.scss";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import CustomModal from "../Sidebar/CustomModal";
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
  { id: 1, name: "Dolce & Gabbana 5011", img: DolceGabbana, price: "₹2499", oldPrice: "₹7,000", discount: "50% off" },
  { id: 2, name: "Gucci 10318", img: Gucci, price: "₹1299", oldPrice: "₹8,500", discount: "49% off" },
  { id: 3, name: "Marc Jacobs 515", img: MarcJacobs515, price: "₹1899", oldPrice: "₹7,800", discount: "50% off" },
  { id: 4, name: "Tom Ford 23533", img: TomFord, price: "₹1199", oldPrice: "₹10,000", discount: "48% off" },
  { id: 5, name: "Balmain 28015 Black", img: BalmainBlack, price: "₹1599", oldPrice: "₹9,000", discount: "49% off" },
  { id: 6, name: "Balmain 28015 Brown", img: BalmainBrown, price: "₹1599", oldPrice: "₹9,200", discount: "50% off" },
  { id: 7, name: "Balmain 28015 Tiger Brown", img: BalmainTigerBrown, price: "₹1799", oldPrice: "₹9,300", discount: "48% off" },
  { id: 8, name: "Balmain 28015 Tiger Green", img: BalmainTigerGreen, price: "₹1799", oldPrice: "₹9,300", discount: "48% off" },
  { id: 9, name: "Boss Ice 0618", img: BossIce, price: "₹1299", oldPrice: "₹6,600", discount: "50% off" },
  { id: 10, name: "Burberry 8769 Black Silver Mercury", img: Burberry, price: "₹1499", oldPrice: "₹11,000", discount: "50% off" },
  { id: 11, name: "Calvin Klein Y06 Grey Black", img: CalvinKlein, price: "₹1799", oldPrice: "₹7,500", discount: "49% off" },
  { id: 12, name: "Cartier Gold Black 3072", img: Cartier1, price: "₹1999", oldPrice: "₹14,000", discount: "50% off" },
  { id: 13, name: "Cartier Gold Black 3072", img: Cartier2, price: "₹1999", oldPrice: "₹14,000", discount: "50% off" },
  { id: 14, name: "David Beckham 2208 Water Brown Green", img: DavidBrownGreen, price: "₹1199", oldPrice: "₹8,400", discount: "50% off" },
  { id: 15, name: "David Beckham Black 220", img: DavidBlack1, price: "₹1199", oldPrice: "₹8,400", discount: "50% off" },
  { id: 16, name: "David Beckham Black 220", img: DavidBlack2, price: "₹1199", oldPrice: "₹8,400", discount: "50% off" },
  { id: 17, name: "Dior WMNS 8875 Black Blue DC", img: Dior, price: "₹1199", oldPrice: "₹11,800", discount: "50% off" },
  { id: 18, name: "Jacques Marie Mage 3959 Black Plano", img: Jacques, price: "₹1299", oldPrice: "₹12,500", discount: "50% off" },
  { id: 19, name: "Loewe 8419 Grey", img: Loewe1, price: "₹1499", oldPrice: "₹9,000", discount: "50% off" },
  { id: 20, name: "Loewe 8419 Grey", img: Loewe2, price: "₹1499", oldPrice: "₹9,000", discount: "50% off" },
  { id: 21, name: "Louis Vuitton Silver Blue 2608", img: LouisVuitton, price: "₹1499", oldPrice: "₹15,000", discount: "50% off" },
  { id: 22, name: "Marc Jacobs 510 Gold Black", img: MarcJacobsGoldBlack, price: "₹1999", oldPrice: "₹8,000", discount: "50% off" },
  { id: 23, name: "Marc Jacobs Black", img: MarcJacobsBlack, price: "₹1999", oldPrice: "₹8,000", discount: "50% off" },
  { id: 24, name: "Marc Jacobs Gold-Multi Luxury Shades 9025", img: MarcJacobsLuxury, price: "₹1499", oldPrice: "₹9,000", discount: "50% off" },
  { id: 25, name: "Mont Blanc Y07 Black", img: MontBlanc, price: "₹1099", oldPrice: "₹1400", discount: "50% off" },
  { id: 26, name: "Oakley 0221 Gold Yellow", img: Oakley, price: "₹1299", oldPrice: "₹6,600", discount: "50% off" },
  { id: 27, name: "Prada 21 Grey Blue", img: Prada, price: "₹1799", oldPrice: "₹11,500", discount: "50% off" },
  { id: 28, name: "Rayban 04 Lite Grey Black", img: Rayban, price: "₹1499", oldPrice: "₹7,000", discount: "50% off" },
  { id: 29, name: "Suocchi 4413 Gold Yellow", img: Suocchi, price: "₹1999", oldPrice: "₹6,000", discount: "50% off" },
  { id: 30, name: "Versace 127 Gold Blue", img: Versace, price: "₹1199", oldPrice: "₹12,400", discount: "50% off" },
];

const priceIncrement = Number(process.env.REACT_APP_PRODUCT_PRICE || 0);
const sunglassesList = sunglasses.map((sunglass) => {
  const numericPrice = Number(sunglass.price.replace(/[₹,]/g, ""));
  const updatedPrice = numericPrice + priceIncrement;

  return {
    ...sunglass,
    price: `₹${updatedPrice.toLocaleString("en-IN")}`,
  };
});

const SunglassesPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const { addToCart, addToWishlist, wishlist } = useCart();
  const navigate = useNavigate();

  const handleProductClick = (prod) => setSelectedProduct(prod);
  const handleBack = () => setSelectedProduct(null);

  const getNumericPrice = (priceStr) => {
    if (!priceStr) return 0;
    return Number(priceStr.toString().replace(/[^0-9.]/g, ""));
  };

  // ✅ Buy Now → Open modal
  const handleBuyNow = () => {
    setShowConfirm(true);
  };

  // ✅ Confirm Purchase → Redirect
  const confirmPurchase = () => {
    setShowConfirm(false);
    navigate("/customer-details", {
      state: { product: { ...selectedProduct, quantity: 1 } },
    });
  };

  const relatedProducts = selectedProduct
    ? sunglassesList.filter((p) => p.id !== selectedProduct.id)
    : [];

  return (
    <div className="sunglasses-page">
      {!selectedProduct ? (
        <>
          <h2 className="page-title">Sunglasses Collection</h2>
          <div className="sunglasses-grid">
            {sunglassesList.map((prod) => (
              <div
                key={prod.id}
                className="sunglasses-card"
                onClick={() => handleProductClick(prod)}
              >
                <div className="sunglasses-image">
                  <img src={prod.img} alt={prod.name} />
                </div>
                <h4>{prod.name}</h4>
                <p className="old-price">{prod.oldPrice}</p>
                <p className="current-price">{prod.price}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="sunglasses-details">
          <button className="back-btn" onClick={handleBack}>
            &larr; Back
          </button>

          <div className="details-container">
            <div className="details-image">
              <img src={selectedProduct.img} alt={selectedProduct.name} />
            </div>
            <div className="details-info">
              <h2>{selectedProduct.name}</h2>
              <p className="old-price">{selectedProduct.oldPrice}</p>
              <p className="current-price">{selectedProduct.price}</p>

              {/* 🔹 Action Buttons */}
              <div className="product-action-buttons">
                <button className="buy-btn" onClick={handleBuyNow}>
                  Buy Now
                </button>

                <button
                  className="cart-btn"
                  onClick={() =>
                    addToCart({
                      id: selectedProduct.id,
                      name: selectedProduct.name,
                      price: getNumericPrice(selectedProduct.price),
                      quantity: 1,
                      image: selectedProduct.img,
                    })
                  }
                >
                  Add to Cart
                </button>

                <button
                  className="wishlist-btn"
                  onClick={() => addToWishlist(selectedProduct)}
                >
                  {wishlist.some((w) => w.id === selectedProduct.id)
                    ? "Remove from Wishlist"
                    : "Wishlist"}
                </button>
              </div>

              <div className="policy-box">
                <h3>Why Shop With Us?</h3>
                <ul>
                  <li>✔ 7 Days Easy Exchange Policy</li>
                  <li>✔ Free Shipping on All Orders</li>
                  <li>✔ Good Quality Material</li>
                  <li>✔ Secure Online Payments</li>
                  <li>✔ 24/7 Customer Support</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ✅ Confirmation Modal */}
          {showConfirm && selectedProduct && (
            <CustomModal
              isOpen={showConfirm}
              onClose={() => setShowConfirm(false)}
              onConfirm={confirmPurchase}
              product={selectedProduct}
            />
          )}

          {relatedProducts.length > 0 && (
            <>
              <h3>Related Products</h3>
              <div className="related-grid">
                {relatedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="related-card"
                    onClick={() => handleProductClick(p)}
                  >
                    <img src={p.img} alt={p.name} />
                    <h4>{p.name}</h4>
                    <p className="current-price">{p.price}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SunglassesPage;
