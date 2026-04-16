const { HTTP_STATUS, ERROR_CODES } = require("../config/constants");

/**
 * Base application error class
 * All custom errors should extend this
 */
class AppError extends Error {
  constructor(message, statusCode, errorCode, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.timestamp = new Date();

    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      success: false,
      error: {
        code: this.errorCode,
        message: this.message,
        details: this.details,
        timestamp: this.timestamp,
      },
    };
  }
}

/**
 * Validation error - 422 Unprocessable Entity
 */
class ValidationError extends AppError {
  constructor(message = "Validation failed", details = null) {
    super(
      message,
      HTTP_STATUS.VALIDATION_ERROR,
      ERROR_CODES.VALIDATION_ERROR,
      details
    );
    this.name = "ValidationError";
  }
}

/**
 * Authentication error - 401 Unauthorized
 */
class AuthenticationError extends AppError {
  constructor(message = "Authentication failed") {
    super(
      message,
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.AUTH_INVALID
    );
    this.name = "AuthenticationError";
  }
}

/**
 * Authorization error - 403 Forbidden
 */
class AuthorizationError extends AppError {
  constructor(message = "Access denied") {
    super(
      message,
      HTTP_STATUS.FORBIDDEN,
      ERROR_CODES.FORBIDDEN
    );
    this.name = "AuthorizationError";
  }
}

/**
 * Not found error - 404 Not Found
 */
class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(
      message,
      HTTP_STATUS.NOT_FOUND,
      ERROR_CODES.NOT_FOUND
    );
    this.name = "NotFoundError";
  }
}

/**
 * Conflict error - 409 Conflict
 */
class ConflictError extends AppError {
  constructor(message = "Resource conflict") {
    super(
      message,
      HTTP_STATUS.CONFLICT,
      ERROR_CODES.CONFLICT
    );
    this.name = "ConflictError";
  }
}

/**
 * Bad request error - 400 Bad Request
 */
class BadRequestError extends AppError {
  constructor(message = "Invalid request") {
    super(
      message,
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.INVALID_INPUT
    );
    this.name = "BadRequestError";
  }
}

/**
 * Rate limit error - 429 Too Many Requests
 */
class RateLimitError extends AppError {
  constructor(message = "Too many requests") {
    super(
      message,
      429,
      ERROR_CODES.RATE_LIMIT_EXCEEDED
    );
    this.name = "RateLimitError";
  }
}

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  BadRequestError,
  RateLimitError,
};
