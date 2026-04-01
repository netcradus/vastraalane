import React from "react";
import { useCart } from "../context/CartContext";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, addToCart } = useCart();

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Wishlist</h1>
      {wishlist.length > 0 ? (
        <ul>
          {wishlist.map((item) => (
            <li key={item._id}>
              <img src={item.image} alt={item.name} width="50" />
              {item.name} - ₹{item.price} x {item.quantity} (Size: {item.size})
              <button onClick={() => addToCart(item)}>Add to Cart</button>
              <button onClick={() => removeFromWishlist(item._id)}>
                Remove
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
