const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true, minlength: 5 },
  education: { type: String, required: true },
  driveLink: {
    type: String,
    required: true,
    validate: {
      validator: v => /drive\.google\.com/.test(v),
      message: 'Must be a valid Google Drive link'
    }
  },
  nomination: { type: String, required: true }, // slug of Nomination
  works: [{ type: String, required: true }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

submissionSchema.index({ user: 1, nomination: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);
