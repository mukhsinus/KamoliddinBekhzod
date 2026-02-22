// Application routes
const express = require('express');
const router = express.Router();
const Application = require('../models/Application');

// Create application
router.post('/', async (req, res) => {
  try {
    const { name, email, category } = req.body;
    const application = new Application({ name, email, category });
    await application.save();
    res.status(201).json(application);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all applications
router.get('/', async (req, res) => {
  try {
    const applications = await Application.find();
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get application by ID
router.get('/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ error: 'Not found' });
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete application by ID
router.delete('/:id', async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted', application });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
