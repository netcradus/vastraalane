import React from "react";
import "../scss/_about.scss";

function About() {
  return (
    <div className="about-page">
      <h1>About Vastraalane</h1>
      <p>
        Welcome to <strong>Vastraalane</strong>, your one-stop destination for
        premium fashion and lifestyle products. We believe in combining quality,
        elegance, and affordability to bring the best shopping experience for
        our customers.
      </p>

      <div className="about-section">
        <h2>Our Mission</h2>
        <p>
          To provide stylish, high-quality products that redefine fashion and
          empower our customers with confidence.
        </p>
      </div>

      <div className="about-section">
        <h2>Why Choose Us?</h2>
        <ul>
          <li>✔ Curated collection of top brands</li>
          <li>✔ Hassle-free returns and exchanges</li>
          <li>✔ Fast delivery & customer-first support</li>
        </ul>
      </div>
    </div>
  );
}

export default About;
