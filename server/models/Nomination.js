// Nomination.js
const mongoose = require('mongoose');

const nominationSchema = new mongoose.Schema(
  {
    title: {
      ru: { type: String, required: true, trim: true },
      en: { type: String, required: true, trim: true }
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    description: {
      ru: { type: String, trim: true },
      en: { type: String, trim: true }
    },

    icon: {
      type: String,
      default: '🎨'
    },

    formats: {
      type: String,
      required: true
    },

    maxSize: {
      type: String,
      required: true
    },

    maxWorks: {
      type: Number,
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

nominationSchema.index({ slug: 1 });

module.exports = mongoose.model('Nomination', nominationSchema);