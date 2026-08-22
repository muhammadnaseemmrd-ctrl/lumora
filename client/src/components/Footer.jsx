import { Link } from "react-router-dom";
import logoWhite from "../assets/logo-white.svg";
import { STORE } from "../api/api";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-about">
          <img src={logoWhite} alt={STORE.name} style={{ height: 36, marginBottom: 14 }} />
          <p>Premium skincare, haircare, body care &amp; makeup — sourced and shipped fresh from Rawalpindi, Pakistan. Cash on Delivery, cards &amp; mobile wallets accepted.</p>
          <div className="social-row">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1"/></svg>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3c.4 2.2 2 3.8 4.2 4v3c-1.5 0-2.9-.5-4.2-1.3v6.6a5.9 5.9 0 1 1-5.9-5.9c.3 0 .6 0 .9.1v3.1a2.8 2.8 0 1 0 2 2.7V3h3Z"/></svg>
            </a>
          </div>
        </div>
        <div>
          <h4>Shop</h4>
          <ul>
            <li><Link to="/shop">Shop All</Link></li>
            <li><Link to="/category/skincare">Skincare</Link></li>
            <li><Link to="/category/haircare">Haircare</Link></li>
            <li><Link to="/category/bodycare">Body Care</Link></li>
            <li><Link to="/category/makeup">Makeup</Link></li>
            <li><Link to="/category/bundles">Bundle Offers</Link></li>
          </ul>
        </div>
        <div>
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms-conditions">Terms &amp; Conditions</Link></li>
            <li><Link to="/shipping-returns">Shipping &amp; Returns</Link></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul>
            <li>📍 {STORE.city}</li>
            <li>📧 {STORE.email}</li>
            <li>📞 +{STORE.whatsapp}</li>
            <li>🕒 Mon–Sat, 10am–7pm</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom container">
        &copy; {new Date().getFullYear()} {STORE.name}. All rights reserved. &nbsp;|&nbsp; <Link to="/admin/login">Admin Login</Link>
      </div>
    </footer>
  );
}
