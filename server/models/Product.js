const mongoose = require("mongoose");

const CATEGORY_LABELS = {
  skincare: "Skincare",
  haircare: "Haircare",
  bodycare: "Body Care",
  makeup: "Makeup",
  bundles: "Bundles"
};

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    category: {
      type: String,
      required: true,
      enum: Object.keys(CATEGORY_LABELS)
    },
    price: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number, default: 0, min: 0 },
    size: { type: String, default: "" },
    badge: { type: String, enum: ["", "Bestseller", "New", "Sale", "Bundle"], default: "" },
    // Multiple images per product. Each entry is a path served statically
    // from /uploads (set by the image upload middleware) OR a full URL
    // (used by the seed data, which links to freely-licensed stock photos).
    images: { type: [String], default: [] },
    shortDesc: { type: String, default: "" },
    description: { type: String, default: "" },
    benefits: { type: [String], default: [] },
    howToUse: { type: String, default: "" },
    ingredients: { type: String, default: "" },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },
    stock: { type: Number, default: 100, min: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

productSchema.virtual("categoryLabel").get(function () {
  return CATEGORY_LABELS[this.category] || this.category;
});
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

productSchema.statics.CATEGORY_LABELS = CATEGORY_LABELS;

module.exports = mongoose.model("Product", productSchema);
