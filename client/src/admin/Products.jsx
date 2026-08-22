import { useEffect, useState } from "react";
import api, { money, resolveImage } from "../api/api";
import ProductForm from "./ProductForm";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(undefined); // undefined = closed, null = new, object = edit

  function load() {
    setLoading(true);
    api.get("/products/admin/all").then(({ data }) => setProducts(data)).finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleDelete(product) {
    if (!confirm(`Delete "${product.name}"? This also removes its uploaded images.`)) return;
    await api.delete(`/products/${product._id}`);
    load();
  }

  return (
    <div>
      <div className="admin-topbar">
        <div><h1>Products</h1><div className="sub">Manage your product catalog</div></div>
        <button className="admin-btn primary" onClick={() => setEditing(null)}>+ Add Product</button>
      </div>

      <div className="admin-card">
        {loading ? (
          <p className="empty-note">Loading…</p>
        ) : (
          <table className="admin-table">
            <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Compare At</th><th>Stock</th><th>Badge</th><th>Actions</th></tr></thead>
            <tbody>
              {products.length ? products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <span className="row-thumb">{p.images && p.images[0] && <img src={resolveImage(p.images[0])} alt="" />}</span>
                    {p.name}
                  </td>
                  <td>{p.categoryLabel}</td>
                  <td>{money(p.price)}</td>
                  <td>{p.comparePrice > p.price ? money(p.comparePrice) : "—"}</td>
                  <td>{p.stock}</td>
                  <td>{p.badge || "—"}</td>
                  <td>
                    <button className="admin-btn sm" onClick={() => setEditing(p)}>Edit</button>{" "}
                    <button className="admin-btn sm danger" onClick={() => handleDelete(p)}>Delete</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={7} className="empty-note">No products yet. Click "Add Product" or run the seed script.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {editing !== undefined && (
        <ProductForm
          product={editing}
          onClose={() => setEditing(undefined)}
          onSaved={() => {
            setEditing(undefined);
            load();
          }}
        />
      )}
    </div>
  );
}
