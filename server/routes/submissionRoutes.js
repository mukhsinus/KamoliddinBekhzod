// submissionRoutes.js
const express = require('express');
const mongoose = require('mongoose');
const Submission = require('../models/Submission');
const Nomination = require('../models/Nomination');
const ContestSettings = require('../models/ContestSettings');
const auth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');
const upload = require('../middleware/worksUpload');
const ActionLog = require('../models/ActionLog');

const router = express.Router();

/* ========================================
   CREATE SUBMISSION (PARTICIPANT)
======================================== */
router.post('/', auth, upload.array('works', 10), async (req, res) => {
  try {
    const settings = await ContestSettings.findOne();

    if (settings && settings.phase !== 'submission') {
      return res.status(403).json({
        error: 'Submission phase is closed'
      });
    }

    const { fullName, education, driveLink, nomination, workDescription } = req.body;

    if (!fullName || fullName.length < 5) {
      return res.status(400).json({ error: 'Full name required (min 5 chars)' });
    }

    if (!education) {
      return res.status(400).json({ error: 'Education required' });
    }

    if (!nomination) {
      return res.status(400).json({ error: 'Nomination required' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'At least one artwork required' });
    }

    const nominationDoc = await Nomination.findOne({ slug: nomination });

    if (!nominationDoc) {
      return res.status(404).json({ error: 'Nomination not found' });
    }

    if (!nominationDoc.isActive) {
      return res.status(400).json({ error: 'Nomination is not active' });
    }

    const exists = await Submission.findOne({
      user: req.user.userId,
      nomination
    });

    if (exists) {
      return res.status(409).json({
        error: 'Already submitted for this nomination'
      });
    }

    const works = req.files.map(
      file => `/uploads/works/${file.filename}`
    );

    const submission = await Submission.create({
      user: req.user.userId,
      fullName,
      education,
      driveLink,
      nomination,
      workDescription,
      works
    });

    await ActionLog.create({
      user: req.user.userId,
      action: 'create_submission',
      targetId: submission._id,
      meta: { nomination }
    });

    res.status(201).json(submission);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ========================================
   GET MY SUBMISSIONS
======================================== */
router.get('/me', auth, async (req, res) => {
  try {

    const submissions = await Submission.find({
      user: req.user.userId
    }).sort('-createdAt');

    res.json(submissions);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ========================================
   GET SINGLE SUBMISSION (JURY / ADMIN)
   Needed for jury review page
======================================== */
router.get(
  '/:id',
  auth,
  requireRole('jury', 'admin'),
  async (req, res) => {
    try {

      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid ID' });
      }

      const submission = await Submission.findById(req.params.id)
        .populate('user', 'firstName lastName email');

      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }

      res.json(submission);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* ========================================
   UPDATE SUBMISSION
======================================== */
router.put('/:id', auth, upload.array('works', 10), async (req, res) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    if (submission.user.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const settings = await ContestSettings.findOne();

    if (settings && settings.phase !== 'submission') {
      return res.status(403).json({
        error: 'Editing is closed'
      });
    }

    if (submission.status !== 'pending') {
      return res.status(400).json({
        error: 'Cannot edit after review'
      });
    }

    const { fullName, education, driveLink, nomination, workDescription } = req.body;

    if (fullName && fullName.length < 5) {
      return res.status(400).json({
        error: 'Full name must be at least 5 characters'
      });
    }

    if (fullName) submission.fullName = fullName;
    if (education) submission.education = education;
    if (driveLink !== undefined) submission.driveLink = driveLink;
    if (nomination) submission.nomination = nomination;
    if (workDescription !== undefined) submission.workDescription = workDescription;

    if (req.files && req.files.length > 0) {
      submission.works = req.files.map(
        file => `/uploads/works/${file.filename}`
      );
    }

    await submission.save();

    await ActionLog.create({
      user: req.user.userId,
      action: 'update_submission',
      targetId: submission._id
    });

    res.json(submission);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ========================================
   ADMIN: GET ALL SUBMISSIONS
======================================== */
router.get(
  '/admin/all',
  auth,
  requireRole('admin'),
  async (req, res) => {
    try {

      let {
        page = 1,
        limit = 20,
        status,
        nomination
      } = req.query;

      page = Math.max(1, Number(page));
      limit = Math.min(100, Math.max(1, Number(limit)));

      const query = {};

      if (status) query.status = status;
      if (nomination) query.nomination = nomination;

      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        Submission.find(query)
          .populate('user', 'firstName lastName email role')
          .sort('-createdAt')
          .skip(skip)
          .limit(limit),
        Submission.countDocuments(query)
      ]);

      res.json({
        data,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* ========================================
   ADMIN: CHANGE SUBMISSION STATUS
======================================== */
router.patch(
  '/admin/:id/status',
  auth,
  requireRole('admin'),
  async (req, res) => {
    try {

      const { status } = req.body;

      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid ID' });
      }

      const submission = await Submission.findById(req.params.id);

      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }

      submission.status = status;
      await submission.save();

      await ActionLog.create({
        user: req.user.userId,
        action: 'change_submission_status',
        targetId: submission._id,
        meta: { newStatus: status }
      });

      res.json(submission);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;