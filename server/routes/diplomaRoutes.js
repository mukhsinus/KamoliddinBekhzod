// Diploma routes
const express = require('express');
const router = express.Router();
const Diploma = require('../models/Diploma');
const authMiddleware = require('../middleware/authMiddleware');

// Get diplomas for current user
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const diplomas = await Diploma.find({ user: userId });
    res.json(diplomas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
