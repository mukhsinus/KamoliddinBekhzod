const express = require('express');
const ose = require('mongoose');
const ActionLog = require('../models/ActionLog');
const auth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

/* ========================================
   ADMIN: GET LOGS (with pagination & filters)
======================================== */
router.get(
  '/admin',
  auth,
  requireRole('admin'),
  async (req, res) => {
    try {
      let {
        page = 1,
        limit = 20,
        action,
        user,
        from,
        to
      } = req.query;

      page = Math.max(1, Number(page));
      limit = Math.min(100, Math.max(1, Number(limit)));

      const query = {};

      if (action) {
        query.action = action;
      }

      if (user && mongoose.Types.ObjectId.isValid(user)) {
        query.user = user;
      }

      // Фильтр по дате
      if (from || to) {
        query.createdAt = {};

        if (from) {
          query.createdAt.$gte = new Date(from);
        }

        if (to) {
          query.createdAt.$lte = new Date(to);
        }
      }

      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        ActionLog.find(query)
          .populate('user', 'firstName lastName email role')
          .sort('-createdAt')
          .skip(skip)
          .limit(limit),
        ActionLog.countDocuments(query)
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

module.exports = router;