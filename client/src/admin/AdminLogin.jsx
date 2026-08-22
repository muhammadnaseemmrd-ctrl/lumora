import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { STORE } from "../api/api";
import logo from "../assets/logo.svg";
import "../styles/admin.css";

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-root">
      <div className="admin-login-wrap">
        <div className="admin-login-card">
          <img src={logo} alt={STORE.name} />
          <h1>Admin Login</h1>
          <p>Sign in to manage products, orders &amp; settings</p>
          {error && <div className="login-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign In"}</button>
          </form>
          <div className="admin-hint">
            This account is created by the seed script from <code>server/.env</code> (<code>ADMIN_EMAIL</code> /{" "}
            <code>ADMIN_PASSWORD</code>) — it's a real login, not a shared demo password. Ask whoever set up the store
            for the credentials, or re-run <code>npm run seed</code> after updating <code>.env</code>.
          </div>
        </div>
      </div>
    </div>
  );
}
