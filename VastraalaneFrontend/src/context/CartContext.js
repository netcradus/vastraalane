import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setCart([]);
      setWishlist([]);
      return;
    }

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const cartRes = await axios.get(`${config.API_URL}/api/cart`, { headers });
        setCart(cartRes.data || []);

        const wishlistRes = await axios.get(`${config.API_URL}/wishlist`, { headers });
        setWishlist(wishlistRes.data || []);
      } catch (err) {
        console.error("Error loading cart/wishlist:", err);
        setCart([]);
        setWishlist([]);
      }
    };

    fetchData();
  }, [isAuthenticated, token]);

  const getWishlistIdentity = (product) =>
    String(product?.productId || product?._id || product?.id || product?.name || "");

  const isProductInWishlist = (product) => {
    const identity = getWishlistIdentity(product);
    if (!identity) return false;

    return wishlist.some(
      (item) =>
        String(item?._id || "") === identity ||
        String(item?.productId || "") === identity ||
        String(item?.id || "") === identity ||
        String(item?.name || "") === identity
    );
  };

  const addToCart = async (product) => {
    if (!isAuthenticated || !token) {
      return "auth_required";
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const cartItem = {
        name: product.name,
        price: product.price,
        quantity: Number(product.quantity || 1),
        productId: product.productId || product._id || product.id,
        size: product.size || null,
        image:
          product.image ||
          (Array.isArray(product.images) ? product.images[0] : null) ||
          null,
      };

      const res = await axios.post(`${config.API_URL}/api/cart`, cartItem, { headers });
      setCart(res.data || []);
      return true;
    } catch (err) {
      console.error("Error adding to cart:", err);
      return null;
    }
  };

  const removeFromCart = async (id) => {
    if (!isAuthenticated || !token) {
      setCart([]);
      return;
    }

    try {
      const res = await axios.delete(`${config.API_URL}/api/cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data || []);
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated || !token) {
      setCart([]);
      return;
    }

    try {
      await axios.delete(`${config.API_URL}/api/cart/clear`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart([]);
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  const addToWishlist = async (product) => {
    if (!isAuthenticated || !token) {
      return "auth_required";
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const identity = getWishlistIdentity(product);
      const existingItem = wishlist.find(
        (item) =>
          String(item?._id || "") === identity ||
          String(item?.productId || "") === identity ||
          String(item?.id || "") === identity ||
          String(item?.name || "") === identity
      );

      if (existingItem?._id) {
        const res = await axios.delete(`${config.API_URL}/wishlist/${existingItem._id}`, {
          headers,
        });
        setWishlist(res.data || []);
        return false;
      }

      const wishlistItem = {
        name: product?.name,
        price: Number(product?.price || 0),
        image:
          product?.image ||
          (Array.isArray(product?.images) ? product.images[0] : null) ||
          null,
        quantity: Number(product?.quantity || 1),
        size: product?.size || null,
        productId: identity,
      };

      const res = await axios.post(`${config.API_URL}/wishlist`, wishlistItem, { headers });
      setWishlist(res.data || []);
      return true;
    } catch (err) {
      console.error("Error updating wishlist:", err);
      return null;
    }
  };

  const removeFromWishlist = async (id) => {
    if (!isAuthenticated || !token) {
      setWishlist([]);
      return;
    }

    try {
      const res = await axios.delete(`${config.API_URL}/wishlist/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(res.data || []);
    } catch (err) {
      console.error("Error removing from wishlist:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isProductInWishlist,
        setWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
