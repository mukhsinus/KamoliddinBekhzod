// evaluationRoutes.js
const express = require('express');
const mongoose = require('mongoose');

const Evaluation = require('../models/Evaluation');
const Submission = require('../models/Submission');
const ContestSettings = require('../models/ContestSettings');
const logAction = require('../utils/logAction');

const auth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

/* ========================================
   CREATE OR UPDATE JURY SCORE
   POST /api/evaluations/:submissionId
======================================== */

router.post(
  '/:submissionId',
  auth,
  requireRole('jury'),
  async (req, res) => {
    try {

      const { score, comment } = req.body;
      const { submissionId } = req.params;

      /* ===============================
         VALIDATE SCORE
      =============================== */

      if (typeof score !== 'number' || score < 0 || score > 100) {
        return res.status(400).json({
          error: 'Score must be between 0 and 100'
        });
      }

      if (!mongoose.Types.ObjectId.isValid(submissionId)) {
        return res.status(400).json({
          error: 'Invalid submission ID'
        });
      }

      /* ===============================
         CONTEST PHASE CHECK
      =============================== */

      const settings = await ContestSettings.findOne();

      if (!settings || settings.phase !== 'evaluation') {
        return res.status(403).json({
          error: 'Evaluation phase is not active'
        });
      }

      /* ===============================
         CHECK SUBMISSION
      =============================== */

      const submission = await Submission.findById(submissionId);

      if (!submission) {
        return res.status(404).json({
          error: 'Submission not found'
        });
      }

      /* ===============================
         PREVENT SELF REVIEW
      =============================== */

      if (submission.user.toString() === req.user.userId) {
        return res.status(403).json({
          error: 'You cannot evaluate your own submission'
        });
      }

      /* ===============================
         CREATE OR UPDATE EVALUATION
      =============================== */

      const evaluation = await Evaluation.findOneAndUpdate(
        {
          submission: submissionId,
          jury: req.user.userId
        },
        {
          score,
          comment
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true
        }
      );

      /* ===============================
         ACTION LOG
      =============================== */

      await logAction({
        userId: req.user.userId,
        action: 'evaluate_submission',
        meta: {
          submissionId,
          score
        }
      });

      res.json(evaluation);

    } catch (err) {
      res.status(500).json({
        error: err.message
      });
    }
  }
);

/* ========================================
   GET ALL EVALUATIONS FOR SUBMISSION
   GET /api/evaluations/submission/:submissionId
======================================== */

router.get(
  '/submission/:submissionId',
  auth,
  async (req, res) => {
    try {

      const { submissionId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(submissionId)) {
        return res.status(400).json({
          error: 'Invalid submission ID'
        });
      }

      const submission = await Submission.findById(submissionId);

      if (!submission) {
        return res.status(404).json({
          error: 'Submission not found'
        });
      }

      const settings = await ContestSettings.findOne();

      const isOwner =
        submission.user.toString() === req.user.userId;

      const isStaff =
        req.user.role === 'admin' ||
        req.user.role === 'jury';

      /* ===============================
         ACCESS CONTROL
      =============================== */

      if (isOwner && (!settings || settings.phase !== 'finished')) {
        return res.status(403).json({
          error: 'Results are not published yet'
        });
      }

      if (!isOwner && !isStaff) {
        return res.status(403).json({
          error: 'Forbidden'
        });
      }

      const evaluations = await Evaluation.find({
        submission: submissionId
      })
      .populate('jury', 'firstName lastName');

      res.json(evaluations);

    } catch (err) {
      res.status(500).json({
        error: err.message
      });
    }
  }
);

/* ========================================
   GET AVERAGE SCORE
   GET /api/evaluations/submission/:submissionId/average
======================================== */

router.get(
  '/submission/:submissionId/average',
  auth,
  requireRole('admin', 'jury'),
  async (req, res) => {
    try {

      const { submissionId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(submissionId)) {
        return res.status(400).json({
          error: 'Invalid submission ID'
        });
      }

      const result = await Evaluation.aggregate([
        {
          $match: {
            submission: new mongoose.Types.ObjectId(submissionId)
          }
        },
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
      res.status(500).json({
        error: err.message
      });
    }
  }
);

module.exports = router;