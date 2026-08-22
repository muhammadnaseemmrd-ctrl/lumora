import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import api, { money } from "../api/api";

export default function OrderSuccess() {
  const { orderNumber } = useParams();
  const [searchParams] = useSearchParams();
  const payment = searchParams.get("payment");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api
      .get(`/orders/number/${orderNumber}`)
      .then(({ data }) => setOrder(data))
      .catch(() => setOrder(null));
  }, [orderNumber]);

  const failed = payment === "failed" || payment === "cancelled";

  return (
    <section className="section">
      <div className="container empty-state">
        <span className="emoji">{failed ? "⚠️" : "🎉"}</span>
        <h1>{failed ? "Payment Not Completed" : "Thank You! Your Order Is Confirmed"}</h1>
        <p className="text-muted">
          {failed
            ? `Order #${orderNumber} was created but payment didn't go through. You can retry payment or choose Cash on Delivery instead by contacting us on WhatsApp.`
            : `Order #${orderNumber} has been placed successfully.`}
        </p>
        {order && (
          <div className="summary-card" style={{ maxWidth: 420, margin: "24px auto", textAlign: "left" }}>
            {order.items.map((it) => (
              <div className="summary-row" key={it.slug}><span>{it.name} × {it.qty}</span><span>{money(it.lineTotal)}</span></div>
            ))}
            <div className="summary-row total"><span>Total</span><span>{money(order.total)}</span></div>
            <p className="text-muted" style={{ fontSize: ".78rem", marginTop: 10 }}>
              Payment: {order.paymentMethod} — Status: {order.paymentStatus}
            </p>
          </div>
        )}
        <Link to="/shop" className="btn btn-primary" style={{ marginTop: 16 }}>Continue Shopping</Link>
      </div>
    </section>
  );
}
