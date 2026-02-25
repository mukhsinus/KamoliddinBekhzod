const express = require('express');
const mongoose = require('mongoose');

const User = require('../models/User');
const Submission = require('../models/Submission');
const Evaluation = require('../models/Evaluation');
const Nomination = require('../models/Nomination');
const ContestSettings = require('../models/ContestSettings');

const auth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

/* ========================================
   ADMIN: DASHBOARD STATS
======================================== */
router.get(
  '/admin',
  auth,
  requireRole('admin'),
  async (req, res) => {
    try {
      const [
        totalUsers,
        totalJury,
        totalSubmissions,
        pendingCount,
        approvedCount,
        rejectedCount,
        totalNominations,
        settings
      ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'jury' }),
        Submission.countDocuments(),
        Submission.countDocuments({ status: 'pending' }),
        Submission.countDocuments({ status: 'approved' }),
        Submission.countDocuments({ status: 'rejected' }),
        Nomination.countDocuments(),
        ContestSettings.findOne()
      ]);

      // Средний балл по всем оценкам
      const averageResult = await Evaluation.aggregate([
        {
          $group: {
            _id: null,
            averageScore: { $avg: '$score' },
            totalEvaluations: { $sum: 1 }
          }
        }
      ]);

      const averageScore = averageResult.length
        ? Number(averageResult[0].averageScore.toFixed(2))
        : 0;

      const totalEvaluations = averageResult.length
        ? averageResult[0].totalEvaluations
        : 0;

      res.json({
        contest: {
          phase: settings?.phase || 'submission'
        },

        users: {
          total: totalUsers,
          jury: totalJury
        },

        submissions: {
          total: totalSubmissions,
          pending: pendingCount,
          approved: approvedCount,
          rejected: rejectedCount
        },

        nominations: {
          total: totalNominations
        },

        evaluations: {
          total: totalEvaluations,
          averageScore
        }
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;