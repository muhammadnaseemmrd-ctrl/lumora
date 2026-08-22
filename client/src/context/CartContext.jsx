import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const CART_KEY = "aura_cart";

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (_e) {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  function addToCart(product, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product._id);
      if (existing) {
        return prev.map((i) => (i.productId === product._id ? { ...i, qty: i.qty + qty } : i));
      }
      return [
        ...prev,
        {
          productId: product._id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.images && product.images[0],
          qty
        }
      ];
    });
  }

  function removeFromCart(productId) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function setQty(productId, qty) {
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, qty: Math.max(1, qty) } : i)));
  }

  function clearCart() {
    setItems([]);
  }

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, setQty, clearCart, count, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
