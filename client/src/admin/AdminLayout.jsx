import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { STORE } from "../api/api";
import logoWhite from "../assets/logo-white.svg";
import "../styles/admin.css";

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  return (
    <div className="admin-root">
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="brand"><img src={logoWhite} alt={STORE.name} style={{ height: 24 }} /></div>
          <nav className="admin-nav">
            <NavLink to="/admin" end>📊 Dashboard</NavLink>
            <NavLink to="/admin/products">🧴 Products</NavLink>
            <NavLink to="/admin/orders">📦 Orders</NavLink>
            <NavLink to="/admin/settings">⚙️ Settings</NavLink>
            <a href="/" target="_blank" rel="noopener noreferrer">🌐 View Storefront</a>
          </nav>
          <button className="logout" onClick={handleLogout}>⎋ Log Out{user ? ` (${user.name})` : ""}</button>
        </aside>
        <main className="admin-main">
          <div className="demo-banner">
            ✅ Signed in as a real seeded admin account. Products, orders and settings here are stored in MongoDB.
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
