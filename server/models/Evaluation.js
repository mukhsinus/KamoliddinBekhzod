// Evaluation.js
const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema(
  {
    // Какая работа оценивается
    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Submission',
      required: true,
      index: true
    },

    // Кто оценивает
    jury: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    // Балл
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },

    // Комментарий жюри (необязательно)
    comment: {
      type: String,
      trim: true,
      maxlength: 2000
    }
  },
  {
    timestamps: true
  }
);

/*
  ВАЖНО:
  Один жюри не может поставить две оценки
  одной и той же работе
*/
evaluationSchema.index(
  { submission: 1, jury: 1 },
  { unique: true }
);

module.exports = mongoose.model('Evaluation', evaluationSchema);