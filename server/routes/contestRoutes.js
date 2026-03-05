// contestRoutes.js
const express = require('express');
const ContestSettings = require('../models/ContestSettings');
const auth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');
const logAction = require('../utils/logAction');
const router = express.Router();

/* ========================================
   GET CURRENT PHASE
======================================== */
router.get('/', async (req, res) => {
  try {
    let settings = await ContestSettings.findOne();

    if (!settings) {
      settings = await ContestSettings.create({});
    }

    res.json(settings);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ========================================
   ADMIN: CHANGE PHASE
======================================== */
router.patch(
  '/',
  auth,
  requireRole('admin'),
  async (req, res) => {
    try {
      const { phase } = req.body || {};

      if (!['submission','evaluation','finished'].includes(phase)) {
        return res.status(400).json({ error: 'Invalid phase' });
      }

      let settings = await ContestSettings.findOne();
      if (!settings) {
        settings = new ContestSettings();
      }

      const oldPhase = settings.phase;

      settings.phase = phase;
      await settings.save();

      // 🔹 LOG
      await logAction({
        userId: req.user.userId,
        action: 'change_contest_phase',
        meta: {
          oldPhase,
          newPhase: phase
        }
      });

      res.json(settings);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;