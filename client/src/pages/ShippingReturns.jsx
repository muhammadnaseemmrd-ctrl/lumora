import useDocumentMeta from "../hooks/useDocumentMeta";

export default function ShippingReturns() {
  useDocumentMeta({
    title: "Shipping & Returns | Lumora Beauty",
    description: "Shipping times, returns and refund policy for Lumora Beauty orders.",
    path: "/shipping-returns"
  });

  return (
    <section className="section-tight">
      <div className="container">
        <h1>Shipping & Returns</h1>
        <p>Standard shipping across Pakistan. Returns accepted within 7 days for eligible items.</p>
      </div>
    </section>
  );
}
