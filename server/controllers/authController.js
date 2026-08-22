const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// POST /api/auth/login
// Real admin login — credentials come from the seeded User document
// (created by seed/seed.js from your .env ADMIN_EMAIL / ADMIN_PASSWORD).
async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token: generateToken(user._id)
  });
}

// GET /api/auth/me
async function me(req, res) {
  res.json({ user: req.user });
}

module.exports = { login, me };
