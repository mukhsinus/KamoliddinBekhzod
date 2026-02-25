const mongoose = require('mongoose');

const actionLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  action: {
    type: String,
    required: true
  },

  targetId: {
    type: mongoose.Schema.Types.ObjectId
  },

  meta: {
    type: Object
  }
}, { timestamps: true });

module.exports = mongoose.model('ActionLog', actionLogSchema);