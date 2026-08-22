/* ==========================================================================
   Lumora Beauty — Auto-seed on first boot
   Runs automatically from server.js once the MongoDB connection opens.
   Non-destructive: creates the real admin user only if it doesn't exist yet,
   and inserts the 10 starter products only if the products collection is
   empty. Safe to leave in place permanently — later restarts/redeploys are
   no-ops once real data exists.
   ========================================================================== */

const User = require("../models/User");
const Product = require("../models/Product");

const pexels = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=900`;

const products = [
  {
    name: "Vitamin C Brightening Serum",
    slug: "vitamin-c-brightening-serum",
    category: "skincare",
    price: 1850,
    comparePrice: 2300,
    size: "30ml",
    badge: "Bestseller",
    images: [pexels(4841388), pexels(3762882), pexels(34939744)],
    shortDesc: "Daily glow booster for dull, uneven skin.",
    description:
      "A fast-absorbing serum formulated with stabilized Vitamin C to visibly brighten skin tone, fade dark spots, and protect against everyday environmental stress. Lightweight enough for daily morning use under moisturizer or sunscreen.",
    benefits: [
      "Brightens dull and uneven skin tone",
      "Fades dark spots & post-acne marks",
      "Boosts collagen for firmer skin",
      "Lightweight, non-greasy, fast-absorbing"
    ],
    howToUse: "Apply 3-4 drops to clean, dry face and neck every morning. Follow with moisturizer and SPF.",
    ingredients: "Vitamin C (Ascorbic Acid), Hyaluronic Acid, Vitamin E, Aloe Vera Extract",
    rating: 4.8,
    reviews: 212,
    stock: 120
  },
  {
    name: "24K Gold Radiance Cream",
    slug: "24k-gold-radiance-cream",
    category: "skincare",
    price: 2150,
    comparePrice: 2650,
    size: "50g",
    badge: "Bestseller",
    images: [pexels(13794471), pexels(9475732)],
    shortDesc: "Luxury anti-aging glow cream.",
    description:
      "An indulgent anti-aging cream infused with 24K gold particles that firms, brightens, and restores a youthful radiance — perfect as a daily moisturizer or occasional facial treatment.",
    benefits: [
      "Visibly firms and lifts skin",
      "Deep hydration for 24 hours",
      "Anti-aging & brightening complex",
      "Luxurious lightweight finish"
    ],
    howToUse: "Apply a thin layer to clean face, massage upward in circular motions. Use morning and/or night.",
    ingredients: "24K Gold Extract, Shea Butter, Collagen Peptides, Vitamin E",
    rating: 4.9,
    reviews: 301,
    stock: 90
  },
  {
    name: "Argan Hair Growth Oil",
    slug: "argan-hair-growth-oil",
    category: "haircare",
    price: 1950,
    comparePrice: 2400,
    size: "180ml",
    badge: "Bestseller",
    images: [pexels(33794923), pexels(14656188)],
    shortDesc: "Nourishes roots, boosts shine.",
    description:
      "A rich blend of Argan and nourishing herbal oils that strengthens hair from root to tip, reduces breakage, and restores natural shine and softness.",
    benefits: [
      "Strengthens roots & reduces breakage",
      "Adds natural shine & softness",
      "Deeply nourishes dry, damaged hair",
      "Lightweight, non-greasy formula"
    ],
    howToUse: "Massage into scalp and lengths 2-3 times a week. Leave for at least 1 hour or overnight, then shampoo.",
    ingredients: "Argan Oil, Almond Oil, Castor Oil, Vitamin E",
    rating: 4.8,
    reviews: 256,
    stock: 110
  },
  {
    name: "Keratin Repair Shampoo",
    slug: "keratin-repair-shampoo",
    category: "haircare",
    price: 1350,
    comparePrice: 1600,
    size: "200ml",
    badge: "Sale",
    images: [pexels(3735627)],
    shortDesc: "Sulfate-free daily repair wash.",
    description:
      "A sulfate-free shampoo enriched with keratin proteins that rebuilds hair strength, smooths frizz, and leaves hair soft and manageable after every wash.",
    benefits: [
      "Rebuilds & strengthens hair fiber",
      "Reduces frizz and split ends",
      "Sulfate & paraben free",
      "Safe for color-treated hair"
    ],
    howToUse: "Apply to wet hair, massage into a lather, rinse thoroughly. Follow with conditioner or hair mask.",
    ingredients: "Hydrolyzed Keratin, Argan Oil, Panthenol, Mild Surfactants",
    rating: 4.6,
    reviews: 178,
    stock: 140
  },
  {
    name: "Brightening Body Lotion",
    slug: "brightening-body-lotion",
    category: "bodycare",
    price: 1250,
    comparePrice: 1500,
    size: "200ml",
    badge: "Sale",
    images: [pexels(33537354), pexels(7281294), pexels(286951)],
    shortDesc: "Deep hydration with a healthy glow.",
    description:
      "An advanced-formula body lotion that hydrates deeply for 24 hours while gradually evening out skin tone for a healthy, natural glow.",
    benefits: [
      "24-hour deep hydration",
      "Gradually evens skin tone",
      "Fast-absorbing, non-sticky",
      "Light, pleasant fragrance"
    ],
    howToUse: "Apply all over body after shower, massaging until fully absorbed. Use daily for best results.",
    ingredients: "Niacinamide, Shea Butter, Vitamin E, Glycerin",
    rating: 4.6,
    reviews: 104,
    stock: 130
  },
  {
    name: "Organic Handmade Soap Trio",
    slug: "organic-handmade-soap-trio",
    category: "bodycare",
    price: 1190,
    comparePrice: 1550,
    size: "3 x 100g",
    badge: "New",
    images: [pexels(10568476), pexels(10574059)],
    shortDesc: "Pure & natural cleansing set.",
    description:
      "A set of three handcrafted soaps made with natural oils and botanical extracts for a gentle, chemical-free cleanse that's kind to sensitive skin.",
    benefits: [
      "100% natural ingredients",
      "Gentle on sensitive skin",
      "Handcrafted in small batches",
      "Great gift set option"
    ],
    howToUse: "Lather onto wet skin during bath or shower, rinse thoroughly.",
    ingredients: "Olive Oil, Coconut Oil, Shea Butter, Essential Oils",
    rating: 4.7,
    reviews: 76,
    stock: 80
  },
  {
    name: "Matte Finish Liquid Foundation",
    slug: "matte-finish-liquid-foundation",
    category: "makeup",
    price: 2450,
    comparePrice: 2900,
    size: "30ml",
    badge: "Bestseller",
    images: [pexels(10107538), pexels(32426538)],
    shortDesc: "Long-wear buildable coverage.",
    description:
      "A lightweight, buildable liquid foundation that delivers a natural matte finish with medium-to-full coverage that lasts all day without caking.",
    benefits: [
      "Long-lasting matte finish",
      "Buildable medium-to-full coverage",
      "Lightweight, breathable feel",
      "Available in multiple shades"
    ],
    howToUse: "Apply with a brush, sponge, or fingers starting from the center of the face, blending outward.",
    ingredients: "Dimethicone, Titanium Dioxide, Vitamin E, Silica",
    rating: 4.6,
    reviews: 143,
    stock: 70
  },
  {
    name: "Everyday Glow Compact Powder",
    slug: "everyday-glow-compact-powder",
    category: "makeup",
    price: 1650,
    comparePrice: 1950,
    size: "12g",
    badge: "Sale",
    images: [pexels(2417855), pexels(354962)],
    shortDesc: "Silky setting powder for all-day glow.",
    description:
      "A finely-milled compact powder that sets makeup, controls shine, and leaves a soft, natural glow that lasts throughout the day.",
    benefits: [
      "Sets makeup for all-day wear",
      "Controls shine, not flat matte",
      "Silky, lightweight texture",
      "Comes with mirror & applicator"
    ],
    howToUse: "Press lightly onto face using the included sponge or a powder brush, focusing on the T-zone.",
    ingredients: "Talc, Mica, Silica, Vitamin E",
    rating: 4.5,
    reviews: 98,
    stock: 85
  },
  {
    name: "Glow Getter Skincare Bundle",
    slug: "glow-getter-skincare-bundle",
    category: "bundles",
    price: 3900,
    comparePrice: 5600,
    size: "Serum + Cream",
    badge: "Bundle",
    images: [pexels(4841388), pexels(13794471)],
    shortDesc: "Complete brightening routine, save 30%.",
    description:
      "Everything you need for a glowing complexion in one set: our Vitamin C Brightening Serum and 24K Gold Radiance Cream — bundled at a special price.",
    benefits: [
      "Complete AM/PM brightening routine",
      "Save 30% vs buying separately",
      "Great starter set or gift",
      "Suitable for most skin types"
    ],
    howToUse: "Apply the serum first, then seal in moisture with the cream — morning and night.",
    ingredients: "See individual products for full ingredient lists.",
    rating: 4.9,
    reviews: 167,
    stock: 60
  },
  {
    name: "Hair Revival Combo",
    slug: "hair-revival-combo",
    category: "bundles",
    price: 3600,
    comparePrice: 5000,
    size: "Oil + Shampoo",
    badge: "Bundle",
    images: [pexels(33794923), pexels(3735627)],
    shortDesc: "Full hair-fall recovery routine, save 28%.",
    description:
      "A hair-recovery routine combining our Argan Hair Growth Oil and Keratin Repair Shampoo — formulated to work together for visibly stronger, fuller-looking hair.",
    benefits: [
      "Targets hair fall from every angle",
      "Save 28% vs buying separately",
      "Root-strengthening routine",
      "Great for gifting"
    ],
    howToUse: "Oil twice weekly before wash day, then shampoo with the keratin wash.",
    ingredients: "See individual products for full ingredient lists.",
    rating: 4.8,
    reviews: 112,
    stock: 55
  }
];

async function autoSeed() {
  const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const admin = await User.create({
        name: process.env.ADMIN_NAME || "Store Owner",
        email: adminEmail,
        password: adminPassword,
        role: "admin"
      });
      console.log(`[auto-seed] Created real admin user: ${admin.email}`);
    }
  } else {
    console.warn("[auto-seed] ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin creation.");
  }

  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    await Product.insertMany(products);
    console.log(`[auto-seed] Inserted ${products.length} starter products (2 per category).`);
  }
}

module.exports = autoSeed;
