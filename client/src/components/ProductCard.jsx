import { Link } from "react-router-dom";
import { money, resolveImage } from "../api/api";
import { useCart } from "../context/CartContext";

function ratingStars(rating) {
  const full = Math.round(rating || 0);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const discount = product.comparePrice > product.price ? Math.round((1 - product.price / product.comparePrice) * 100) : 0;
  const cover = product.images && product.images[0];

  return (
    <div className="product-card">
      <Link to={`/product/${product.slug}`} className="product-thumb" aria-label={product.name}>
        {product.badge && (
          <span className={`badge ${product.badge === "Sale" ? "sale" : product.badge === "Bundle" ? "gold" : ""}`}>
            {product.badge}
          </span>
        )}
        {cover ? <img src={resolveImage(cover)} alt={product.name} loading="lazy" /> : null}
      </Link>
      <div className="product-info">
        <span className="product-cat">{product.categoryLabel}</span>
        <h3 className="product-name">
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <div className="rating">
          {ratingStars(product.rating)} <span className="count">({product.reviews})</span>
        </div>
        <div className="price-row">
          <span className="price-now">{money(product.price)}</span>
          {discount > 0 && (
            <>
              <span className="price-old">{money(product.comparePrice)}</span>
              <span className="discount-pct">-{discount}%</span>
            </>
          )}
        </div>
        <div className="product-actions">
          <button className="btn btn-primary btn-block btn-sm" onClick={() => addToCart(product, 1)}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
