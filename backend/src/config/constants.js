/**
 * Application-wide constants
 */

module.exports = {
  // ═══════════════════════════════════════════════════════════════════════════
  // HTTP STATUS CODES
  // ═══════════════════════════════════════════════════════════════════════════
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    VALIDATION_ERROR: 422,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ERROR CODES
  // ═══════════════════════════════════════════════════════════════════════════
  ERROR_CODES: {
    // Authentication
    AUTH_MISSING: "AUTH_MISSING",
    AUTH_INVALID: "AUTH_INVALID",
    AUTH_EXPIRED: "AUTH_EXPIRED",
    CREDENTIALS_INVALID: "CREDENTIALS_INVALID",
    EMAIL_EXISTS: "EMAIL_EXISTS",
    EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED",

    // Authorization
    FORBIDDEN: "FORBIDDEN",
    INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS",

    // Validation
    VALIDATION_ERROR: "VALIDATION_ERROR",
    INVALID_INPUT: "INVALID_INPUT",
    INVALID_EMAIL: "INVALID_EMAIL",
    PASSWORD_TOO_WEAK: "PASSWORD_TOO_WEAK",

    // Resource
    NOT_FOUND: "NOT_FOUND",
    RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",
    CONFLICT: "CONFLICT",
    DUPLICATE_ENTRY: "DUPLICATE_ENTRY",

    // File upload
    FILE_TOO_LARGE: "FILE_TOO_LARGE",
    INVALID_FILE_TYPE: "INVALID_FILE_TYPE",
    UPLOAD_FAILED: "UPLOAD_FAILED",

    // Server
    INTERNAL_ERROR: "INTERNAL_ERROR",
    DATABASE_ERROR: "DATABASE_ERROR",
    EMAIL_SEND_FAILED: "EMAIL_SEND_FAILED",

    // Rate limiting
    RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
    TOO_MANY_ATTEMPTS: "TOO_MANY_ATTEMPTS",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // USER ROLES
  // ═══════════════════════════════════════════════════════════════════════════
  USER_ROLES: {
    SEEKER: "seeker", // Looking for a room/flatmate
    HOST: "host", // Renting out a room/listing
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LISTING TYPES
  // ═══════════════════════════════════════════════════════════════════════════
  LISTING_TYPES: {
    ROOM: "room",
    FLATMATE: "flatmate",
    PG: "pg",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ROOM TYPES
  // ═══════════════════════════════════════════════════════════════════════════
  ROOM_TYPES: [
    "Private Room",
    "Shared Room",
    "Full Apartment",
    "Studio",
    "1BHK",
    "2BHK",
    "3BHK",
    "PG",
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // FURNISHING TYPES
  // ═══════════════════════════════════════════════════════════════════════════
  FURNISHING_TYPES: [
    "Unfurnished",
    "Semi-furnished",
    "Furnished",
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // AMENITIES
  // ═══════════════════════════════════════════════════════════════════════════
  AMENITIES: [
    "WiFi",
    "AC",
    "Heating",
    "Kitchen",
    "Parking",
    "Laundry",
    "Balcony",
    "Gym",
    "Pool",
    "Garden",
    "TV",
    "Fridge",
    "Washing Machine",
    "Dryer",
    "Water Heater",
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // GENDER PREFERENCES
  // ═══════════════════════════════════════════════════════════════════════════
  GENDERS: [
    "Male",
    "Female",
    "Other",
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // MAJOR INDIAN CITIES
  // ═══════════════════════════════════════════════════════════════════════════
  INDIAN_CITIES: [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Chennai",
    "Kolkata",
    "Hyderabad",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Lucknow",
    "Chandigarh",
    "Indore",
    "Surat",
    "Vadodara",
    "Nashik",
    "Visakhapatnam",
    "Kochi",
    "Bhopal",
    "Vadodara",
    "Ghaziabad",
    "Ludhiana",
    "Nagpur",
    "Indore",
    "Kota",
    "Agra",
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGINATION
  // ═══════════════════════════════════════════════════════════════════════════
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TOKEN EXPIRY TIMES (in seconds)
  // ═══════════════════════════════════════════════════════════════════════════
  TOKEN_EXPIRY: {
    ACCESS: 15 * 60, // 15 minutes
    REFRESH: 7 * 24 * 60 * 60, // 7 days
    RESET_PASSWORD: 1 * 60 * 60, // 1 hour
    EMAIL_VERIFICATION: 24 * 60 * 60, // 24 hours
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // VALIDATION CONSTRAINTS
  // ═══════════════════════════════════════════════════════════════════════════
  VALIDATION: {
    // User
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100,
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_MAX_LENGTH: 128,
    BIO_MAX_LENGTH: 500,
    PHONE_LENGTH: 10,

    // Listing
    TITLE_MIN_LENGTH: 5,
    TITLE_MAX_LENGTH: 120,
    DESCRIPTION_MIN_LENGTH: 20,
    DESCRIPTION_MAX_LENGTH: 3000,
    RENT_MIN: 1000,
    RENT_MAX: 10000000,

    // Message
    MESSAGE_MIN_LENGTH: 1,
    MESSAGE_MAX_LENGTH: 2000,

    // Age
    AGE_MIN: 18,
    AGE_MAX: 80,

    // Review
    RATING_MIN: 1,
    RATING_MAX: 5,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // REGEX PATTERNS
  // ═══════════════════════════════════════════════════════════════════════════
  REGEX: {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    PHONE: /^\d{10}$/,
    COORDINATES: /^-?([0-8]?[0-9]|90)\.{1}\d{1,6}$/,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MESSAGE CONSTANTS
  // ═══════════════════════════════════════════════════════════════════════════
  MESSAGES: {
    // Success
    REGISTERED_SUCCESSFULLY: "User registered successfully. Please verify your email.",
    LOGGED_IN_SUCCESSFULLY: "Logged in successfully",
    TOKEN_REFRESHED: "Token refreshed successfully",
    PROFILE_UPDATED: "Profile updated successfully",
    LISTING_CREATED: "Listing created successfully",
    LISTING_UPDATED: "Listing updated successfully",
    LISTING_DELETED: "Listing deleted successfully",
    MESSAGE_SENT: "Message sent successfully",

    // Errors
    INVALID_CREDENTIALS: "Invalid email or password",
    EMAIL_ALREADY_EXISTS: "Email already registered",
    USER_NOT_FOUND: "User not found",
    LISTING_NOT_FOUND: "Listing not found",
    UNAUTHORIZED_ACCESS: "You don't have permission to perform this action",
    TOKEN_INVALID_OR_EXPIRED: "Token is invalid or expired",
    EMAIL_SEND_FAILED: "Failed to send email. Please try again later.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // FILE UPLOAD
  // ═══════════════════════════════════════════════════════════════════════════
  FILE_UPLOAD: {
    AVATAR_DIR: "avatars",
    LISTINGS_DIR: "listings",
    ALLOWED_MIME_TYPES: ["image/jpeg", "image/png", "image/webp"],
    ALLOWED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".webp"],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GEOSPATIAL
  // ═══════════════════════════════════════════════════════════════════════════
  GEOSPATIAL: {
    MAX_SEARCH_RADIUS_KM: 50,
    EARTH_RADIUS_KM: 6371,
  },
};
