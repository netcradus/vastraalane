// src/pages/CustomerCare.jsx
import React from "react";
import "../scss/_customercare.scss";

const CustomerCare = () => {
  return (
    <div className="customer-care-page">
      <h1 className="page-title">Customer Care</h1>
      <p className="intro-text">
        Have any questions or need more information about our products?  
        Either way, you’re in the right spot to contact us.
      </p>
      <p className="email">
        📧 <a href="mailto:vastraalane@gmail.com">vastraalane@gmail.com</a>
      </p>
    </div>
  );
};

export default CustomerCare;
