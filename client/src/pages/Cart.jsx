import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { money, resolveImage, STORE } from "../api/api";

export default function Cart() {
  const { items, removeFromCart, setQty, subtotal } = useCart();
  const shipping = subtotal >= STORE.freeShippingOver ? 0 : STORE.shippingFee;

  return (
    <section className="section-tight">
      <div className="container">
        <div className="breadcrumb"><Link to="/">Home</Link> / <span>Your Cart</span></div>
        <h1>Your Cart</h1>

        {!items.length ? (
          <div className="empty-state">
            <span className="emoji">🛍️</span>
            <h2>Your cart is empty</h2>
            <p className="text-muted">Looks like you haven't added anything yet.</p>
            <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="pd-grid" style={{ gridTemplateColumns: "1.6fr 1fr" }}>
            <div>
              <table className="cart-table">
                <thead>
                  <tr><th>Product</th><th>Price</th><th>Qty</th><th>Total</th><th></th></tr>
                </thead>
                <tbody>
                  {items.map((l) => (
                    <tr key={l.productId}>
                      <td>
                        <div className="cart-item-name">
                          <div className="cart-item-thumb">{l.image && <img src={resolveImage(l.image)} alt={l.name} />}</div>
                          {l.name}
                        </div>
                      </td>
                      <td>{money(l.price)}</td>
                      <td>
                        <div className="qty-selector" style={{ height: 34 }}>
                          <button onClick={() => setQty(l.productId, l.qty - 1)}>−</button>
                          <span>{l.qty}</span>
                          <button onClick={() => setQty(l.productId, l.qty + 1)}>+</button>
                        </div>
                      </td>
                      <td>{money(l.price * l.qty)}</td>
                      <td><button className="remove-link" onClick={() => removeFromCart(l.productId)}>Remove</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-row"><span>Subtotal</span><span>{money(subtotal)}</span></div>
              <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? "FREE" : money(shipping)}</span></div>
              <div className="summary-row total"><span>Total</span><span>{money(subtotal + shipping)}</span></div>
              <Link to="/checkout" className="btn btn-primary btn-block" style={{ marginTop: 14 }}>Proceed to Checkout</Link>
              <p className="text-muted" style={{ fontSize: ".78rem", marginTop: 12 }}>
                Free shipping on orders over {money(STORE.freeShippingOver)}. Cash on Delivery, cards &amp; mobile wallets accepted.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
