import React from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../scss/_wishlistPage.scss";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const safeWishlist = Array.isArray(wishlist) ? wishlist : [];

  const handleMoveToCart = async (item) => {
    const result = await addToCart(item);
    if (result === "auth_required") {
      navigate("/login");
    }
  };

  return (
    <div className="wishlist-page">
      <div className="wishlist-page__inner">
        <div className="wishlist-page__hero">
          <span className="wishlist-page__eyebrow">Saved For Later</span>
          <h1>Wishlist</h1>
          <p>Keep your favorite picks in one place and move them to cart when you are ready.</p>
        </div>

        {!isAuthenticated ? (
          <div className="wishlist-empty">
            <p>Please login to view your wishlist.</p>
            <span>Your saved products will be available after sign in.</span>
            <Link to="/login" className="wishlist-empty__link">
              Go to Login
            </Link>
          </div>
        ) : safeWishlist.length > 0 ? (
          <div className="wishlist-grid">
            {safeWishlist.map((item) => (
              <article key={item._id} className="wishlist-card">
                <img src={item.image} alt={item.name} className="wishlist-card__image" />

                <div className="wishlist-card__body">
                  <h2>{item.name}</h2>
                  <p className="wishlist-card__price">
                    Rs {Number(item.price || 0).toLocaleString("en-IN")}
                  </p>
                  <p className="wishlist-card__meta">
                    Qty: {item.quantity || 1}
                    {item.size ? ` • Size: ${item.size}` : ""}
                  </p>
                </div>

                <div className="wishlist-card__actions">
                  <button onClick={() => handleMoveToCart(item)}>Add to Cart</button>
                  <button onClick={() => removeFromWishlist(item._id)}>Remove</button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="wishlist-empty">
            <p>Your wishlist is empty.</p>
            <span>Save products here to review them later.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
