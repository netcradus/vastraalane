// src/pages/TermsConditions.jsx
import React from "react";
import "../scss/_termsconditions.scss";

const TermsConditions = () => {
  return (
    <div className="terms-page">
      <h1 className="page-title">Terms & Conditions</h1>

      <div className="terms-section">
        <h2>General</h2>
        <p>
          Welcome to <strong>Vastraalane</strong>! By accessing or using our
          website, you agree to comply with and be bound by the following terms
          and conditions. Please read these carefully before using our services.
        </p>
      </div>

      <div className="terms-section">
        <h2>Ordering Policy</h2>
        <ul>
          <li>✔ Orders once placed cannot be modified.</li>
          <li>✔ Ensure your shipping address and contact details are accurate.</li>
          <li>✔ In case of suspected fraudulent transactions, we may cancel orders.</li>
        </ul>
      </div>

      <div className="terms-section">
        <h2>Payment Policy</h2>
        <ul>
          <li>✔ We accept all major credit/debit cards, UPI, and net banking.</li>
          <li>✔ Cash on Delivery (COD) may be available in select locations.</li>
          <li>✔ Payments must be made in full before shipping.</li>
        </ul>
      </div>

      <div className="terms-section">
        <h2>Shipping Policy</h2>
        <ul>
          <li>✔ Standard delivery timeline: 5–7 business days (may vary by location).</li>
          <li>✔ Delays due to unforeseen circumstances (strikes, weather) are not our liability.</li>
          <li>✔ Shipping charges, if applicable, will be displayed at checkout.</li>
        </ul>
      </div>

      <div className="terms-section">
        <h2>Return & Refund Policy</h2>
        <ul>
          <li>✔ Returns accepted within 7 days (unused, tags intact).</li>
          <li>✔ Customized or sale items are non-returnable.</li>
          <li>✔ Refunds processed within 7–10 business days after product inspection.</li>
        </ul>
      </div>

      <div className="terms-section">
        <h2>Liability Disclaimer</h2>
        <p>
          Vastraalane shall not be held responsible for any indirect, incidental,
          or consequential damages arising out of the use of our products or website.
        </p>
      </div>

      <div className="terms-section">
        <h2>Governing Law</h2>
        <p>
          These terms and conditions shall be governed by the laws of India. Any
          disputes will be subject to the jurisdiction of courts in Delhi, India.
        </p>
      </div>

      <div className="terms-section">
        <h2>Contact Us</h2>
        <p>
          For any queries, please contact our support team:
        </p>
        <ul>
          <li>Email: <a href="mailto:info@vastraalane.com">info@vastraalane.com</a></li>
          {/* <li>Phone: +91-9910678434</li> */}
          <li>Working Hours: Mon–Sat (10 AM – 8 PM)</li>
        </ul>
      </div>
    </div>
  );
};

export default TermsConditions;
