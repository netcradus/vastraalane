import { useCart } from "../context/CartContext";
import "../scss/CartPage.scss";
import { useNavigate } from "react-router-dom";
import CustomModal from "../Sidebar/CustomModal";
import React, { useState, useEffect } from "react";

const CartPage = () => {
  // single useCart call
  const { cart, removeFromCart, clearCart } = useCart();

  // calculate total
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  // If user wants to proceed the whole cart, we open confirm for full cart
  const handleProceedToBuy = () => {
    setSelectedProduct(null); // null => whole cart
    setShowConfirm(true);
  };

  const confirmPurchase = () => {
    setShowConfirm(false);
    // pass full cart to customer details
    navigate("/customer-details", { state: { product: cart } });
  };

  // 🔹 Auto clear cart every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      clearCart();
      console.log("Cart cleared automatically after 5 minutes");
    }, 300000); // 300,000 ms = 5 minutes

    return () => clearInterval(interval); // cleanup on unmount
  }, [clearCart]);

  return (
    <div className="cart-page">
      <h1 className="cart-title">🛒 Your Shopping Cart</h1>

      {cart.length > 0 ? (
        <div className="cart-container">
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item._id} className="cart-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-img"
                />

                <div className="cart-item-details">
                  <h2 className="cart-item-name">{item.name}</h2>
                  <p className="cart-item-size">Size: {item.size}</p>
                  <p className="cart-item-price">
                    ₹{item.price} x {item.quantity} ={" "}
                    <strong>₹{item.price * item.quantity}</strong>
                  </p>
                </div>

                <div className="cart-item-actions">
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <aside className="cart-summary">
            <h2>Order Summary</h2>
            <p>
              Items: <strong>{cart.length}</strong>
            </p>
            <p>
              Subtotal: <strong>₹{total}</strong>
            </p>
            <button className="checkout-btn" onClick={handleProceedToBuy}>
              Proceed to Buy
            </button>
          </aside>
        </div>
      ) : (
        <p className="empty-cart">Your cart is empty 🛍️</p>
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
