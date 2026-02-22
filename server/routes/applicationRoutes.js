const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const authMiddleware = require('../middleware/authMiddleware');

// Create application
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { category } = req.body;

    const application = new Application({
      user: req.user.userId,
      category
    });

    await application.save();
    res.status(201).json(application);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get my applications
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({
      user: req.user.userId
    });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;