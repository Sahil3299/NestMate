// backend/src/middleware/validate.js
const { ZodError } = require("zod");
const AppError = require("../utils/AppError");

/**
 * validate(schema) — middleware factory
 * schema is a Zod object with optional .shape.body / .shape.params / .shape.query
 */
const validate = (schema) => (req, res, next) => {
  try {
    const result = schema.parse({
      body:   req.body,
      params: req.params,
      query:  req.query,
    });
    // Merge validated + coerced values back
    if (result.body)   req.body   = result.body;
    if (result.params) req.params = result.params;
    if (result.query)  req.query  = result.query;
    next();
  } catch (err) {
    if (err instanceof ZodError) {
        const issues = err.errors || err.issues || [];
        const messages = issues.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ");
      return next(new AppError(`Validation failed — ${messages}`, 400));
    }
    next(err);
  }
};

module.exports = validate;
