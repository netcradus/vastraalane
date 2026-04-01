import React, { useEffect } from "react";
import { useCart } from "../context/CartContext";
import "../scss/WishlistPage.scss";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, addToCart } = useCart();

  return (
    <div className="wishlist-page" style={{ padding: "20px" }}>
      <h1 style={{ marginTop: "100px" }}>Your Wishlist</h1>

      {wishlist.length > 0 ? (
        <ul>
          {wishlist.map((item) => (
            <li key={item._id} style={{ marginBottom: "20px" }}>
              <img src={item.image} alt={item.name} width="50" />
              {item.name} - ₹{item.price} 
              <button
                style={{ marginLeft: "10px" }}
                onClick={() => removeFromWishlist(item._id)}
              >
                Remove
              </button>
              <button
                style={{ marginLeft: "10px" }}
                onClick={() => addToCart(item)}
              >
                Add to Cart
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Your wishlist is empty</p>
      )}
    </div>
  );
};

export default WishlistPage;
