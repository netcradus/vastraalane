import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import config from "../config";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // ✅ Load cart and wishlist from backend on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(config.API_URL,"test");
        const cartRes = await axios.get(`${config.API_URL}/api/cart`);
        setCart(cartRes.data || []);

        const wishlistRes = await axios.get(`${config.API_URL}/wishlist`);
        setWishlist(wishlistRes.data || []);
      } catch (err) {
        console.error("Error loading cart/wishlist:", err);
      }
    };
    fetchData();
  }, []);

  // ✅ Add product to cart
  const addToCart = async (product) => {
  try {
    const cartItem = {
      name: product.name,
      price: product.price,
      quantity: Number(product.quantity || 1),
      productId: product._id,
      size: product.size || null,
      image: product.image || (Array.isArray(product.images) ? product.images[0] : null) || null,
    };

    const res = await axios.post(`${config.API_URL}/api/cart`, cartItem);
    setCart(res.data);
  } catch (err) {
    console.error("Error adding to cart:", err);
  }
};

  // const addToCart = async (product) => {
  //   try {
  //     const res = await axios.post(`${config.API_URL}/api/cart`, product);
  //     setCart(res.data);
  //   } catch (err) {
  //     console.error("Error adding to cart:", err);
  //   }
  // };

  // ✅ Remove product from cart
  const removeFromCart = async (id) => {
    try {
      const res = await axios.delete(`${config.API_URL}/api/cart/${id}`);
      setCart(res.data);
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };
  
 
  // ✅ Clear cart
  const clearCart = async () => {
    try {
      await axios.delete(`${config.API_URL}/api/cart/clear`);
      setCart([]); // Clear local state
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  // ✅ Wishlist methods
  const addToWishlist = async (product) => {
    try {
      const res = await axios.post(`${config.API_URL}/wishlist`, product);
      setWishlist(res.data);
    } catch (err) {
      console.error("Error adding to wishlist:", err);
    }
  };

  const removeFromWishlist = async (id) => {
    try {
      const res = await axios.delete(`${config.API_URL}/wishlist/${id}`);
      setWishlist(res.data);
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
        clearCart, // ✅ Expose clearCart
        wishlist,
        addToWishlist,
        removeFromWishlist,
        setWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
