import { useEffect, useState } from "react";
import api, { resolveImage } from "../api/api";

const EMPTY = {
  name: "", category: "skincare", price: "", comparePrice: "", size: "", badge: "",
  shortDesc: "", description: "", benefits: "", howToUse: "", ingredients: "", stock: 100
};

export default function ProductForm({ product, onClose, onSaved }) {
  const isEdit = !!product;
  const [fields, setFields] = useState(EMPTY);
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]); // [{file, previewUrl}]
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) {
      setFields({
        name: product.name || "",
        category: product.category || "skincare",
        price: product.price ?? "",
        comparePrice: product.comparePrice ?? "",
        size: product.size || "",
        badge: product.badge || "",
        shortDesc: product.shortDesc || "",
        description: product.description || "",
        benefits: (product.benefits || []).join("\n"),
        howToUse: product.howToUse || "",
        ingredients: product.ingredients || "",
        stock: product.stock ?? 100
      });
      setExistingImages(product.images || []);
    } else {
      setFields(EMPTY);
      setExistingImages([]);
    }
    setNewFiles([]);
  }, [product]);

  function update(key, value) {
    setFields((f) => ({ ...f, [key]: value }));
  }

  function handleFileSelect(e) {
    const files = Array.from(e.target.files || []);
    const withPreviews = files.map((file) => ({ file, previewUrl: URL.createObjectURL(file) }));
    setNewFiles((prev) => [...prev, ...withPreviews]);
    e.target.value = ""; // allow re-selecting the same file
  }

  function removeExisting(idx) {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  }
  function removeNew(idx) {
    setNewFiles((prev) => {
      URL.revokeObjectURL(prev[idx].previewUrl);
      return prev.filter((_, i) => i !== idx);
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!fields.name || !fields.price) {
      setError("Name and price are required.");
      return;
    }
    if (existingImages.length + newFiles.length === 0) {
      setError("Add at least one product image.");
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        if (key === "benefits") {
          const list = value.split("\n").map((s) => s.trim()).filter(Boolean);
          formData.append("benefits", JSON.stringify(list));
        } else {
          formData.append(key, value);
        }
      });
      formData.append("existingImages", JSON.stringify(existingImages));
      newFiles.forEach(({ file }) => formData.append("images", file));

      if (isEdit) {
        await api.put(`/products/${product._id}`, formData);
      } else {
        await api.post("/products", formData);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save product.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <h3>{isEdit ? "Edit Product" : "Add New Product"}</h3>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="full">
              <label>Product Name</label>
              <input value={fields.name} onChange={(e) => update("name", e.target.value)} required />
            </div>

            <div>
              <label>Category</label>
              <select value={fields.category} onChange={(e) => update("category", e.target.value)}>
                <option value="skincare">Skincare</option>
                <option value="haircare">Haircare</option>
                <option value="bodycare">Body Care</option>
                <option value="makeup">Makeup</option>
                <option value="bundles">Bundles</option>
              </select>
            </div>
            <div>
              <label>Badge</label>
              <select value={fields.badge} onChange={(e) => update("badge", e.target.value)}>
                <option value="">None</option>
                <option>Bestseller</option>
                <option>New</option>
                <option>Sale</option>
                <option>Bundle</option>
              </select>
            </div>

            <div>
              <label>Price (Rs.)</label>
              <input type="number" min="0" value={fields.price} onChange={(e) => update("price", e.target.value)} required />
            </div>
            <div>
              <label>Compare-at Price (Rs.)</label>
              <input type="number" min="0" value={fields.comparePrice} onChange={(e) => update("comparePrice", e.target.value)} />
            </div>

            <div>
              <label>Size / Variant</label>
              <input value={fields.size} onChange={(e) => update("size", e.target.value)} placeholder="e.g. 30ml" />
            </div>
            <div>
              <label>Stock Quantity</label>
              <input type="number" min="0" value={fields.stock} onChange={(e) => update("stock", e.target.value)} />
            </div>

            <div className="full">
              <label>Short Description</label>
              <input value={fields.shortDesc} onChange={(e) => update("shortDesc", e.target.value)} />
            </div>
            <div className="full">
              <label>Full Description</label>
              <textarea rows="3" value={fields.description} onChange={(e) => update("description", e.target.value)} />
            </div>
            <div className="full">
              <label>Benefits (one per line)</label>
              <textarea rows="3" value={fields.benefits} onChange={(e) => update("benefits", e.target.value)} />
            </div>
            <div>
              <label>How to Use</label>
              <textarea rows="2" value={fields.howToUse} onChange={(e) => update("howToUse", e.target.value)} />
            </div>
            <div>
              <label>Ingredients</label>
              <textarea rows="2" value={fields.ingredients} onChange={(e) => update("ingredients", e.target.value)} />
            </div>

            <div className="image-uploader">
              <label>Product Images (first image is the cover — supports multiple)</label>
              <div className="image-grid">
                {existingImages.map((img, i) => (
                  <div className={`image-thumb${i === 0 ? " cover" : ""}`} key={img}>
                    <img src={resolveImage(img)} alt="" />
                    <button type="button" className="remove-img" onClick={() => removeExisting(i)}>✕</button>
                  </div>
                ))}
                {newFiles.map((nf, i) => (
                  <div className={`image-thumb${existingImages.length + i === 0 ? " cover" : ""}`} key={nf.previewUrl}>
                    <img src={nf.previewUrl} alt="" />
                    <button type="button" className="remove-img" onClick={() => removeNew(i)}>✕</button>
                  </div>
                ))}
              </div>
              <label className="image-drop">
                📷 Click to add image(s) — JPG, PNG or WEBP, up to 5MB each
                <input type="file" accept="image/*" multiple onChange={handleFileSelect} />
              </label>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="admin-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="admin-btn primary" disabled={saving}>{saving ? "Saving…" : "Save Product"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
