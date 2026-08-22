import { Link } from "react-router-dom";
import { STORE } from "../api/api";
import useDocumentMeta from "../hooks/useDocumentMeta";

export default function Terms() {
  useDocumentMeta({
    title: `Terms & Conditions | ${STORE.name}`,
    description: "Terms and conditions for shopping at Lumora Beauty — orders, pricing, payments and acceptable use.",
    path: "/terms-conditions"
  });
  return (
    <section className="section-tight">
      <div className="container policy-content">
        <div className="breadcrumb"><Link to="/">Home</Link> / <span>Terms &amp; Conditions</span></div>
        <h1>Terms &amp; Conditions</h1>
        <p className="text-muted">Last updated: August 2026</p>
        <p>By accessing or placing an order on our site, you agree to the following terms.</p>
        <h2>Orders &amp; Pricing</h2>
        <p>All prices are listed in Pakistani Rupees (PKR). We reserve the right to correct pricing errors and limit order quantities.</p>
        <h2>Product Availability</h2>
        <p>Since items are sourced from partner shops and stockists in Rawalpindi after your order is placed, occasional stock delays can occur. If a product becomes unavailable, we will contact you to offer a substitute, refund, or delayed dispatch.</p>
        <h2>Payment</h2>
        <p>We accept Cash on Delivery, bank transfer, card payments (Stripe), and mobile wallets (JazzCash/EasyPaisa) where available. Card and wallet payments are processed securely by our payment partners — we never see or store your full card/wallet credentials.</p>
        <h2>Order Cancellations</h2>
        <p>Orders can be cancelled free of charge before dispatch by contacting us via WhatsApp or phone. See our <Link to="/shipping-returns">Shipping &amp; Returns</Link> page for our return process.</p>
        <h2>Contact</h2>
        <p>Questions? Email {STORE.email}.</p>
      </div>
    </section>
  );
}
