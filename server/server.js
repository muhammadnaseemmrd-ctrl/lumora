require("dotenv").config();
require("express-async-errors"); // lets async route handlers throw and still hit errorHandler

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const autoSeed = require("./seed/autoSeed");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const { stripeWebhook } = require("./controllers/paymentController");
const Product = require("./models/Product");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const settingRoutes = require("./routes/settingRoutes");

connectDB();

// First-boot only: creates the real admin user (from ADMIN_EMAIL/ADMIN_PASSWORD
// env vars) and inserts the 10 starter products if the database is empty.
// Safe to leave running — it no-ops once an admin/products already exist, so
// it never overwrites real data on later restarts or redeploys.
mongoose.connection.once("open", () => {
  autoSeed().catch((err) => console.error("[auto-seed] Unexpected error:", err));
});

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(morgan("dev"));

// Stripe webhook must read the RAW body for signature verification, so this
// is registered before the global express.json() body parser below.
app.post("/api/payments/stripe/webhook", express.raw({ type: "application/json" }), stripeWebhook);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (_req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

// Dynamic sitemap, always in sync with the live product catalog. In
// production, point your frontend domain's /sitemap.xml at this endpoint
// (see netlify.toml's redirect, or your host's proxy/rewrite equivalent).
app.get("/sitemap.xml", async (_req, res) => {
  const SITE = "https://www.lumorabeauty.pk";
  const staticUrls = [
    { loc: `${SITE}/`, priority: "1.0" },
    { loc: `${SITE}/shop`, priority: "0.9" },
    { loc: `${SITE}/category/skincare`, priority: "0.8" },
    { loc: `${SITE}/category/haircare`, priority: "0.8" },
    { loc: `${SITE}/category/bodycare`, priority: "0.8" },
    { loc: `${SITE}/category/makeup`, priority: "0.8" },
    { loc: `${SITE}/category/bundles`, priority: "0.8" },
    { loc: `${SITE}/about`, priority: "0.6" },
    { loc: `${SITE}/contact`, priority: "0.6" },
    { loc: `${SITE}/privacy-policy`, priority: "0.3" },
    { loc: `${SITE}/terms-conditions`, priority: "0.3" },
    { loc: `${SITE}/shipping-returns`, priority: "0.4" }
  ];
  const products = await Product.find({ isActive: true }).select("slug updatedAt");
  const productUrls = products.map((p) => ({
    loc: `${SITE}/product/${p.slug}`,
    priority: "0.7",
    lastmod: p.updatedAt ? p.updatedAt.toISOString().slice(0, 10) : undefined
  }));
  const all = [...staticUrls, ...productUrls];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${all
    .map(
      (u) =>
        `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}<priority>${u.priority}</priority></url>`
    )
    .join("\n")}\n</urlset>`;
  res.type("application/xml").send(xml);
});
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/settings", settingRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Lumora Beauty API running at http://localhost:${PORT}`));
