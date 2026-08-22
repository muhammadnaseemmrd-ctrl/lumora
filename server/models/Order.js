const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    slug: String,
    image: String,
    price: Number,
    qty: Number,
    lineTotal: Number
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      email: String,
      address: { type: String, required: true },
      city: { type: String, required: true },
      postal: String,
      notes: String
    },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["COD", "BankTransfer", "Stripe", "JazzCash", "EasyPaisa"],
      default: "COD"
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending"
    },
    paymentRef: { type: String, default: "" }, // Stripe session id / JazzCash txn ref etc.
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
