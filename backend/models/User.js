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
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', ''],
    },
    profileImage: {
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
    age: {
      type: Number,
      min: [18, 'Must be at least 18'],
      max: [120, 'Age cannot exceed 120'],
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
    preferences: {
      budgetMin: { type: Number, min: 0 },
      budgetMax: { type: Number, min: 0 },
    },
    habits: {
      smoking: { type: Boolean, default: false },
      drinking: { type: Boolean, default: false },
      pets: { type: Boolean, default: false },
      sleep: { type: String, enum: ['early', 'medium', 'late'], default: 'medium' },
    },
    verified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['seeker', 'host', 'both'],
      default: 'seeker',
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpires;
        delete ret.__v;
        return ret;
      },
    },
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
