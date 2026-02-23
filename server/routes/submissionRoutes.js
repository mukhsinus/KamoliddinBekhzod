const express = require('express');
const Submission = require('../models/Submission');
const Nomination = require('../models/Nomination');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/worksUpload');
const router = express.Router();

// POST /api/submissions
router.post(
  '/',
  auth,
  upload.array('works', 10),
  async (req, res) => {
    try {
      const { fullName, education, driveLink, nomination } = req.body;
      if (!fullName || fullName.length < 5) return res.status(400).json({ error: 'Full name required (min 5 chars)' });
      if (!education) return res.status(400).json({ error: 'Education required' });
      if (!driveLink || !/drive\.google\.com/.test(driveLink)) return res.status(400).json({ error: 'Valid Google Drive link required' });
      if (!nomination) return res.status(400).json({ error: 'Nomination required' });
      if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'At least one artwork required' });

      // Validate nomination exists and is active
      const nominationDoc = await Nomination.findOne({ slug: nomination });
      if (!nominationDoc) return res.status(404).json({ error: 'Nomination not found' });
      if (!nominationDoc.isActive) return res.status(400).json({ error: 'Nomination is not active' });

      // Prevent duplicate
      const exists = await Submission.findOne({ user: req.user.userId, nomination });
      if (exists) return res.status(409).json({ error: 'Already submitted for this nomination' });

      const works = req.files.map(f => `/uploads/works/${f.filename}`);
      const submission = await Submission.create({
        user: req.user.userId,
        fullName,
        education,
        driveLink,
        nomination,
        works
      });
      res.status(201).json(submission);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// GET /api/submissions/me
router.get('/me', auth, async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user.userId }).sort('-createdAt');
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/submissions/:id
router.put('/:id', auth, upload.array('works', 10), async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) return res.status(404).json({ error: 'Submission not found' });
    if (submission.user.toString() !== req.user.userId) return res.status(403).json({ error: 'Forbidden' });
    if (submission.status !== 'pending') return res.status(400).json({ error: 'Cannot edit after review' });

    const { fullName, education, driveLink, nomination } = req.body;
    if (fullName && fullName.length < 5) return res.status(400).json({ error: 'Full name min 5 chars' });
    if (driveLink && !/drive\.google\.com/.test(driveLink)) return res.status(400).json({ error: 'Valid Google Drive link required' });

    if (fullName) submission.fullName = fullName;
    if (education) submission.education = education;
    if (driveLink) submission.driveLink = driveLink;
    if (nomination) submission.nomination = nomination;
    if (req.files && req.files.length > 0) {
      submission.works = req.files.map(f => `/uploads/works/${f.filename}`);
    }
    await submission.save();
    res.json(submission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
