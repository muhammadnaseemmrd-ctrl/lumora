import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import api from "../api/api";
import ProductCard from "../components/ProductCard";
import useDocumentMeta from "../hooks/useDocumentMeta";

const CATEGORY_INFO = {
  skincare: {
    title: "Skincare Products for Every Skin Type",
    desc: "Vitamin C serums, niacinamide treatments, brightening creams and gentle cleansers — formulated to target dullness, acne, pigmentation and uneven texture. Shop skincare online in Pakistan with Cash on Delivery.",
    metaTitle: "Skincare Products in Pakistan | Serums, Creams & Face Wash — Lumora Beauty",
    keywords: "skincare Pakistan, vitamin c serum Pakistan, niacinamide serum, brightening cream, face wash online Pakistan"
  },
  haircare: {
    title: "Haircare Products for Stronger, Healthier Hair",
    desc: "Argan growth oil, keratin repair shampoo and treatments — designed to reduce hair fall, repair damage and restore natural shine. Shop haircare online in Pakistan with fast delivery.",
    metaTitle: "Haircare Products in Pakistan | Hair Oil, Shampoo & Serum — Lumora Beauty",
    keywords: "hair oil Pakistan, anti hairfall serum, keratin shampoo Pakistan, hair growth oil online"
  },
  bodycare: {
    title: "Body Care for Soft, Glowing Skin",
    desc: "Whitening hand & foot cream, body lotion, body wash and handmade soap — everyday essentials for head-to-toe care. Shop body care online in Pakistan.",
    metaTitle: "Body Care Products in Pakistan | Lotion, Body Wash & Soap — Lumora Beauty",
    keywords: "body lotion Pakistan, body wash online, whitening cream Pakistan, organic soap Pakistan"
  },
  makeup: {
    title: "Everyday Makeup Essentials",
    desc: "Lightweight matte foundation and glow-setting compact powder — made for a natural, long-lasting everyday look. Shop makeup online in Pakistan with Cash on Delivery.",
    metaTitle: "Daily Makeup Online in Pakistan | Foundation & Compact Powder — Lumora Beauty",
    keywords: "makeup online Pakistan, matte foundation Pakistan, compact powder online, buy makeup Rawalpindi"
  },
  bundles: {
    title: "Curated Routines, Bundled to Save You More",
    desc: "Complete skincare and haircare routines bundled together at a special price — save up to 30% compared to buying each product separately.",
    metaTitle: "Beauty Bundle Offers Pakistan | Save up to 30% — Lumora Beauty",
    keywords: "bundle offers Pakistan, skincare combo deal, haircare combo Pakistan, gift set beauty Pakistan"
  }
};

export default function Category() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const info = CATEGORY_INFO[category];

  useDocumentMeta({
    title: info ? info.metaTitle : "Lumora Beauty",
    description: info ? info.desc : undefined,
    path: `/category/${category}`
  });

  useEffect(() => {
    if (!info) return;
    setLoading(true);
    api
      .get(`/products?category=${category}`)
      .then(({ data }) => setProducts(data))
      .finally(() => setLoading(false));
  }, [category, info]);

  useEffect(() => {
    if (!info) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.lumorabeauty.pk/" },
        { "@type": "ListItem", position: 2, name: "Shop All", item: "https://www.lumorabeauty.pk/shop" },
        { "@type": "ListItem", position: 3, name: info.title, item: `https://www.lumorabeauty.pk/category/${category}` }
      ]
    });
    document.head.appendChild(script);
    return () => document.head.removeChild(script);
  }, [category, info]);

  if (!info) return <Navigate to="/shop" replace />;

  return (
    <section className="section-tight">
      <div className="container">
        <div className="breadcrumb"><Link to="/">Home</Link> / <Link to="/shop">Shop All</Link> / <span>{info.title}</span></div>
        <div className="section-head">
          <div>
            <span className="kicker">Collection</span>
            <h1>{info.title}</h1>
            <p>{info.desc}</p>
          </div>
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
            <span className="emoji">🧴</span>
            <h2>No products in this category yet</h2>
            <Link to="/shop" className="btn btn-primary">Browse All Products</Link>
          </div>
        )}
      </div>
    </section>
  );
}
