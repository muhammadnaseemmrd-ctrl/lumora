const express = require("express");
const {
  createStripeSession,
  initiateJazzCash,
  jazzCashCallback,
  initiateEasyPaisa,
  easyPaisaCallback
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/stripe/create-checkout-session", createStripeSession);
// stripeWebhook is mounted separately in server.js (needs raw body, not JSON-parsed)

router.post("/jazzcash/initiate", initiateJazzCash);
router.post("/jazzcash/callback", express.urlencoded({ extended: true }), jazzCashCallback);

router.post("/easypaisa/initiate", initiateEasyPaisa);
router.post("/easypaisa/callback", express.urlencoded({ extended: true }), easyPaisaCallback);

module.exports = router;
