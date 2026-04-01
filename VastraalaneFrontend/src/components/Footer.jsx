import React from "react";
import "../scss/_footer.scss";

function Footer() {
  return (
    <footer className="footer">
      {/* ✅ Customer Care Section */}
      <div className="customer-care">
        <h3>CUSTOMER CARE</h3>
        <p>Store Time : 10:00 - 8:00, Monday - Saturday</p>
        {/* <p>
          Call : <a href="tel:+91-9910678434">+91-9910678434</a>
        </p> */}
        <p>
          E-Mail :{" "}
          <a href="mailto:info@vastraalane.com">
            info@vastraalane.com
          </a>
        </p>
      </div>

      {/* ✅ Policy / Info Section */}
      <div className="policy-info">
        <h3>Need Help?</h3>
        <p>
          For any queries, reach us at{" "}
          {/* <a href="mailto:info@vastraalane.com">info@vastraalane.com</a> or call{" "} */}
          {/* <strong>+91-9910678434</strong>. */}
        </p>

        <div className="policy-points">
          {/* <p>✔ Returns accepted within 7 days (unused with tags).</p> */}
          <p>✔ Customized or sale items are non-returnable.</p>
          {/* <p>✔ Refunds processed within 7–10 business days.</p> */}
          <p>✔ Monday – Saturday: 10:00 AM – 8:00 PM | Sunday: Closed</p>
        </div>
      </div>

      {/* ✅ Links Section */}
      <div className="footer-links">
        <a href="/about">About Us</a>
        <a href="/terms">Terms Condition</a>
        {/* <a href="/returns">Return Policy</a> */}
        <a href="/support">Customer Care</a>
      </div>

    
      <p className="copyright">
        © 2025 All rights reserved | Vastraaalane
        
      </p>

      <p className="managed-by">
        managed by CyberHaxs
      </p>
    </footer>
  );
}

export default Footer;
