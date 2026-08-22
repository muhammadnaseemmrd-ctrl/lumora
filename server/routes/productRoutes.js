const express = require("express");
const {
  getProducts,
  getAllProductsAdmin,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/auth");
const { uploadProductImages } = require("../middleware/upload");

const router = express.Router();

// Public storefront routes
router.get("/", getProducts);

// Admin routes (declared before the "/:slug" catch-all so they aren't shadowed)
router.get("/admin/all", protect, adminOnly, getAllProductsAdmin);
router.get("/id/:id", protect, adminOnly, getProductById);
router.post("/", protect, adminOnly, uploadProductImages, createProduct);
router.put("/:id", protect, adminOnly, uploadProductImages, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

// Public single-product lookup by slug (keep last — it's a catch-all param route)
router.get("/:slug", getProductBySlug);

module.exports = router;
