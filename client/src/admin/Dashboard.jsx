import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="admin-dashboard container">
      <h1>Admin Dashboard</h1>
      <p>Quick links</p>
      <ul>
        <li><Link to="/admin/products">Products</Link></li>
        <li><Link to="/admin/orders">Orders</Link></li>
        <li><Link to="/admin/settings">Settings</Link></li>
      </ul>
    </div>
  );
}
