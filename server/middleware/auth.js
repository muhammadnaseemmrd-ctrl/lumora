const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verifies the JWT sent in the Authorization header and attaches req.user.
async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "Not authorized, user not found" });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, invalid or expired token" });
  }
}

// Restricts a route to admin/staff roles (both are allowed to manage the store here).
function adminOnly(req, res, next) {
  if (req.user && (req.user.role === "admin" || req.user.role === "staff")) {
    return next();
  }
  return res.status(403).json({ message: "Admin access required" });
}

module.exports = { protect, adminOnly };
