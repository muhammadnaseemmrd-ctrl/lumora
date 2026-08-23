import { Link } from "react-router-dom";
import useDocumentMeta from "../hooks/useDocumentMeta";

export default function Home() {
  useDocumentMeta({
    title: "Lumora Beauty — Natural Skincare & Haircare",
    description: "Shop Lumora Beauty — premium skincare, haircare and bodycare products. 100% genuine products with Cash on Delivery across Pakistan.",
    path: "/"
  });

  return (
    <section className="hero">
      <div className="container">
        <h1>Welcome to Lumora Beauty</h1>
        <p>Discover curated skincare, haircare and beauty bundles — genuine products, handpicked for you.</p>
        <div className="hero-actions">
          <Link className="btn btn-primary" to="/shop">Shop Now</Link>
        </div>
      </div>
    </section>
  );
}
