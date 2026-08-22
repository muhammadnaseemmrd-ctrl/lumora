import { Link } from "react-router-dom";
import { STORE } from "../api/api";
import useDocumentMeta from "../hooks/useDocumentMeta";

export default function Contact() {
  useDocumentMeta({
    title: `Contact Us | ${STORE.name} — Rawalpindi, Pakistan`,
    description: "Get in touch with Lumora Beauty via WhatsApp, phone or email for order support, product questions or partnership inquiries. Based in Rawalpindi, Pakistan.",
    path: "/contact"
  });
  return (
    <section className="section-tight">
      <div className="container">
        <div className="breadcrumb"><Link to="/">Home</Link> / <span>Contact Us</span></div>
        <div className="section-head"><div><span className="kicker">We'd Love to Hear From You</span><h1>Contact Us</h1></div></div>
        <div className="pd-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div className="form-card">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Message sent! We will reply within 24 hours.");
                e.target.reset();
              }}
            >
              <div className="field"><label>Full Name</label><input type="text" required /></div>
              <div className="field"><label>Email Address</label><input type="email" required /></div>
              <div className="field"><label>Phone Number</label><input type="tel" /></div>
              <div className="field"><label>Message</label><textarea rows="5" required /></div>
              <button className="btn btn-primary btn-block" type="submit">Send Message</button>
            </form>
          </div>
          <div>
            <div className="form-card" style={{ marginBottom: 18 }}>
              <h3>Reach Us Directly</h3>
              <p className="text-muted">📍 9 KM Chakri Road, {STORE.city}</p>
              <p className="text-muted">📧 {STORE.email}</p>
              <p className="text-muted">📞 +{STORE.whatsapp}</p>
              <p className="text-muted">🕒 Monday – Saturday, 10am – 7pm</p>
              <a className="btn btn-primary btn-block" href={`https://wa.me/${STORE.whatsapp}`} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
            </div>
            <div className="form-card">
              <h3>Order &amp; Delivery Support</h3>
              <p className="text-muted">Questions about an existing order? Have your order number ready and message us on WhatsApp for the fastest response.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
