import { useEffect, useState } from "react";
import api from "../api/api";

export default function Settings() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get("/settings").then(({ data }) => setForm(data));
  }, []);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put("/settings", form);
      setForm(data);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  if (!form) return <p className="empty-note">Loading…</p>;

  return (
    <div>
      <div className="admin-topbar">
        <div><h1>Settings</h1><div className="sub">Store details, saved in MongoDB</div></div>
      </div>
      <div className="admin-card" style={{ maxWidth: 560 }}>
        <p className="text-muted" style={{ fontSize: ".82rem", marginBottom: 16 }}>
          These are saved for record-keeping and future use. The live storefront currently reads its displayed
          contact number/email/shipping rules from <code>client/.env</code> and the checkout's hard-coded shipping
          logic — see README.md "Wiring Settings into the storefront" for how to connect them.
        </p>
        {saved && <div className="alert alert-success">Settings saved.</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="full"><label>Store Name</label><input value={form.storeName} onChange={(e) => update("storeName", e.target.value)} /></div>
            <div><label>WhatsApp Number</label><input value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} placeholder="923001234567" /></div>
            <div><label>Support Email</label><input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} /></div>
            <div><label>City</label><input value={form.city} onChange={(e) => update("city", e.target.value)} /></div>
            <div><label>Shipping Fee (Rs.)</label><input type="number" value={form.shippingFee} onChange={(e) => update("shippingFee", e.target.value)} /></div>
            <div><label>Free Shipping Over (Rs.)</label><input type="number" value={form.freeShippingOver} onChange={(e) => update("freeShippingOver", e.target.value)} /></div>
          </div>
          <div className="modal-actions">
            <button type="submit" className="admin-btn primary" disabled={saving}>{saving ? "Saving…" : "Save Settings"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
