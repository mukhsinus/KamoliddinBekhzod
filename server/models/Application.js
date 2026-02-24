// models/Application.js
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    fullName: {
      type: String,
      required: true,
      trim: true
    },

    education: {
      type: String,
      required: true,
      trim: true
    },

    nomination: {
      type: String,
      required: true
    },

    driveLink: {
      type: String,
      trim: true
    },

    works: [
      {
        type: String
      }
    ],

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Application', applicationSchema);