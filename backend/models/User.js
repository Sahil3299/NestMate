const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    firstName: {
      type: String,
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      select: false,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', ''],
    },
    age: {
      type: Number,
      min: [18, 'Must be at least 18'],
      max: [120, 'Age cannot exceed 120'],
    },
    profileImage: {
      type: String,
      default: '',
    },
    avatarPublicId: {
      type: String,
      default: '',
    },
    avatarPreset: {
      type: String,
      default: 'preset-1',
    },
    avatarMode: {
      type: String,
      enum: ['preset', 'upload'],
      default: 'preset',
    },
    city: {
      type: String,
      trim: true,
      lowercase: true,
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: '',
    },
    occupation: {
      type: String,
      trim: true,
      default: '',
    },
    occupationType: {
      type: String,
      enum: ['student', 'professional', 'other', ''],
      default: '',
    },
    preferences: {
      budgetMin: { type: Number, min: 0, default: 0 },
      budgetMax: { type: Number, min: 0, default: 0 },
    },
    lifestyle: {
      food: { type: String, enum: ['veg', 'non-veg', 'vegan', 'eggetarian', ''], default: '' },
      smoking: { type: String, enum: ['smoker', 'non-smoker', 'occasional', ''], default: '' },
      drinking: { type: String, enum: ['drinker', 'non-drinker', 'occasional', ''], default: '' },
      pets: { type: String, enum: ['has-pets', 'no-pets', 'pet-friendly', ''], default: '' },
      sleep: { type: String, enum: ['early-bird', 'night-owl', 'flexible', ''], default: '' },
      cleanliness: { type: String, enum: ['very-tidy', 'moderate', 'messy', ''], default: '' },
      workFromHome: { type: Boolean, default: false },
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    role: {
      type: String,
      enum: ['seeker', 'lister', 'both'],
      default: 'seeker',
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    otp: String,
    otpExpires: Date,
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpires;
        delete ret.otp;
        delete ret.otpExpires;
        delete ret.__v;
        return ret;
      },
    },
  }
);

userSchema.pre('save', async function (next) {
  // Sync names
  if ((this.isModified('firstName') || this.isModified('lastName')) && (this.firstName || this.lastName)) {
    this.name = `${this.firstName || ''} ${this.lastName || ''}`.trim();
  } else if (this.isModified('name') && this.name && (!this.firstName && !this.lastName)) {
    const parts = this.name.split(' ');
    this.firstName = parts[0] || '';
    this.lastName = parts.slice(1).join(' ') || '';
  }

  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
