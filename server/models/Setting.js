const mongoose = require("mongoose");

// Single-document collection holding store-wide settings, editable from the
// admin panel. See README.md for how to wire these into the storefront
// (it currently reads contact info from client/.env for simplicity).
const settingSchema = new mongoose.Schema(
  {
    storeName: { type: String, default: "Lumora Beauty" },
    whatsapp: { type: String, default: "923001234567" },
    email: { type: String, default: "hello@lumorabeauty.pk" },
    city: { type: String, default: "Rawalpindi, Pakistan" },
    shippingFee: { type: Number, default: 200 },
    freeShippingOver: { type: Number, default: 3000 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Setting", settingSchema);
