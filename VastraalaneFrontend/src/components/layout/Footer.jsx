import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mt-20 bg-black text-white" data-reveal>
      <div className="container-shell py-16">
        <div className="mb-10 flex justify-center md:justify-start">
          <img
            src="/images/logo.png"
            alt="Vastraalane logo"
            className="h-24 w-24 object-contain"
            loading="lazy"
          />
        </div>

        <div className="site-footer-grid">
          <div className="footer-panel">
            <h4 className="text-[clamp(1.8rem,3vw,2.4rem)] font-semibold">Customer Care</h4>
            <div className="mt-6 grid gap-3 text-sm leading-7 text-white/80">
              <span>Store Time : 10:00 - 8:00, Monday - Saturday</span>
              <span>E-Mail : info@vastraalane.com</span>
            </div>
          </div>

          <div className="footer-panel">
            <h4 className="text-[clamp(1.8rem,3vw,2.4rem)] font-semibold">Need Help?</h4>
            <div className="mt-6 grid gap-3 text-sm leading-7 text-white/80">
              <span>For any queries, reach us at</span>
              <span>info@vastraalane.com</span>
              <span>Customized items are non-returnable.</span>
              <span>Monday - Saturday: 10:00 AM - 8:00 PM | Sunday: Closed</span>
            </div>
          </div>

          <div className="footer-panel">
            <h4 className="text-[clamp(1.8rem,3vw,2.4rem)] font-semibold">Quick Links</h4>
            <div className="mt-6 grid gap-3 text-sm font-medium text-white/85">
              <Link to="/about">About Us</Link>
              <Link to="/terms-conditions">Terms Condition</Link>
              <Link to="/customer-care">Customer Care</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-shell py-8 text-center text-sm text-white/75">
          <p>&copy; 2025 All rights reserved | Vastraalane | Managed by Cyberhaxs</p>
        </div>
      </div>
    </footer>
  );
}
