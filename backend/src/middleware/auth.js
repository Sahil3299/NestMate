const jwt = require("jsonwebtoken");
const env = require("../config/environment");
const { AuthenticationError, AuthorizationError } = require("../utils/errors");

/**
 * Middleware to verify JWT token from Authorization header
 * Token should be in format: "Bearer <token>"
 */
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AuthenticationError("No token provided");
    }

    const token = authHeader.replace("Bearer ", "").trim();

    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = { id: decoded.userId, email: decoded.email, role: decoded.role };

    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return next(error);
    }

    if (error.name === "TokenExpiredError") {
      return next(new AuthenticationError("Token has expired"));
    }

    if (error.name === "JsonWebTokenError") {
      return next(new AuthenticationError("Invalid token"));
    }

    next(new AuthenticationError("Authentication failed"));
  }
};

/**
 * Middleware to check if user has specific role
 * Usage: authorize("host", "admin")
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AuthenticationError("User not authenticated"));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AuthorizationError(
          `This action requires one of these roles: ${roles.join(", ")}`
        )
      );
    }

    next();
  };
};

/**
 * Optional authentication - doesn't fail if token is missing, but attaches user if valid
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "").trim();
      const decoded = jwt.verify(token, env.JWT_SECRET);
      req.user = { id: decoded.userId, email: decoded.email, role: decoded.role };
    }
  } catch (error) {
    // Silently ignore errors, continue without user
  }

  next();
};

// Keep old exports for backwards compatibility
async function requireAuth(req, res, next) {
  return authenticate(req, res, next);
}

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
  requireAuth, // backwards compat
};

