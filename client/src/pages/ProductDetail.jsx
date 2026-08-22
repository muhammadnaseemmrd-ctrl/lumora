import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api, { money, resolveImage, STORE } from "../api/api";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import { CheckIcon } from "../components/Icons";
import useDocumentMeta from "../hooks/useDocumentMeta";

function ratingStars(rating) {
  const full = Math.round(rating || 0);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

export default function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("benefits");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setActiveImg(0);
    setQty(1);
    api
      .get(`/products/${slug}`)
      .then(({ data }) => {
        setProduct(data);
        return api.get(`/products?category=${data.category}`);
      })
      .then(({ data }) => setRelated(data.filter((p) => p.slug !== slug).slice(0, 4)))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  useDocumentMeta({
    title: product ? `${product.name} | ${STORE.name}` : undefined,
    description: product ? `${product.shortDesc} Buy online in Pakistan with Cash on Delivery — ${STORE.name}.` : undefined,
    path: product ? `/product/${product.slug}` : undefined
  });

  useEffect(() => {
    if (!product) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      image: (product.images || []).map((img) => resolveImage(img)),
      brand: { "@type": "Brand", name: STORE.name },
      offers: {
        "@type": "Offer",
        priceCurrency: "PKR",
        price: product.price,
        availability: "https://schema.org/InStock",
        url: `https://www.lumorabeauty.pk/product/${product.slug}`
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviews
      }
    });
    document.head.appendChild(script);
    return () => document.head.removeChild(script);
  }, [product]);

  if (loading) return <section className="section-tight container loading-state">Loading product…</section>;
  if (notFound || !product) {
    return (
      <section className="section-tight container empty-state">
        <span className="emoji">🔍</span>
        <h2>Product not found</h2>
        <p className="text-muted">This item may have been removed.</p>
        <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
      </section>
    );
  }

  const discount = product.comparePrice > product.price ? Math.round((1 - product.price / product.comparePrice) * 100) : 0;
  const images = product.images && product.images.length ? product.images : [];

  return (
    <section className="section-tight">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link> / <Link to={`/category/${product.category}`}>{product.categoryLabel}</Link> / <span>{product.name}</span>
        </div>
        <div className="pd-grid">
          <div className="pd-gallery">
            <div className="pd-main-image">
              {images[activeImg] && <img src={resolveImage(images[activeImg])} alt={product.name} />}
            </div>
            {images.length > 1 && (
              <div className="pd-thumb-row">
                {images.map((img, i) => (
                  <img
                    key={img + i}
                    src={resolveImage(img)}
                    alt={`${product.name} view ${i + 1}`}
                    className={i === activeImg ? "active" : ""}
                    onClick={() => setActiveImg(i)}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="pd-details">
            <div className="pd-badges">
              {product.badge && <span className="badge-pill">{product.badge}</span>}
              <span className="badge-pill">{product.categoryLabel}</span>
            </div>
            <h1 className="pd-title">{product.name}</h1>
            <div className="rating">
              {ratingStars(product.rating)} <span className="count">{product.rating} ({product.reviews} reviews)</span>
            </div>
            <div className="pd-price">
              {money(product.price)}
              {discount > 0 && (
                <>
                  <span className="price-old">{money(product.comparePrice)}</span>
                  <span className="discount-pct">Save {discount}%</span>
                </>
              )}
            </div>
            <p className="text-muted">{product.description}</p>
            {product.size && <p className="text-muted"><strong>Size:</strong> {product.size}</p>}
            <div className="qty-selector">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
            <div className="pd-actions">
              <button className="btn btn-primary" onClick={() => addToCart(product, qty)}>Add to Cart</button>
              <a
                className="btn btn-outline"
                href={`https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(`Hi! I want to order: ${product.name} (${money(product.price)})`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Order on WhatsApp
              </a>
            </div>
            <div className="trust-mini">
              <span><CheckIcon /> Cash on Delivery available</span>
              <span><CheckIcon /> Ships from {STORE.city}</span>
              <span><CheckIcon /> Easy 7-day returns</span>
            </div>
            <div className="pd-tabs">
              {["benefits", "use", "ingredients"].map((t) => (
                <button key={t} className={`pd-tab${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>
                  {t === "benefits" ? "Benefits" : t === "use" ? "How to Use" : "Ingredients"}
                </button>
              ))}
            </div>
            <div className="pd-tab-content">
              {tab === "benefits" && (
                <ul>{(product.benefits || []).map((b, i) => <li key={i}>{b}</li>)}</ul>
              )}
              {tab === "use" && <p>{product.howToUse}</p>}
              {tab === "ingredients" && <p>{product.ingredients}</p>}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section style={{ paddingTop: 60 }}>
            <div className="section-head"><span className="kicker">You may also like</span><h2>Related Products</h2></div>
            <div className="product-grid">
              {related.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </section>
  );
}
