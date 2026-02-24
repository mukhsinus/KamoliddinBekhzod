const mongoose = require('mongoose');

const nominationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    icon: {
      type: String, // emoji или название иконки
      default: '🎨'
    },

    formats: {
      type: String, // "JPEG, PNG, PDF"
      required: true
    },

    maxSize: {
      type: String, // "50 MB"
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