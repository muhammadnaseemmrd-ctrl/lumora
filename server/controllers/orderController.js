const Product = require("../models/Product");
const Order = require("../models/Order");

function makeOrderNumber() {
  return "AB" + Date.now().toString().slice(-8);
}

// Shared helper: given [{productId, qty}], builds authoritative order lines
// from the database (never trusts client-sent prices) and returns totals.
async function buildOrderLines(items, shippingFee, freeShippingOver) {
  if (!Array.isArray(items) || !items.length) {
    throw new Error("Cart is empty");
  }
  const lines = [];
  for (const it of items) {
    const product = await Product.findById(it.productId);
    if (!product || !product.isActive) {
      throw new Error(`Product not found or unavailable: ${it.productId}`);
    }
    const qty = Math.max(1, Number(it.qty) || 1);
    lines.push({
      product: product._id,
      name: product.name,
      slug: product.slug,
      image: product.images[0] || "",
      price: product.price,
      qty,
      lineTotal: product.price * qty
    });
  }
  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const shipping = subtotal >= freeShippingOver ? 0 : shippingFee;
  return { lines, subtotal, shipping, total: subtotal + shipping };
}

// POST /api/orders
// body: { customer: {...}, items: [{productId, qty}], paymentMethod }
async function createOrder(req, res) {
  try {
    const { customer, items, paymentMethod } = req.body;
    if (!customer || !customer.fullName || !customer.phone || !customer.address || !customer.city) {
      return res.status(400).json({ message: "Missing required customer details" });
    }
    const SHIPPING_FEE = 200;
    const FREE_SHIPPING_OVER = 3000;
    const { lines, subtotal, shipping, total } = await buildOrderLines(items, SHIPPING_FEE, FREE_SHIPPING_OVER);

    const order = await Order.create({
      orderNumber: makeOrderNumber(),
      customer,
      items: lines,
      subtotal,
      shipping,
      total,
      paymentMethod: paymentMethod || "COD",
      paymentStatus: "Pending",
      status: "Pending"
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// GET /api/orders (admin)
async function getOrders(_req, res) {
  const orders = await Order.find({}).sort({ createdAt: -1 });
  res.json(orders);
}

// GET /api/orders/:id
async function getOrderById(req, res) {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
}

// GET /api/orders/number/:orderNumber (used by the order-success page, public)
async function getOrderByNumber(req, res) {
  const order = await Order.findOne({ orderNumber: req.params.orderNumber });
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
}

// PATCH /api/orders/:id/status (admin)
async function updateOrderStatus(req, res) {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  const { status, paymentStatus } = req.body;
  if (status) order.status = status;
  if (paymentStatus) order.paymentStatus = paymentStatus;
  await order.save();
  res.json(order);
}

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  getOrderByNumber,
  updateOrderStatus,
  buildOrderLines,
  makeOrderNumber
};
