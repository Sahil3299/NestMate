const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    // Basic Info
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },

    // Profile Info
    avatar: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["seeker", "host"],
      required: [true, "Role (seeker or host) is required"],
    },
    age: {
      type: Number,
      min: [18, "Age must be at least 18"],
      max: [80, "Age cannot exceed 80"],
      default: null,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: null,
    },
    occupation: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
      default: null,
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },

    // Preferences (for seekers)
    preferences: {
      genderPreference: {
        type: String,
        enum: ["Male", "Female", "Any"],
        default: "Any",
      },
      vegetarian: {
        type: Boolean,
        default: false,
      },
      smokingAllowed: {
        type: Boolean,
        default: false,
      },
      petsAllowed: {
        type: Boolean,
        default: false,
      },
      guestAllowed: {
        type: Boolean,
        default: true,
      },
      budgetMin: {
        type: Number,
        default: null,
      },
      budgetMax: {
        type: Number,
        default: null,
      },
    },

    // Account Status
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // Password Reset & Email Verification Tokens
    emailVerificationToken: String,
    emailVerificationTokenExpiry: Date,
    passwordResetToken: String,
    passwordResetTokenExpiry: Date,

    // Last Login
    lastLogin: Date,

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// ═══════════════════════════════════════════════════════════════════════════
// INDEXES - email unique is already set in field definition
// ═══════════════════════════════════════════════════════════════════════════
userSchema.index({ city: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

// ═══════════════════════════════════════════════════════════════════════════
// MIDDLEWARE - Pre-save hooks
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hash password before saving if it has been modified
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const env = require("../config/environment");
    const salt = await bcrypt.genSalt(env.BCRYPT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Update updatedAt on every save
 */
userSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// ═══════════════════════════════════════════════════════════════════════════
// METHODS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Compare password with hashed password
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Generate email verification token
 */
userSchema.methods.generateEmailVerificationToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.emailVerificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return token;
};

/**
 * Generate password reset token
 */
userSchema.methods.generatePasswordResetToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.passwordResetTokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000);
  return token;
};

/**
 * Clear reset token
 */
userSchema.methods.clearPasswordResetToken = function () {
  this.passwordResetToken = undefined;
  this.passwordResetTokenExpiry = undefined;
};

/**
 * Get public profile (without sensitive data)
 */
userSchema.methods.getPublicProfile = function () {
  const userObj = this.toObject();
  delete userObj.password;
  delete userObj.emailVerificationToken;
  delete userObj.emailVerificationTokenExpiry;
  delete userObj.passwordResetToken;
  delete userObj.passwordResetTokenExpiry;
  return userObj;
};

module.exports = mongoose.model("User", userSchema);
