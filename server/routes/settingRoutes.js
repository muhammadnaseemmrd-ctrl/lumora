const express = require("express");
const { getSettings, updateSettings } = require("../controllers/settingController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/", getSettings);
router.put("/", protect, adminOnly, updateSettings);

module.exports = router;
