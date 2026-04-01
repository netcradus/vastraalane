import React from "react";

function CartItem({ item, removeItem }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      borderBottom: "1px solid #ddd",
      padding: "10px 0"
    }}>
      <img 
        src={item.image} 
        alt={item.name} 
        style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
      />
      <div style={{ marginLeft: "20px", flex: 1 }}>
        <h3>{item.name}</h3>
        <p>₹{item.price}</p>
      </div>
      <button 
        onClick={() => removeItem(item.id)}
        style={{
          padding: "8px 12px",
          backgroundColor: "#ff4d4f",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Remove
      </button>
    </div>
  );
}

export default CartItem;
