import React from "react";
import "../scss/_customModal.scss";

function CustomModal({ isOpen, onClose, onConfirm, product }) {
  if (!isOpen) return null;

  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal">
        <h3>Confirm Purchase</h3>

        {product && product.length > 0 ? (
          <ul>
            {product.map((item) => (
              <li key={item._id || item.id}>
                {item.name} - ₹{item.price} x {item.quantity}
              </li>
            ))}
          </ul>
        ) : (
          <p>Are you sure you want to buy all product?</p>
        )}

        <div className="modal-buttons">
          <button className="confirm-btn" onClick={onConfirm}>Yes</button>
          <button className="cancel-btn" onClick={onClose}>No</button>
        </div>
      </div>
    </div>
  );
}


export default CustomModal;