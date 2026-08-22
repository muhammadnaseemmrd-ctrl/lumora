import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { STORE } from "../api/api";
import logo from "../assets/logo.svg";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/shop", label: "Shop All" },
  { to: "/category/skincare", label: "Skincare" },
  { to: "/category/haircare", label: "Haircare" },
  { to: "/category/bodycare", label: "Body Care" },
  { to: "/category/makeup", label: "Makeup" },
  { to: "/category/bundles", label: "Bundles" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" }
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  return (
    <>
      <div className="announce">
        ✨ <strong>Grand Opening Sale</strong> — Flat 20% off sitewide. Free shipping in Rawalpindi &amp; Islamabad on orders over Rs.3,000.
      </div>
      <header className="site-header">
        <div className="nav-wrap">
          <Link to="/" className="logo" onClick={() => setOpen(false)}>
            <img src={logo} alt={STORE.name} />
          </Link>
          <nav className={`main-nav${open ? " open" : ""}`}>
            <ul>
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} end={link.end} onClick={() => setOpen(false)}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="nav-actions">
            <Link to="/cart" className="icon-btn" aria-label="View cart">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8h12l-1 12a2 2 0 0 1-2 1.8H9a2 2 0 0 1-2-1.8L6 8Z" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>
              <span className="cart-count">{count}</span>
            </Link>
            <button className="mobile-toggle" aria-label="Toggle menu" onClick={() => setOpen((o) => !o)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
