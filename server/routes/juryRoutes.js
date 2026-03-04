// juryRoutes.js
const express = require("express");
const mongoose = require("mongoose");

const Submission = require("../models/Submission");
const Evaluation = require("../models/Evaluation");

const auth = require("../middleware/authMiddleware");
const requireRole = require("../middleware/requireRole");

const router = express.Router();

/* ========================================
   JURY DASHBOARD
======================================== */

router.get(
  "/dashboard",
  auth,
  requireRole("jury"),
  async (req, res) => {
    try {

      const total = await Submission.countDocuments();

      const reviewed = await Evaluation.countDocuments({
        jury: req.user.userId
      });

      const pending = Math.max(total - reviewed, 0);

      const avg = await Evaluation.aggregate([
        {
          $match: {
            jury: new mongoose.Types.ObjectId(req.user.userId)
          }
        },
        {
          $group: {
            _id: null,
            avgScore: { $avg: "$score" }
          }
        }
      ]);

      res.json({
        total,
        reviewed,
        pending,
        averageScore: avg[0]?.avgScore || 0
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* ========================================
   ALL SUBMISSIONS FOR JURY
======================================== */

router.get(
  "/submissions",
  auth,
  requireRole("jury"),
  async (req, res) => {
    try {

      const submissions = await Submission.find()
        .populate("user", "firstName lastName email")
        .sort("-createdAt");

      const data = submissions.map((s) => ({
        _id: s._id,
        title: s.workDescription?.slice(0, 50) || "Artwork",
        nomination: s.nomination,
        author: s.fullName,
        createdAt: s.createdAt
      }));

      res.json(data);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* ========================================
   GET SINGLE SUBMISSION (FOR REVIEW PAGE)
======================================== */

router.get(
  "/submissions/:id",
  auth,
  requireRole("jury"),
  async (req, res) => {
    try {

      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }

      const submission = await Submission.findById(req.params.id)
        .populate("user", "firstName lastName email");

      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }

      res.json(submission);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* ========================================
   MY REVIEWS
======================================== */

router.get(
  "/reviews",
  auth,
  requireRole("jury"),
  async (req, res) => {
    try {

      const reviews = await Evaluation.find({
        jury: req.user.userId
      })
        .populate({
          path: "submission",
          select: "fullName nomination workDescription createdAt"
        })
        .sort("-createdAt");

      const data = reviews.map((r) => ({
        _id: r._id,
        submissionId: r.submission._id,
        submissionTitle:
          r.submission.workDescription?.slice(0, 50) || "Artwork",
        nomination: r.submission.nomination,
        score: r.score,
        comment: r.comment,
        createdAt: r.createdAt
      }));

      res.json(data);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;