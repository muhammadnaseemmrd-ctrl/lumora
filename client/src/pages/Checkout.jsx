import useDocumentMeta from "../hooks/useDocumentMeta";

export default function Checkout() {
  useDocumentMeta({ title: "Checkout | Lumora Beauty", description: "Secure checkout for Lumora Beauty orders.", path: "/checkout" });

  return (
    <section className="section-tight">
      <div className="container">
        <h1>Checkout</h1>
        <p>This is the checkout placeholder. Complete checkout integration is handled by the backend.</p>
      </div>
    </section>
  );
}
