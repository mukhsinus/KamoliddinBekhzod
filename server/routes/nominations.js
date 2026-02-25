// nominations.js
const express = require('express');
const Nomination = require('../models/Nomination');
const auth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

/* ========================================
   GET ALL ACTIVE NOMINATIONS (PUBLIC)
======================================== */
router.get('/', async (req, res) => {
  try {
    const nominations = await Nomination.find({ isActive: true })
      .sort('createdAt');

    res.json(nominations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ========================================
   CREATE NOMINATION (ADMIN ONLY)
======================================== */
router.post(
  '/',
  auth,
  requireRole('admin'),
  async (req, res) => {
    try {
      const { title, slug, description, isActive, icon, formats, maxSize, maxWorks } = req.body;

      if (!title || !slug || !formats || !maxSize || !maxWorks) {
        return res.status(400).json({
          error: 'Required fields: title, slug, formats, maxSize, maxWorks'
        });
      }

      const exists = await Nomination.findOne({ slug });
      if (exists) {
        return res.status(409).json({ error: 'Slug already exists' });
      }

      const nomination = await Nomination.create({
        title,
        slug,
        description,
        icon,
        formats,
        maxSize,
        maxWorks,
        isActive
      });

      res.status(201).json(nomination);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* ========================================
   UPDATE NOMINATION (ADMIN ONLY)
======================================== */
router.put(
  '/:id',
  auth,
  requireRole('admin'),
  async (req, res) => {
    try {
      const nomination = await Nomination.findById(req.params.id);
      if (!nomination) {
        return res.status(404).json({ error: 'Nomination not found' });
      }

      const allowedFields = [
        'title',
        'description',
        'icon',
        'formats',
        'maxSize',
        'maxWorks',
        'isActive'
      ];

      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          nomination[field] = req.body[field];
        }
      });

      await nomination.save();

      res.json(nomination);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* ========================================
   DELETE NOMINATION (ADMIN ONLY)
======================================== */
router.delete(
  '/:id',
  auth,
  requireRole('admin'),
  async (req, res) => {
    try {
      const nomination = await Nomination.findById(req.params.id);

      if (!nomination) {
        return res.status(404).json({ error: 'Nomination not found' });
      }

      await nomination.deleteOne();

      res.json({ message: 'Nomination deleted' });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;