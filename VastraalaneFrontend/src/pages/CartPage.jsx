import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CustomModal from "../Sidebar/CustomModal";
import "../scss/CartPage.scss";

const CartPage = () => {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const safeCart = Array.isArray(cart) ? cart : [];
  const total = safeCart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleProceedToBuy = () => {
    setSelectedProduct(null);
    setShowConfirm(true);
  };

  const confirmPurchase = () => {
    setShowConfirm(false);
    navigate("/customer-details", { state: { product: safeCart } });
  };

  return (
    <div className="cart-page">
      <h1 className="cart-title">Your Shopping Cart</h1>

      {safeCart.length > 0 ? (
        <div className="cart-container">
          <div className="cart-items">
            {safeCart.map((item) => (
              <div key={item._id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-img" />

                <div className="cart-item-details">
                  <h2 className="cart-item-name">{item.name}</h2>
                  <p className="cart-item-size">Size: {item.size || "Standard"}</p>
                  <p className="cart-item-price">
                    Rs {item.price} x {item.quantity} = <strong>Rs {item.price * item.quantity}</strong>
                  </p>
                </div>

                <div className="cart-item-actions">
                  <button className="remove-btn" onClick={() => removeFromCart(item._id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="cart-summary">
            <h2>Order Summary</h2>
            <p>
              Items: <strong>{safeCart.length}</strong>
            </p>
            <p>
              Subtotal: <strong>Rs {total}</strong>
            </p>
            <button className="checkout-btn" onClick={handleProceedToBuy}>
              Proceed to Buy
            </button>
          </aside>
        </div>
      ) : (
        <p className="empty-cart">Your cart is empty.</p>
      )}

      <CustomModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmPurchase}
        product={selectedProduct}
      />
    </div>
  );
};

export default CartPage;
