// submissionRoutes.js
const express = require('express');
const Submission = require('../models/Submission');
const Nomination = require('../models/Nomination');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/worksUpload');

const router = express.Router();

/* ========================================
   CREATE SUBMISSION
======================================== */
router.post('/', auth, upload.array('works', 10), async (req, res) => {
  try {
    const { fullName, education, driveLink, nomination, workDescription } = req.body;

    // Базовая валидация
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

    // Проверяем номинацию
    const nominationDoc = await Nomination.findOne({ slug: nomination });
    if (!nominationDoc) {
      return res.status(404).json({ error: 'Nomination not found' });
    }

    if (!nominationDoc.isActive) {
      return res.status(400).json({ error: 'Nomination is not active' });
    }

    // Проверка уникальности
    const exists = await Submission.findOne({
      user: req.user.userId,
      nomination
    });

    if (exists) {
      return res.status(409).json({ error: 'Already submitted for this nomination' });
    }

    const works = req.files.map(file => `/uploads/works/${file.filename}`);

    const submission = await Submission.create({
      user: req.user.userId,
      fullName,
      education,
      driveLink,
      nomination,
      workDescription,
      works
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
   UPDATE SUBMISSION
======================================== */
router.put('/:id', auth, upload.array('works', 10), async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    if (submission.user.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (submission.status !== 'pending') {
      return res.status(400).json({ error: 'Cannot edit after review' });
    }

    const { fullName, education, driveLink, nomination, workDescription } = req.body;

    if (fullName && fullName.length < 5) {
      return res.status(400).json({ error: 'Full name min 5 chars' });
    }

    if (fullName) submission.fullName = fullName;
    if (education) submission.education = education;
    if (driveLink !== undefined) submission.driveLink = driveLink;
    if (nomination) submission.nomination = nomination;
    if (workDescription !== undefined) submission.workDescription = workDescription;

    if (req.files && req.files.length > 0) {
      submission.works = req.files.map(file => `/uploads/works/${file.filename}`);
    }

    await submission.save();

    res.json(submission);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;