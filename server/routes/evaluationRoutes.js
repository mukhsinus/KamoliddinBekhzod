// evaluationRoutes.js
const express = require('express');
const mongoose = require('mongoose');
const Evaluation = require('../models/Evaluation');
const Submission = require('../models/Submission');
const ContestSettings = require('../models/ContestSettings');
const ActionLog = require('../models/ActionLog');
const auth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

/* ========================================
   JURY: PUT / UPDATE SCORE
   Only during evaluation phase
======================================== */
router.post(
  '/:submissionId',
  auth,
  requireRole('jury'),
  async (req, res) => {
    try {
      const { score, comment } = req.body;
      const { submissionId } = req.params;

      if (typeof score !== 'number' || score < 0 || score > 100) {
        return res.status(400).json({
          error: 'Score must be between 0 and 100'
        });
      }

      const settings = await ContestSettings.findOne();
      if (!settings || settings.phase !== 'evaluation') {
        return res.status(403).json({
          error: 'Evaluation phase is not active'
        });
      }

      const submission = await Submission.findById(submissionId);
      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }

      if (submission.user.toString() === req.user.userId) {
        return res.status(403).json({
          error: 'You cannot evaluate your own submission'
        });
      }

      const evaluation = await Evaluation.findOneAndUpdate(
        {
          submission: submissionId,
          jury: req.user.userId
        },
        { score, comment },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true
        }
      );

      // 🔹 LOG
      await ActionLog.create({
        user: req.user.userId,
        action: 'evaluate_submission',
        targetId: submissionId,
        meta: { score }
      });

      res.json(evaluation);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* ========================================
   GET EVALUATIONS FOR SUBMISSION
   - Admin: always allowed
   - Jury: always allowed
   - Participant: only when contest finished
======================================== */
router.get(
  '/submission/:submissionId',
  auth,
  async (req, res) => {
    try {
      const { submissionId } = req.params;

      const submission = await Submission.findById(submissionId);
      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }

      const settings = await ContestSettings.findOne();

      const isOwner =
        submission.user.toString() === req.user.userId;

      const isStaff =
        req.user.role === 'admin' ||
        req.user.role === 'jury';

      // Если владелец заявки — проверяем фазу
      if (isOwner && (!settings || settings.phase !== 'finished')) {
        return res.status(403).json({
          error: 'Results are not published yet'
        });
      }

      // Если не владелец и не staff — запрещаем
      if (!isOwner && !isStaff) {
        return res.status(403).json({
          error: 'Forbidden'
        });
      }

      const evaluations = await Evaluation.find({
        submission: submissionId
      }).populate('jury', 'firstName lastName');

      res.json(evaluations);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* ========================================
   GET AVERAGE SCORE (ADMIN / JURY)
======================================== */
router.get(
  '/submission/:submissionId/average',
  auth,
  requireRole('admin', 'jury'),
  async (req, res) => {
    try {
      const { submissionId } = req.params;

      const result = await Evaluation.aggregate([
        { $match: { submission: new require('mongoose').Types.ObjectId(submissionId) } },
        {
          $group: {
            _id: '$submission',
            averageScore: { $avg: '$score' },
            totalEvaluations: { $sum: 1 }
          }
        }
      ]);

      if (!result.length) {
        return res.json({
          averageScore: 0,
          totalEvaluations: 0
        });
      }

      res.json({
        averageScore: Number(result[0].averageScore.toFixed(2)),
        totalEvaluations: result[0].totalEvaluations
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;