import React, { useState } from "react";
import "../scss/_flipflops.scss";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import CustomModal from "../Sidebar/CustomModal";
// ✅ Flipflops Data
import FlipFlop1 from "../assets/Adiddas Yeezy Slides Bone Ua.png";
import FlipFlop2 from "../assets/Adiddas Yeezy Slides flax Uaa - Copy (2).png";
import FlipFlop3 from "../assets/air max 1 flip flop grey green - Copy (2).png";
import FlipFlop4 from "../assets/Dior_Riviera_Dway_Platform_Raffia_Slides_For_Women_With_OG_Box_And_Carry_Bag_Grey_5099-10 - Copy (2).png";
import FlipFlop5 from "../assets/fat tires slide sale.png";
import FlipFlop6 from "../assets/GUCCI_GG.jpg";

const flipflops = [
  { id: 1, name: "Premium Bone Comfort Slides", price: 1500, image: FlipFlop1 },
  { id: 2, name: "Premium Flax Casual Slides", price: 1600, image: FlipFlop2 },
  { id: 3, name: "Grey Green Sport Slides", price: 2000, image: FlipFlop3 },
  { id: 4, name: "Luxury Platform Resort Slides", price: 2799, image: FlipFlop4 },
  { id: 5, name: "Classic Everyday Comfort Slides", price: 1200, image: FlipFlop5 },
  { id: 6, name: "Premium Signature Slides", price: 1500, image: FlipFlop6 },
  
];

const priceIncrement = Number(process.env.REACT_APP_PRODUCT_PRICE || 0);
const flipflopsList = flipflops.map(flipflop => ({
  ...flipflop,
  price: flipflop.price + priceIncrement
}));

function Flipflops() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart, addToWishlist } = useCart();
  const [popup, setPopup] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const showPopup = (message) => {
    setPopup(message);
    setTimeout(() => setPopup(""), 2000);
  };

  const handleAddToWishlist = (product) => {
    addToWishlist(product);
    showPopup(`${product.name} added to Wishlist!`);
  };

  const handleBuyNow = () => {
    if (selectedProduct) {
      setShowConfirm(true);
    }
  };

  const confirmPurchase = () => {
    setShowConfirm(false);
    navigate("/customer-details", { state: { product: selectedProduct } });
  };

  if (!selectedProduct) {
    return (
      <div className="flipflops-container">
        <h2 className="flipflops-title">Flipflops Collection</h2>
        <div className="flipflops-grid">
          {flipflopsList.map((item) => (
            <div
              key={item.id}
              className="product-card"
              onClick={() => setSelectedProduct(item)}
            >
              <img src={item.image} alt={item.name} />
              <p className="product-name">{item.name}</p>
              <p className="price">₹{item.price}</p>
            </div>
          ))}
        </div>
        {popup && <div className="popup">{popup}</div>}
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="detail-content">
        <div className="detail-left">
          <img src={selectedProduct.image} alt={selectedProduct.name} />
        </div>
        <div className="detail-right">
          <h2>{selectedProduct.name}</h2>
          <p className="price">₹{selectedProduct.price}</p>

          <div className="size-options">
            <h4>Size:</h4>
            <div className="sizes">
              <button>UK 6/EURO 40</button>
              <button>UK 7/EURO 41</button>
              <button>UK 8/EURO 42</button>
              <button>UK 9/EURO 43</button>
            </div>
          </div>

          <div className="quantity">
            <h4>Quantity:</h4>
            <div>
              <button>-</button>
              <input type="number" value={1} readOnly />
              <button>+</button>
            </div>
          </div>

          <div className="detail-actions">
            {/* <button
              className="btn-wishlist"
              onClick={() => handleAddToWishlist(selectedProduct)}
            >
              ♡ Add to Wishlist
            </button> */}
            <button
              className="btn-cart"
              onClick={() => addToCart(selectedProduct)}
            >
              Add to Cart
            </button>
            <button className="btn-buy" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>

          {popup && <div className="popup">{popup}</div>}
        </div>
      </div>

      <CustomModal
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={confirmPurchase}
  product={selectedProduct}
/>

    </div>
  );
}

export default Flipflops;