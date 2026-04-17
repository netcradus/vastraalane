import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaHeart, FaShoppingCart, FaTimes, FaUser } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "../scss/_navbar.scss";
import Logo from "../assets/LOGOSTYLE1.jpg";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart, wishlist } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const safeCart = Array.isArray(cart) ? cart : [];
  const safeWishlist = Array.isArray(wishlist) ? wishlist : [];
  const closeMenu = () => setMenuOpen(false);
  const displayName = user?.fullName || user?.username || user?.email?.split("@")[0] || "Account";

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/" onClick={closeMenu}>
          <img src={Logo} alt="Vastraaalane Logo" style={{ width: "100px", height: "auto" }} />
        </Link>
      </div>

      <ul className={menuOpen ? "nav-links open" : "nav-links"}>
        <li>
          <Link to="/" onClick={closeMenu}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/products" onClick={closeMenu}>
            Products
          </Link>
        </li>
        <li>
          <Link to="/category" onClick={closeMenu}>
            Category
          </Link>
        </li>
        {isAuthenticated && (
          <li>
            <button type="button" className="nav-action-btn" onClick={handleLogout}>
              Logout
            </button>
          </li>
        )}

        <div className="drawer-icons">
          <Link to={isAuthenticated ? "/account" : "/login"} onClick={closeMenu} title={displayName}>
            <FaUser className="icon" />
          </Link>
          <Link to="/wishlist" onClick={closeMenu} className="icon-link">
            <FaHeart className="icon" />
            {safeWishlist.length > 0 && <span className="icon-badge">{safeWishlist.length}</span>}
          </Link>
          <Link to="/cart" onClick={closeMenu} className="icon-link">
            <FaShoppingCart className="icon" />
            {safeCart.length > 0 && <span className="icon-badge">{safeCart.length}</span>}
          </Link>
        </div>
      </ul>

      <div className="nav-icons">
        <Link to={isAuthenticated ? "/account" : "/login"} title={displayName}>
          <FaUser className="icon" />
        </Link>
        <Link to="/wishlist" className="icon-link">
          <FaHeart className="icon" />
          {safeWishlist.length > 0 && <span className="icon-badge">{safeWishlist.length}</span>}
        </Link>
        <Link to="/cart" className="icon-link">
          <FaShoppingCart className="icon" />
          {safeCart.length > 0 && <span className="icon-badge">{safeCart.length}</span>}
        </Link>
        {isAuthenticated && (
          <button
            type="button"
            className="nav-action-btn nav-action-btn--desktop"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>

      <div className="menu-toggle" onClick={() => setMenuOpen((open) => !open)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>
    </nav>
  );
};

export default Navbar;
