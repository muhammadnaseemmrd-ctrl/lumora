const crypto = require("crypto");
const Order = require("../models/Order");

const stripe = process.env.STRIPE_SECRET_KEY
  ? require("stripe")(process.env.STRIPE_SECRET_KEY)
  : null;

/* =========================================================================
   STRIPE — card payments. Works today with a free Stripe test-mode account:
   https://dashboard.stripe.com/register  →  Developers → API keys.
   NOTE: Stripe does not currently support payouts to Pakistan-based bank
   accounts, so this is best used for demoing the flow, for customers who
   pay in other supported currencies/countries, or once you have a payout
   route set up (e.g. via a supported entity). See README.md.
   ========================================================================= */

// POST /api/payments/stripe/create-checkout-session   body: { orderId }
async function createStripeSession(req, res) {
  if (!stripe) {
    return res.status(500).json({ message: "Stripe is not configured. Add STRIPE_SECRET_KEY to server/.env" });
  }
  const order = await Order.findById(req.body.orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });

  const line_items = order.items.map((item) => ({
    price_data: {
      currency: "pkr",
      product_data: { name: item.name },
      unit_amount: Math.round(item.price * 100) // smallest currency unit
    },
    quantity: item.qty
  }));
  if (order.shipping > 0) {
    line_items.push({
      price_data: {
        currency: "pkr",
        product_data: { name: "Shipping" },
        unit_amount: Math.round(order.shipping * 100)
      },
      quantity: 1
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items,
    metadata: { orderId: order._id.toString(), orderNumber: order.orderNumber },
    success_url: `${process.env.CLIENT_URL}/order-success/${order.orderNumber}?payment=success`,
    cancel_url: `${process.env.CLIENT_URL}/checkout?payment=cancelled`
  });

  order.paymentMethod = "Stripe";
  order.paymentRef = session.id;
  await order.save();

  res.json({ url: session.url });
}

// POST /api/payments/stripe/webhook
// Registered in server.js with express.raw() so the signature can be verified.
async function stripeWebhook(req, res) {
  if (!stripe) return res.status(500).send("Stripe not configured");
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook signature verification failed: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata && session.metadata.orderId;
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "Paid",
        paymentRef: session.id,
        status: "Processing"
      });
    }
  }
  res.json({ received: true });
}

/* =========================================================================
   JAZZCASH — Pakistan mobile wallet / card gateway.
   Scaffold only: field names below follow JazzCash's commonly published
   "Mobile Wallet / Page Redirection" integration guide, but you MUST
   confirm exact field names, endpoint URL and hash algorithm against the
   integration document JazzCash gives you once your merchant account is
   approved (https://www.jazzcash.com.pk/business/) — request field lists
   have changed between merchant onboarding batches in the past.
   ========================================================================= */

function jazzCashSecureHash(params, integritySalt) {
  // JazzCash expects: sort all pp_ fields alphabetically by key, join their
  // VALUES with "&", prefix with the integrity salt, then HMAC-SHA256 it
  // using the integrity salt as the key.
  const sortedValues = Object.keys(params)
    .sort()
    .filter((k) => params[k] !== undefined && params[k] !== "")
    .map((k) => params[k]);
  const hashString = [integritySalt, ...sortedValues].join("&");
  return crypto.createHmac("sha256", integritySalt).update(hashString).digest("hex");
}

// POST /api/payments/jazzcash/initiate   body: { orderId }
// Returns the form fields the frontend should POST to JazzCash's checkout page.
async function initiateJazzCash(req, res) {
  if (!process.env.JAZZCASH_MERCHANT_ID) {
    return res.status(500).json({
      message: "JazzCash is not configured yet. Add JAZZCASH_MERCHANT_ID / JAZZCASH_PASSWORD / JAZZCASH_HASH_KEY to server/.env once your merchant account is approved."
    });
  }
  const order = await Order.findById(req.body.orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });

  const now = new Date();
  const txnDateTime = now.toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
  const expiry = new Date(now.getTime() + 60 * 60 * 1000)
    .toISOString()
    .replace(/[-:T.Z]/g, "")
    .slice(0, 14);

  const fields = {
    pp_Version: "1.1",
    pp_TxnType: "MWALLET",
    pp_Language: "EN",
    pp_MerchantID: process.env.JAZZCASH_MERCHANT_ID,
    pp_Password: process.env.JAZZCASH_PASSWORD,
    pp_TxnRefNo: order.orderNumber,
    pp_Amount: String(Math.round(order.total * 100)), // in paisas
    pp_TxnCurrency: "PKR",
    pp_TxnDateTime: txnDateTime,
    pp_TxnExpiryDateTime: expiry,
    pp_BillReference: order.orderNumber,
    pp_Description: `Lumora Beauty order ${order.orderNumber}`,
    pp_ReturnURL: process.env.JAZZCASH_RETURN_URL
  };
  fields.pp_SecureHash = jazzCashSecureHash(fields, process.env.JAZZCASH_HASH_KEY);

  const endpoint =
    process.env.JAZZCASH_ENV === "live"
      ? "https://payments.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/"
      : "https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/";

  order.paymentMethod = "JazzCash";
  order.paymentRef = order.orderNumber;
  await order.save();

  res.json({ endpoint, fields });
}

// POST /api/payments/jazzcash/callback  (JazzCash redirects the customer's
// browser here with the transaction result as form fields)
async function jazzCashCallback(req, res) {
  const { pp_TxnRefNo, pp_ResponseCode } = req.body;
  const order = await Order.findOne({ orderNumber: pp_TxnRefNo });
  if (order) {
    order.paymentStatus = pp_ResponseCode === "000" ? "Paid" : "Failed";
    if (pp_ResponseCode === "000") order.status = "Processing";
    await order.save();
  }
  const outcome = pp_ResponseCode === "000" ? "success" : "failed";
  res.redirect(`${process.env.CLIENT_URL}/order-success/${pp_TxnRefNo}?payment=${outcome}`);
}

/* =========================================================================
   EASYPAISA — same idea as JazzCash: scaffold with placeholders. Confirm
   exact field names/endpoint against the integration guide you receive
   after merchant approval (https://easypaisa.com.pk/business/).
   ========================================================================= */

// POST /api/payments/easypaisa/initiate   body: { orderId }
async function initiateEasyPaisa(req, res) {
  if (!process.env.EASYPAISA_STORE_ID) {
    return res.status(500).json({
      message: "EasyPaisa is not configured yet. Add EASYPAISA_STORE_ID / EASYPAISA_HASH_KEY to server/.env once your merchant account is approved."
    });
  }
  const order = await Order.findById(req.body.orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });

  const fields = {
    storeId: process.env.EASYPAISA_STORE_ID,
    orderRefNum: order.orderNumber,
    amount: order.total.toFixed(2),
    postBackURL: process.env.EASYPAISA_RETURN_URL,
    merchantHashedReq: "" // computed per EasyPaisa's documented algorithm using EASYPAISA_HASH_KEY
  };
  const raw = `${fields.storeId}&${fields.amount}&${fields.orderRefNum}&${process.env.EASYPAISA_HASH_KEY}`;
  fields.merchantHashedReq = crypto.createHash("sha256").update(raw).digest("hex");

  const endpoint =
    process.env.EASYPAISA_ENV === "live"
      ? "https://easypay.easypaisa.com.pk/easypay/Index.jsf"
      : "https://easypaystg.easypaisa.com.pk/easypay/Index.jsf";

  order.paymentMethod = "EasyPaisa";
  order.paymentRef = order.orderNumber;
  await order.save();

  res.json({ endpoint, fields });
}

// POST /api/payments/easypaisa/callback
async function easyPaisaCallback(req, res) {
  const { orderRefNum, status } = req.body;
  const order = await Order.findOne({ orderNumber: orderRefNum });
  if (order) {
    order.paymentStatus = status === "SUCCESS" ? "Paid" : "Failed";
    if (status === "SUCCESS") order.status = "Processing";
    await order.save();
  }
  const outcome = status === "SUCCESS" ? "success" : "failed";
  res.redirect(`${process.env.CLIENT_URL}/order-success/${orderRefNum}?payment=${outcome}`);
}

module.exports = {
  createStripeSession,
  stripeWebhook,
  initiateJazzCash,
  jazzCashCallback,
  initiateEasyPaisa,
  easyPaisaCallback
};
