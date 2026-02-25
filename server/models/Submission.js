// Submission.js
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 200
    },

    education: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300
    },

    nomination: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    driveLink: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true; // optional
          return /drive\.google\.com/.test(v);
        },
        message: 'Must be a valid Google Drive link'
      }
    },

    workDescription: {
      type: String,
      trim: true,
      maxlength: 10000
    },

    works: [
      {
        type: String,
        trim: true
      }
    ],

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Один пользователь — одна заявка на номинацию
submissionSchema.index({ user: 1, nomination: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);