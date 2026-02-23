const mongoose = require('mongoose');

const nominationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

nominationSchema.index({ slug: 1 });

module.exports = mongoose.model('Nomination', nominationSchema);
