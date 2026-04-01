import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../scss/_customerForm.scss";
import config from "../config";

const CustomerForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart(); // ✅ Now defined
  const product = state?.product;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
  });

  const isFormValid = Object.values(formData).every((val) => val.trim() !== "");

  if (!product) {
    return <p className="no-product">No product selected. Please go back and choose a product.</p>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "contact" && !/^\d*$/.test(value)) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      //  const res = await axios.post(`${config.API_URL}/api/cart`, cartItem);
      await fetch(`${config.API_URL}/submit-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: formData,
          product: product
        })
      });

      await clearCart(); // ✅ Clear cart after successful submission
      navigate("/thank-you");
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Failed to submit order. Please try again.");
    }
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit} className="customer-form">
        <h2>Customer Details</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email ID"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="contact"
          placeholder="Contact Number"
          value={formData.contact}
          onChange={handleChange}
          required
          maxLength={10}
          inputMode="numeric"
        />

        <textarea
          name="address"
          placeholder="Full Address"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={!isFormValid}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default CustomerForm;
