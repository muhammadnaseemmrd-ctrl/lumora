import axios from "axios";

const API_BASE_URL = "https://lumora-beauty-api-production.up.railway.app/api";

const api = axios.create({
  baseURL: API_BASE_URL
});

// Attach the admin JWT (if present) to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("aura_admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const STORE = {
  name: "Lumora Beauty",
  whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || "923001234567",
  email: import.meta.env.VITE_STORE_EMAIL || "hello@lumorabeauty.pk",
  city: import.meta.env.VITE_STORE_CITY || "Rawalpindi, Pakistan",
  shippingFee: 200,
  freeShippingOver: 3000,
  currency: "Rs."
};

export function money(n) {
  return STORE.currency + Number(n || 0).toLocaleString("en-PK");
}

// Resolves a product image path returned by the API into a full URL —
// uploaded images come back as "/uploads/xyz.jpg" (relative to the API
// server), external seed images are already full URLs.
export function resolveImage(path) {
  if (!path) return "";
  if (/^https?:\/\//.test(path)) return path;
  const base = API_BASE_URL.replace(/\/api\/?$/, "");
  return `${base}${path}`;
}

export default api;
