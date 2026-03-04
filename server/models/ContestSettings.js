// ContestSettings.js
const mongoose = require('mongoose');

const contestSettingsSchema = new mongoose.Schema(
  {
    // Текущая фаза конкурса
    phase: {
      type: String,
      enum: ['submission', 'evaluation', 'finished'],
      default: 'submission',
      index: true
    },

    // Дедлайн приёма заявок
    submissionDeadline: {
      type: Date
    },

    // Дедлайн оценивания
    evaluationDeadline: {
      type: Date
    }
  },
  { timestamps: true }
);

/*
  В системе должен быть только один документ настроек.
  Поэтому добавляем "singleton" ограничение.
*/
contestSettingsSchema.pre('save', async function (next) {
  if (this.isNew) {
    const existing = await mongoose.models.ContestSettings.findOne();
    if (existing) {
      return next(new Error('ContestSettings already exists'));
    }
  }
  next();
});

/*
  Удобные методы проверки дедлайнов
*/

contestSettingsSchema.methods.isSubmissionOpen = function () {
  if (!this.submissionDeadline) return true;
  return new Date() <= this.submissionDeadline;
};

contestSettingsSchema.methods.isEvaluationOpen = function () {
  if (!this.evaluationDeadline) return true;
  return new Date() <= this.evaluationDeadline;
};

module.exports = mongoose.model(
  'ContestSettings',
  contestSettingsSchema
);