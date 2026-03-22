// server/routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const auth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');

/**
 * POST /api/contact
 * Submit a contact form message
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    console.log('📨 Contact form received:', { name, email, messageLength: message?.length });

    // Validate input
    if (!name || !email || !message) {
      console.log('❌ Validation failed:', { name: !!name, email: !!email, message: !!message });
      return res.status(400).json({
        error: 'Name, email, and message are required'
      });
    }

    // Create new contact message
    const contact = new Contact({
      name: name.trim(),
      email: email.trim(),
      message: message.trim()
    });

    await contact.save();

    console.log('✅ Contact message saved:', contact._id);

    res.status(201).json({
      success: true,
      message: 'Contact message sent successfully',
      contactId: contact._id
    });
  } catch (error) {
    console.error('❌ Error submitting contact form:', error);
    res.status(500).json({ error: 'Failed to submit contact form', details: error.message });
  }
});

/**
 * GET /api/contact/unread-count
 * Get count of unread contact messages (admin only)
 */
router.get('/unread-count', auth, requireRole('admin'), async (req, res) => {
  try {
    const count = await Contact.countDocuments({ isRead: false, status: 'new' });
    res.json({ unreadCount: count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

/**
 * GET /api/contact
 * Get all unread contact messages with pagination (admin only)
 */
router.get('/', auth, requireRole('admin'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const messages = await Contact.find({ status: 'new' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Contact.countDocuments({ status: 'new' });

    res.json({
      messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ error: 'Failed to fetch contact messages' });
  }
});

/**
 * PATCH /api/contact/:id/read
 * Mark a message as read (admin only)
 */
router.patch('/:id/read', auth, requireRole('admin'), async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ error: 'Contact message not found' });
    }

    res.json({ success: true, contact });
  } catch (error) {
    console.error('Error updating contact message:', error);
    res.status(500).json({ error: 'Failed to update contact message' });
  }
});

/**
 * PATCH /api/contact/:id/status
 * Update message status (admin only)
 */
router.patch('/:id/status', auth, requireRole('admin'), async (req, res) => {
  try {
    const { status } = req.body;

    if (!['new', 'replied', 'archived'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ error: 'Contact message not found' });
    }

    res.json({ success: true, contact });
  } catch (error) {
    console.error('Error updating contact message:', error);
    res.status(500).json({ error: 'Failed to update contact message' });
  }
});

module.exports = router;
