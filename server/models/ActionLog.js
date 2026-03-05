// server/models/ActionLog.js
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

  target: {
    firstName: String,
    lastName: String,
    email: String
  },

  meta: {
    type: Object
  }

}, { timestamps: true });

module.exports = mongoose.model('ActionLog', actionLogSchema);