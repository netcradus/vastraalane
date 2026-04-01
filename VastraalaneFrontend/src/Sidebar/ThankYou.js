import React from "react";
import { Link } from "react-router-dom";
import "../scss/_thankYou.scss";

const ThankYou = () => {
  return (

      <div className="thankyou-content">
        <h1>Thanks for ordering!</h1>
        <p>Our support team will reach out to you soon.</p>
      </div>
    
  );
};

export default ThankYou;