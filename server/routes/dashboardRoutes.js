// server/routes/dashboardRoutes.js
const express = require('express');

const User = require('../models/User');
const Submission = require('../models/Submission');
const Evaluation = require('../models/Evaluation');
const ContestSettings = require('../models/ContestSettings');

const auth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

/* ========================================
   ADMIN DASHBOARD
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
        rejectedCount,
        settings
      ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'jury' }),
        Submission.countDocuments(),
        Submission.countDocuments({ status: 'pending' }),
        Submission.countDocuments({ status: 'rejected' }),
        ContestSettings.findOne()
      ]);

      /* ========================================
         AVERAGE SCORE
      ======================================== */

      const avg = await Evaluation.aggregate([
        {
          $group: {
            _id: null,
            avg: { $avg: "$score" },
            count: { $sum: 1 }
          }
        }
      ]);

      const averageScore = avg.length ? Number(avg[0].avg.toFixed(2)) : 0;
      const totalEvaluations = avg.length ? avg[0].count : 0;

      /* ========================================
         TOP 3 PER NOMINATION
      ======================================== */

      const ranking = await Evaluation.aggregate([

        /* 1. AVG SCORE PER SUBMISSION */

        {
          $group: {
            _id: "$submission",
            averageScore: { $avg: "$score" }
          }
        },

        /* 2. JOIN SUBMISSION */

        {
          $lookup: {
            from: "submissions",
            localField: "_id",
            foreignField: "_id",
            as: "submission"
          }
        },

        { $unwind: "$submission" },

        /* 3. JOIN USER */

        {
          $lookup: {
            from: "users",
            localField: "submission.user",
            foreignField: "_id",
            as: "author"
          }
        },

        { $unwind: "$author" },

        /* 4. PROJECT FIELDS */

        {
          $project: {
            nomination: "$submission.nomination",
            averageScore: 1,
            author: {
              $trim: {
                input: {
                  $concat: [
                    { $ifNull: ["$author.firstName", ""] },
                    " ",
                    { $ifNull: ["$author.lastName", ""] }
                  ]
                }
              }
            }
          }
        },

        /* 5. SORT */

        { $sort: { averageScore: -1 } },

        /* 6. GROUP BY NOMINATION */

        {
          $group: {
            _id: "$nomination",
            submissions: {
              $push: {
                author: "$author",
                averageScore: "$averageScore"
              }
            }
          }
        },

        /* 7. TAKE TOP 3 */

        {
          $project: {
            nomination: "$_id",
            submissions: { $slice: ["$submissions", 3] }
          }
        }

      ]);

      /* ========================================
         RESPONSE
      ======================================== */

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
          rejected: rejectedCount
        },

        evaluations: {
          total: totalEvaluations,
          averageScore
        },

        topByNomination: ranking

      });

    }

    catch (err) {

      console.error(err);

      res.status(500).json({
        error: err.message
      });

    }

  }
);

module.exports = router;