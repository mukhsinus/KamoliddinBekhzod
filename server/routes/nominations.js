// nominations.js / routes/nominations.js
const express = require('express');
const Nomination = require('../models/Nomination');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// GET /api/nominations (public)
router.get('/', async (req, res) => {
  try {
    const nominations = await Nomination.find({ isActive: true }).sort('createdAt');
    res.json(nominations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/nominations (admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const { title, slug, description, isActive } = req.body;
    if (!title || !slug) return res.status(400).json({ error: 'Title and slug required' });
    const exists = await Nomination.findOne({ slug });
    if (exists) return res.status(409).json({ error: 'Slug already exists' });
    const nomination = await Nomination.create({ title, slug, description, isActive });
    res.status(201).json(nomination);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
