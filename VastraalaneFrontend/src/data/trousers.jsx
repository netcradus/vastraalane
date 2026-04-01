import React, { useState } from "react";
import "../scss/_trousers.scss";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CustomModal from "../Sidebar/CustomModal";  // ✅ Import Modal

// Images import
import AdidasBeige from "../assets/Adida s Beige Classic Embroidery Logo Premium Trackpant - Copy.png";
import AdidasBlack1 from "../assets/Adida s Black Classic Embroidery Logo Premium Trackpant - Copy (2).png";
import AdidasBlack2 from "../assets/Adida s Black Embroidery Logo Premium Trackpant - Copy (2).png";
import AdidasDarkGrey from "../assets/Adida s Dark Grey Embroidery Logo Premium Trackpant.png";
import AdidasLightGrey from "../assets/Adida s Light Grey Embroidery Logo Premium Trackpant.png";
import AdidasOlive from "../assets/Adida s Olive Embroidery Logo Premium Trackpant.png";
import AdidasPremium1 from "../assets/Adida s Premium Logo Designer Track Beige (312).png";
import AdidasPremium2 from "../assets/Adida s Premium Logo Designer Track Beige (3122).png";
import ArmaniBlack from "../assets/Arman i Exchange Black Logo Patch Imported Trackpant With Carry Bag.png";
import ArmaniGrey from "../assets/Arman i Exchange Grey Logo Patch Imported Trackpant With Carry Bagg - Copy (2).png";
import NikeBlack from "../assets/Nik e Black Embroidery Logo Premium Trackpant.png";
import NikeWatch from "../assets/NIK E WATCH 2339.png";
import ZaraBlack from "../assets/Zar a Black Stripes Premium Classic Linen Pant.png";
import ZaraCream from "../assets/Zar a Cream Stripes Premium Classic Linen Pant.png";
import ZaraGrey from "../assets/Zar a Grey Stripes Premium Classic Linen Pant.png";

const trackpants = [
  { id: 1, name: "Adidas Beige Classic Embroidery Logo Premium Trackpant", image: AdidasBeige, price: "₹1,200", oldPrice: "₹12,500", discount: "74% off" },
  { id: 2, name: "Adidas Black Classic Embroidery Logo Premium Trackpant", image: AdidasBlack1, price: "₹1,000", oldPrice: "₹11,000", discount: "72% off" },
  { id: 3, name: "Adidas Black Embroidery Logo Premium Trackpant", image: AdidasBlack2, price: "₹1,900", oldPrice: "₹10,500", discount: "72% off" },
  { id: 4, name: "Adidas Dark Grey Embroidery Logo Premium Trackpant", image: AdidasDarkGrey, price: "₹1,100", oldPrice: "₹12,000", discount: "74% off" },
  { id: 5, name: "Adidas Light Grey Embroidery Logo Premium Trackpant", image: AdidasLightGrey, price: "₹1,800", oldPrice: "₹9,500", discount: "71% off" },
  { id: 6, name: "Adidas Olive Embroidery Logo Premium Trackpant", image: AdidasOlive, price: "₹,300", oldPrice: "₹12,200", discount: "73% off" },
  { id: 7, name: "Adidas Premium Logo Designer Track Beige (312)", image: AdidasPremium1, price: "₹1,600", oldPrice: "₹13,000", discount: "72% off" },
  { id: 8, name: "Adidas Premium Logo Designer Track Beige (3122)", image: AdidasPremium2, price: "₹1,400", oldPrice: "₹12,500", discount: "72% off" },
  { id: 9, name: "Armani Exchange Black Logo Patch Imported Trackpant", image: ArmaniBlack, price: "₹1,200", oldPrice: "₹15,000", discount: "72% off" },
  { id: 10, name: "Armani Exchange Grey Logo Patch Imported Trackpant", image: ArmaniGrey, price: "₹1,000", oldPrice: "₹14,500", discount: "72% off" },
  { id: 11, name: "Nike Black Embroidery Logo Premium Trackpant", image: NikeBlack, price: "₹2,700", oldPrice: "₹13,000", discount: "72% off" },
  { id: 12, name: "Nike Watch Edition 2339", image: NikeWatch, price: "₹6,500", oldPrice: "₹2,000", discount: "74% off" },
  { id: 13, name: "Zara Black Stripes Premium Classic Linen Pant", image: ZaraBlack, price: "₹2,500", oldPrice: "₹9,000", discount: "72% off" },
  { id: 14, name: "Zara Cream Stripes Premium Classic Linen Pant", image: ZaraCream, price: "₹2,760", oldPrice: "₹9,200", discount: "72% off" },
  { id: 15, name: "Zara Grey Stripes Premium Classic Linen Pant", image: ZaraGrey, price: "₹2289", oldPrice: "₹9,400", discount: "72% off" },
];

const priceIncrement = Number(process.env.REACT_APP_PRODUCT_PRICE);
const trackpantsList = trackpants.map(trackpant => {
  const numericPrice = Number(trackpant.price.replace(/[₹,]/g, ""));
  const updatedPrice = numericPrice + priceIncrement;
  return {
    ...trackpant,
    price: `₹${updatedPrice.toLocaleString("en-IN")}`
  };
});

const Trousers = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart(); 
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [popup, setPopup] = useState("");
  const [showConfirm, setShowConfirm] = useState(false); // ✅ modal state

  const showPopup = (message) => {
    setPopup(message);
    setTimeout(() => setPopup(""), 2000);
  };

  const handleAddToCart = (product) => {
    addToCart({ ...product, quantity });
    showPopup(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (selectedProduct) {
      setShowConfirm(true); // ✅ open modal instead of direct navigate
    }
  };

  const confirmPurchase = () => {
    setShowConfirm(false);
    navigate("/customer-details", { state: { product: selectedProduct } });
  };

  // Product list view
  if (!selectedProduct) {
    return (
      <div className="trousers-page">
        {popup && <div className="popup">{popup}</div>}
        <h2 className="page-title">Trousers Collection</h2>
        <div className="trousers-grid">
          {trackpantsList.map((item) => (
            <div
              key={item.id}
              className="trousers-card"
              onClick={() => setSelectedProduct(item)}
            >
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <p className="price">
                ₹{item.price} <span className="old-price">₹{item.oldPrice}</span>
              </p>
              <p className="discount">{item.discount}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Product detail view
  return (
    <div className="product-detail">
      {popup && <div className="popup">{popup}</div>}
      <button className="back-btn" onClick={() => setSelectedProduct(null)}>
        ← Back
      </button>

      <div className="detail-content">
        <div className="detail-left">
          <img src={selectedProduct.image} alt={selectedProduct.name} />
        </div>

        <div className="detail-right">
          <h2>{selectedProduct.name}</h2>
          <p className="price">
            ₹{selectedProduct.price}{" "}
            <span className="old-price">₹{selectedProduct.oldPrice}</span>{" "}
            <span className="discount">{selectedProduct.discount}</span>
          </p>

          {/* Quantity */}
          <div className="quantity">
            <label>Quantity:</label>
            <div className="qty-box">
              <button onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>
                -
              </button>
              <input type="number" value={quantity} readOnly />
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="detail-actions">
            <button className="btn-cart" onClick={() => handleAddToCart(selectedProduct)}>
              Add to Cart
            </button>
            <button
              className="btn-buy"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
          </div>

          {/* ✅ Extra Information */}
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

      {/* ✅ Related Items Section */}
      <div className="related-items">
        <h3>Related Trousers</h3>
        <div className="related-grid">
          {trackpantsList
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

export default Trousers;
