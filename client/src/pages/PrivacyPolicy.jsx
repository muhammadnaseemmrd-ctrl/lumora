import { Link } from "react-router-dom";
import { STORE } from "../api/api";
import useDocumentMeta from "../hooks/useDocumentMeta";

export default function PrivacyPolicy() {
  useDocumentMeta({
    title: `Privacy Policy | ${STORE.name}`,
    description: "Read Lumora Beauty's privacy policy — how we collect, use and protect your personal information when you shop with us.",
    path: "/privacy-policy"
  });
  return (
    <section className="section-tight">
      <div className="container policy-content">
        <div className="breadcrumb"><Link to="/">Home</Link> / <span>Privacy Policy</span></div>
        <h1>Privacy Policy</h1>
        <p className="text-muted">Last updated: August 2026</p>
        <p>{STORE.name} ("we", "us", "our") respects your privacy. This policy explains what information we collect when you visit or order from our site, and how we use it.</p>
        <h2>Information We Collect</h2>
        <ul>
          <li>Contact details you provide at checkout: name, phone number, delivery address, and optionally email.</li>
          <li>Order details: items purchased, order value, and order history.</li>
          <li>Payment confirmation data from our payment processors (Stripe/JazzCash/EasyPaisa) — we never store your full card or wallet credentials ourselves.</li>
        </ul>
        <h2>How We Use Your Information</h2>
        <ul>
          <li>To process and deliver your order, including contacting you via phone or WhatsApp.</li>
          <li>To provide customer support and respond to inquiries.</li>
          <li>To send occasional promotional updates, only if you've subscribed — unsubscribe anytime.</li>
        </ul>
        <h2>Contact Us</h2>
        <p>Questions about this policy? Email {STORE.email} or message us on WhatsApp.</p>
      </div>
    </section>
  );
}
