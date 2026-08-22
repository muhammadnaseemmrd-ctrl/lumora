const express = require("express");
const {
  createOrder,
  getOrders,
  getOrderById,
  getOrderByNumber,
  updateOrderStatus
} = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.post("/", createOrder);
router.get("/number/:orderNumber", getOrderByNumber);

router.get("/", protect, adminOnly, getOrders);
router.get("/:id", protect, adminOnly, getOrderById);
router.patch("/:id/status", protect, adminOnly, updateOrderStatus);

module.exports = router;
