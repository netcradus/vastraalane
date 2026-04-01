import React, { useState } from "react";
import "../scss/_tshirts.scss";
import { FaCheckCircle } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import CustomModal from "../Sidebar/CustomModal"; 

// 🔽 Images import
import VersaceBlue from "../assets/Versace Couture Petrol Blue Back Print Imported Polo T-Shirtt.png";
import VersaceOlive from "../assets/Versace Couture Olive Back Print Imported Pol0o T-Shirt.png";
import Tshirt2 from "../assets/tshirt2.jpg";
import Tshirt1 from "../assets/tshirt.jpg";
import TommyTeal from "../assets/Tommy_Hilfiger Teal Polo.jpg";
import TommyOffwhite from "../assets/Tommy_Hilfiger Off-white.jpg";
import TommyNavy from "../assets/Tommy_Hilfiger Navy Polo.jpg";
import TommyWhite from "../assets/Tommy Hilfige r Premium 220gsm Interlock Cotton Lycra Round Neck Tshirt White 2081.jpg";
import TommyBlack from "../assets/Tommy Hilfige r Black Premium Polo Tshirt With 240 Gsm Interlock Cotton Lycra Fabric With Collar Design Sleeve Logo 2569.png";
import RalphPink from "../assets/Ralph_Lauren Polo Pink Oxford Lycra Embroidery Logo Premium Shirt F2757-PI - Copy.png";
import RalphMustard from "../assets/Ralph_Lauren Polo Mustard Oxford Lycra Embroidery Logo Premium Shirt F2757-MU.png";
import RalphBlack from "../assets/Ralph_Lauren Polo Black Oxford Lycra Embroidery Logo Premium Shirt F2757-BL.png";
import RalphWine from "../assets/Ralph Lauren Cotton Wine Premium Shirt.png";
import RalphWhite from "../assets/Ralph Lauren Cotton White Premium Shirt.png";
import RalphMilange from "../assets/Ralph Lauren Cotton Milange Premium Shirt.png";
import RalphCottonBlack from "../assets/Ralph Lauren Cotton Black Premium Shirt.png";
import LacosteWhite1 from "../assets/Lacost e White Premium Cotton Lycra Pique fabric Polo Tshirt with Sleeves 2836.png";
import LacosteWhite2 from "../assets/Lacost e White Premium Cotton Lycra Pique fabric Polo Tshirt with Shoulder Strip Design and Embroidered Logo 2843.png";
import LacosteSky from "../assets/Lacost e Sky Premium Polo T shirt With 240 gsm interlock cotton lycra fabric and Collar Design with Embroidered Logo 2551 - Copy (2).jpg";
import LacosteOffwhite from "../assets/Lacost e Offwhite Premium Cotton Lycra Pique fabric Polo Tshirt with Front Printed Design and Embroidered Logo Zip Style 2841.jpg";
import LacosteNavy from "../assets/Lacost e Navy Premium Cotton Lycra Pique fabric Polo Tshirt with Collar Design and Embroidered Logo Pocket Style 2840 - Copy (2).png";
import LacosteMaroon from "../assets/Lacost e Maroon Premium Polo T shirt With 240 gsm interlock cotton lycra fabric and Collar Design with Embroidered Logo 2555.png";
import LacosteBlack from "../assets/Lacost e Black Premium Cotton Lycra Pique fabric Polo Tshirt with Sleeves Design and Embroidered Logo 2838 - Copy.png";
import LacosteBeige from "../assets/Lacost e Beige Premium Cotton Lycra Pique fabric Polo Tshirt with Collar Design and Embroidered Logo Pocket Style 2839 - Copy (2).png";
import GucciWhite from "../assets/Gucc i White Premium Round Neck Printed T-shirt F2666-WH1.png";
import GucciWhiteShirt from "../assets/Gucc i Monogram Premium White Shirt With Brand Box Packing and carry bag F2718-WH - Copy.jpg";
import GucciBlackShirt1 from "../assets/Gucc i Monogram Premium Black Shirt With Brand Box_Packing and carry bag F2718-BL - Copy (2).png";
import GucciBlackTshirt from "../assets/Gucc i Black Premium Round Neck Printed T-shirt F2666-BL2.png";
import GucciBeigeTshirt from "../assets/Gucc i Beige Premium Round Neck Printed T-shirt F2666-BE2.png";
import DolceWhite from "../assets/Dolce&Gabbana White Reflective Logo Shirt With Premium Box Packing.png";
import DolceBlack1 from "../assets/Dolce&Gabbana Black Reflective Logo Shirt With Premium Box Packing - Copy.png";
import DiorWhite from "../assets/Christian Dio r White Premium Imported Japanese Fabric Printed Tracksuit with Brand Box and Carry Bag 2639 - Copy.png";

// 🔽 Products array
const tshirts = [
  { id: 1, name: "Premium Polo – Petrol Blue Back Print", price: "₹1740", oldPrice: "₹3000", discount: "17% off", image: VersaceBlue },
  { id: 2, name: "Premium Polo – Olive Back Print", price: "₹1800", oldPrice: "₹3200", discount: "19% off", image: VersaceOlive },

  { id: 3, name: "Classic T-Shirt – Casual Fit 02", price: "₹1180", oldPrice: "₹1500", discount: "20% off", image: Tshirt2 },
  { id: 4, name: "Classic T-Shirt – Casual Fit 01", price: "₹1300", oldPrice: "₹1600", discount: "19% off", image: Tshirt1 },

  { id: 5, name: "Premium Polo – Teal Edition", price: "₹2700", oldPrice: "₹3500", discount: "14% off", image: TommyTeal },
  { id: 6, name: "Premium Polo – Off White Edition", price: "₹1799", oldPrice: "₹3600", discount: "14% off", image: TommyOffwhite },
  { id: 7, name: "Premium Polo – Navy Edition", price: "₹1799", oldPrice: "₹3700", discount: "14% off", image: TommyNavy },
  { id: 8, name: "Premium Polo – White Edition", price: "₹1740", oldPrice: "₹3200", discount: "13% off", image: TommyWhite },
  { id: 9, name: "Premium Polo – Black Edition", price: "₹1895", oldPrice: "₹3300", discount: "12% off", image: TommyBlack },

  { id: 10, name: "Luxury Shirt – Pink Edition", price: "₹1289", oldPrice: "₹4000", discount: "15% off", image: RalphPink },
  { id: 11, name: "Luxury Shirt – Mustard Edition", price: "₹1450", oldPrice: "₹4100", discount: "16% off", image: RalphMustard },
  { id: 12, name: "Luxury Shirt – Black Edition", price: "₹1500", oldPrice: "₹4200", discount: "17% off", image: RalphBlack },
  { id: 13, name: "Luxury Shirt – Wine Edition", price: "₹1650", oldPrice: "₹4300", discount: "17% off", image: RalphWine },
  { id: 14, name: "Luxury Shirt – White Edition", price: "₹3600", oldPrice: "₹4350", discount: "17% off", image: RalphWhite },
  { id: 15, name: "Luxury Shirt – Milange Edition", price: "₹2650", oldPrice: "₹4400", discount: "17% off", image: RalphMilange },
  { id: 16, name: "Luxury Shirt – Cotton Black Edition", price: "₹1700", oldPrice: "₹4450", discount: "17% off", image: RalphCottonBlack },

  { id: 17, name: "Premium Polo – White Classic", price: "₹2300", oldPrice: "₹4000", discount: "18% off", image: LacosteWhite1 },
  { id: 18, name: "Premium Polo – White Stripe Edition", price: "₹1350", oldPrice: "₹4050", discount: "17% off", image: LacosteWhite2 },
  { id: 19, name: "Premium Polo – Sky Blue Edition", price: "₹1400", oldPrice: "₹4100", discount: "17% off", image: LacosteSky },
  { id: 20, name: "Premium Polo – Off White Edition", price: "₹1450", oldPrice: "₹4150", discount: "17% off", image: LacosteOffwhite },
  { id: 21, name: "Premium Polo – Navy Edition", price: "₹1789", oldPrice: "₹4200", discount: "17% off", image: LacosteNavy },
  { id: 22, name: "Premium Polo – Maroon Edition", price: "₹1789", oldPrice: "₹4250", discount: "17% off", image: LacosteMaroon },
  { id: 23, name: "Premium Polo – Black Classic", price: "₹1599", oldPrice: "₹4300", discount: "17% off", image: LacosteBlack },
  { id: 24, name: "Premium Polo – Beige Edition", price: "₹1999", oldPrice: "₹4350", discount: "16% off", image: LacosteBeige },

  { id: 25, name: "Premium T-Shirt – White Edition", price: "₹1479", oldPrice: "₹4600", discount: "13% off", image: GucciWhite },
  { id: 26, name: "Premium Shirt – White Monogram Style", price: "₹1899", oldPrice: "₹4800", discount: "12% off", image: GucciWhiteShirt },
  { id: 27, name: "Premium Shirt – Black Monogram Style", price: "₹1489", oldPrice: "₹4900", discount: "13% off", image: GucciBlackShirt1 },
  { id: 28, name: "Premium T-Shirt – Black Edition", price: "₹1589", oldPrice: "₹5000", discount: "13% off", image: GucciBlackTshirt },
  { id: 29, name: "Premium T-Shirt – Beige Edition", price: "₹1499", oldPrice: "₹5050", discount: "13% off", image: GucciBeigeTshirt },

  { id: 30, name: "Luxury Shirt – White Premium", price: "₹1799", oldPrice: "₹5200", discount: "13% off", image: DolceWhite },
  { id: 31, name: "Luxury Shirt – Black Premium", price: "₹1150", oldPrice: "₹5250", discount: "13% off", image: DolceBlack1 },
  { id: 32, name: "Premium Shirt – White Classic", price: "₹1700", oldPrice: "₹5400", discount: "13% off", image: DiorWhite },
];

const priceIncrement = Number(process.env.REACT_APP_PRODUCT_PRICE);
const tshirtsList = tshirts.map(tshirt => {
  const numericPrice = Number(tshirt.price.replace(/[₹,]/g, ""));
  const updatedPrice = numericPrice + priceIncrement;
  return {
    ...tshirt,
    price: `₹${updatedPrice.toLocaleString("en-IN")}`
  };
});

const Tshirts = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [popup, setPopup] = useState("");
  const [showConfirm, setShowConfirm] = useState(false); // ✅ Modal control

  const { addToCart, addToWishlist } = useCart();
  const navigate = useNavigate();

  const showPopup = (message) => {
    setPopup(message);
    setTimeout(() => setPopup(""), 2000);
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    const payload = {
      productId: selectedProduct.id,
      quantity,
      size: selectedSize,
    };

    try {
      addToCart(payload);
      showPopup(`✅ ${selectedProduct.name} added to cart!`);
    } catch (err) {
      console.error(err);
      showPopup(`❌ Failed to add ${selectedProduct.name} to cart.`);
    }
  };

  // ✅ Instead of navigating directly → open modal
  const handleBuyNow = () => {
    if (!selectedProduct) return;
    setShowConfirm(true);
  };

  // ✅ Confirm purchase → navigate
  const confirmPurchase = () => {
    setShowConfirm(false);
    navigate("/customer-details", { state: { product: selectedProduct } });
  };

  const handleAddToWishlist = () => {
    if (!selectedProduct) return;
    addToWishlist(selectedProduct);
    showPopup(`❤️ ${selectedProduct.name} added to wishlist!`);
  };

  return (
    <div className="tshirts-page">
      {popup && <div className="popup">{popup}</div>}

      <h2 className="page-title">Premium T-Shirts & Shirts</h2>

      {/* Product Grid View */}
      {!selectedProduct ? (
        <div className="tshirts-grid">
          {tshirtsList.map((item) => (
            <div
              key={item.id}
              className="tshirt-card"
              onClick={() => setSelectedProduct(item)}
            >
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <p className="price">
                {item.price} <span className="old-price">{item.oldPrice}</span>
              </p>
              <p className="discount">{item.discount}</p>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Product Detail */}
          <div className="product-detail">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="detail-image"
            />
            <div className="detail-info">
              <h2>{selectedProduct.name}</h2>
              <p className="price">
                {selectedProduct.price}{" "}
                <span className="old-price">{selectedProduct.oldPrice}</span>{" "}
                <span className="discount">{selectedProduct.discount}</span>
              </p>

              {/* Size Options */}
              <div className="size-options">
                <h4>Size:</h4>
                <div className="sizes">
                  {["S", "M", "L", "XL"].map((size) => (
                    <button
                      key={size}
                      className={selectedSize === size ? "selected" : ""}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="quantity">
                <h4>Quantity:</h4>
                <div className="qty-box">
                  <button
                    onClick={() =>
                      setQuantity(quantity > 1 ? quantity - 1 : 1)
                    }
                  >
                    -
                  </button>
                  <input type="number" value={quantity} readOnly />
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="product-actions">
                <button className="btn-cart" onClick={handleAddToCart}>
                  Add to Cart
                </button>
                <button className="btn-wishlist" onClick={handleAddToWishlist}>
                  Wishlist
                </button>
                <button className="btn-buy" onClick={handleBuyNow}>
                  Buy Now
                </button>
              </div>

              {/* Product Details */}
              <div className="product-details">
                <h4>Product Details</h4>
                <ul>
                  <li><FaCheckCircle className="tick-icon" /> Free Delivery on all orders</li>
                  <li><FaCheckCircle className="tick-icon" /> 14 Days Return / Replacement Policy</li>
                  <li><FaCheckCircle className="tick-icon" /> Material: 100% Premium Cotton</li>
                  <li><FaCheckCircle className="tick-icon" /> Care Instructions: Machine Wash Cold</li>
                  <li><FaCheckCircle className="tick-icon" /> Perfect for Casual & Formal Wear</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div className="related-products">
            <h3>Related Products</h3>
            <div className="related-grid">
              {tshirtsList
                .filter((item) => item.id !== selectedProduct.id)
                .slice(0, 4)
                .map((item) => (
                  <div
                    key={item.id}
                    className="related-card"
                    onClick={() => setSelectedProduct(item)}
                  >
                    <img src={item.image} alt={item.name} />
                    <h4>{item.name}</h4>
                    <p className="price">
                      {item.price}{" "}
                      <span className="old-price">{item.oldPrice}</span>
                    </p>
                    <p className="discount">{item.discount}</p>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}

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

export default Tshirts;
