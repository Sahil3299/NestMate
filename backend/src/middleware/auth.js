const jwt = require("jsonwebtoken");
const env = require("../config/env");

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing Bearer token" });
    }

    const token = authHeader.slice("Bearer ".length);
    const decoded = jwt.verify(token, env.JWT_SECRET);

    req.user = {
      uid: decoded.uid,
      email: decoded.email,
    };

    return next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

module.exports = { requireAuth };

