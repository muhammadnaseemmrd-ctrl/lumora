import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/api";
import ProductCard from "../components/ProductCard";
import useDocumentMeta from "../hooks/useDocumentMeta";

const CATS = [
  { key: "all", label: "All" },
  { key: "skincare", label: "Skincare" },
  { key: "haircare", label: "Haircare" },
  { key: "bodycare", label: "Body Care" },
  { key: "makeup", label: "Makeup" },
  { key: "bundles", label: "Bundles" }
];

export default function Shop() {
  useDocumentMeta({
    title: "Shop All Products | Lumora Beauty Pakistan",
    description: "Browse the full Lumora Beauty range — skincare, haircare, body care, makeup and bundle offers. 100% genuine, Cash on Delivery across Pakistan.",
    path: "/shop"
  });
  const [params, setParams] = useSearchParams();
  const activeCat = params.get("cat") || "all";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch function used by initial load and polling
  const fetchProducts = () => {
    setLoading(true);
    const query = activeCat !== "all" ? `?category=${activeCat}` : "";
    return api
      .get(`/products${query}`)
      .then(({ data }) => setProducts(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
    // Poll every 30 seconds for real-time-ish updates
    const id = setInterval(fetchProducts, 30 * 1000);
    return () => clearInterval(id);
  }, [activeCat]);

  return (
    <section className="section-tight">
      <div className="container">
        <div className="breadcrumb"><Link to="/">Home</Link> / <span>Shop All</span></div>
        <div className="section-head">
          <div>
            <span className="kicker">Full Collection</span>
            <h1>Shop All Products</h1>
            <p>{loading ? "Loading…" : `${products.length} products`}</p>
          </div>
        </div>
        <div className="filter-bar">
          {CATS.map((c) => (
            <button
              key={c.key}
              className={`filter-chip${activeCat === c.key ? " active" : ""}`}
              onClick={() => setParams(c.key === "all" ? {} : { cat: c.key })}
            >
              {c.label}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="loading-state">Loading products…</div>
        ) : products.length ? (
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="emoji">🔍</span>
            <h2>No products found</h2>
          </div>
        )}
      </div>
    </section>
  );
}
