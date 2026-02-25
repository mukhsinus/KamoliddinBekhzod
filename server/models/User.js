// server/models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // ---------------------------
    // BASIC INFO
    // ---------------------------
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    age: {
      type: Number,
      min: 0,
      max: 120
    },

    city: {
      type: String,
      trim: true,
      maxlength: 150
    },

    phone: {
      type: String,
      trim: true,
      maxlength: 30
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    avatar: {
      type: String,
      default: '/default-avatar.png'
    },

    // ---------------------------
    // ROLE SYSTEM (RBAC)
    // ---------------------------
    role: {
      type: String,
      enum: ['participant', 'jury', 'admin'],
      default: 'participant',
      index: true
    },

    // ---------------------------
    // ACCOUNT STATE
    // ---------------------------
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },

    // ---------------------------
    // SYSTEM FIELDS
    // ---------------------------
    createdAt: {
      type: Date,
      default: Date.now
    },

    updatedAt: {
      type: Date
    }
  },
  {
    timestamps: true // автоматически добавит createdAt и updatedAt
  }
);

// ---------------------------
// INDEXES
// ---------------------------

// Быстрая выборка по роли
userSchema.index({ role: 1 });

// Быстрая выборка активных пользователей
userSchema.index({ isActive: 1 });

module.exports = mongoose.model('User', userSchema);