const fs = require("fs");
const path = require("path");
const Product = require("../models/Product");
const { uploadDir } = require("../middleware/upload");

function toSlug(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseListField(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch (_e) {
    // not JSON — fall through to comma-split
  }
  return String(value)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// GET /api/products?category=skincare&search=serum
async function getProducts(req, res) {
  const filter = { isActive: true };
  if (req.query.category && req.query.category !== "all") {
    filter.category = req.query.category;
  }
  if (req.query.search) {
    filter.name = { $regex: req.query.search, $options: "i" };
  }
  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products);
}

// GET /api/products/all  (admin — includes inactive products)
async function getAllProductsAdmin(_req, res) {
  const products = await Product.find({}).sort({ createdAt: -1 });
  res.json(products);
}

// GET /api/products/:slug
async function getProductBySlug(req, res) {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
}

// GET /api/products/id/:id (admin — fetch by Mongo _id for editing)
async function getProductById(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
}

// POST /api/products (admin, multipart/form-data, field "images" = files)
async function createProduct(req, res) {
  const body = req.body;
  if (!body.name || !body.category || body.price === undefined) {
    return res.status(400).json({ message: "name, category and price are required" });
  }

  let slug = toSlug(body.slug || body.name);
  const existing = await Product.findOne({ slug });
  if (existing) slug = `${slug}-${Date.now().toString().slice(-4)}`;

  const uploadedImages = (req.files || []).map((f) => `/uploads/${f.filename}`);
  const linkedImages = parseListField(body.imageUrls); // optional external image URLs

  const product = await Product.create({
    name: body.name,
    slug,
    category: body.category,
    price: Number(body.price) || 0,
    comparePrice: Number(body.comparePrice) || 0,
    size: body.size || "",
    badge: body.badge || "",
    images: [...linkedImages, ...uploadedImages],
    shortDesc: body.shortDesc || "",
    description: body.description || "",
    benefits: parseListField(body.benefits),
    howToUse: body.howToUse || "",
    ingredients: body.ingredients || "",
    stock: body.stock !== undefined ? Number(body.stock) : 100,
    rating: body.rating !== undefined ? Number(body.rating) : 4.5,
    reviews: body.reviews !== undefined ? Number(body.reviews) : 0
  });

  res.status(201).json(product);
}

// PUT /api/products/:id (admin, multipart/form-data)
// body.existingImages = JSON array of image paths/URLs the admin wants to KEEP
// (anything removed from that list gets deleted from disk if it's a local upload).
// Newly uploaded files (req.files) are appended.
async function updateProduct(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const body = req.body;
  const keepImages = body.existingImages !== undefined ? parseListField(body.existingImages) : product.images;

  // Delete local files that were removed by the admin.
  const removed = product.images.filter((img) => !keepImages.includes(img));
  removed.forEach((img) => {
    if (img.startsWith("/uploads/")) {
      const filePath = path.join(uploadDir, path.basename(img));
      fs.unlink(filePath, () => {});
    }
  });

  const uploadedImages = (req.files || []).map((f) => `/uploads/${f.filename}`);

  if (body.name) product.name = body.name;
  if (body.category) product.category = body.category;
  if (body.price !== undefined) product.price = Number(body.price);
  if (body.comparePrice !== undefined) product.comparePrice = Number(body.comparePrice);
  if (body.size !== undefined) product.size = body.size;
  if (body.badge !== undefined) product.badge = body.badge;
  if (body.shortDesc !== undefined) product.shortDesc = body.shortDesc;
  if (body.description !== undefined) product.description = body.description;
  if (body.benefits !== undefined) product.benefits = parseListField(body.benefits);
  if (body.howToUse !== undefined) product.howToUse = body.howToUse;
  if (body.ingredients !== undefined) product.ingredients = body.ingredients;
  if (body.stock !== undefined) product.stock = Number(body.stock);
  if (body.isActive !== undefined) product.isActive = body.isActive === "true" || body.isActive === true;
  product.images = [...keepImages, ...uploadedImages];

  await product.save();
  res.json(product);
}

// DELETE /api/products/:id (admin)
async function deleteProduct(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  product.images.forEach((img) => {
    if (img.startsWith("/uploads/")) {
      const filePath = path.join(uploadDir, path.basename(img));
      fs.unlink(filePath, () => {});
    }
  });

  await product.deleteOne();
  res.json({ message: "Product deleted" });
}

module.exports = {
  getProducts,
  getAllProductsAdmin,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
