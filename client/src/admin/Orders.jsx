import { useEffect, useState } from "react";
import api from "../api/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders").then(({ data }) => setOrders(data)).catch(() => setOrders([]));
  }, []);

  return (
    <div className="admin-orders container">
      <h1>Orders</h1>
      {orders.length ? (
        <ul>
          {orders.map((o) => (
            <li key={o._id}>{o.orderNumber} — {o.total}</li>
          ))}
        </ul>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
}
