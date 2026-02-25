// userRoutes.js
const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

/* ========================================
   ADMIN: GET ALL USERS
======================================== */
router.get(
  '/admin/all',
  auth,
  requireRole('admin'),
  async (req, res) => {
    try {
      const users = await User.find()
        .select('-password')
        .sort('-createdAt');

      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* ========================================
   ADMIN: GET USER BY ID
======================================== */
router.get(
  '/admin/:id',
  auth,
  requireRole('admin'),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
        .select('-password');

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* ========================================
   ADMIN: CHANGE USER ROLE
======================================== */
router.patch(
  '/admin/:id/role',
  auth,
  requireRole('admin'),
  async (req, res) => {
    try {
      const { role } = req.body;
      const allowedRoles = ['participant', 'jury', 'admin'];

      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }

      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (
        user._id.toString() === req.user.userId &&
        role !== 'admin'
      ) {
        return res.status(400).json({
          error: 'You cannot remove your own admin role'
        });
      }

      const oldRole = user.role;

      user.role = role;
      await user.save();

      // 🔹 LOG
      await ActionLog.create({
        user: req.user.userId,
        action: 'change_user_role',
        targetId: user._id,
        meta: { oldRole, newRole: role }
      });

      res.json({
        message: 'Role updated successfully',
        user: {
          _id: user._id,
          email: user.email,
          role: user.role
        }
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* ========================================
   ADMIN: ACTIVATE / DEACTIVATE USER
======================================== */
router.patch(
  '/admin/:id/active',
  auth,
  requireRole('admin'),
  async (req, res) => {
    try {
      const { isActive } = req.body;

      if (typeof isActive !== 'boolean') {
        return res.status(400).json({
          error: 'isActive must be boolean'
        });
      }

      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Нельзя деактивировать самого себя
      if (user._id.toString() === req.user.userId) {
        return res.status(400).json({
          error: 'You cannot deactivate yourself'
        });
      }

      user.isActive = isActive;
      await user.save();

      res.json({
        message: 'User status updated',
        user: {
          _id: user._id,
          isActive: user.isActive
        }
      });

      // 🔹 LOG
      await ActionLog.create({
        user: req.user.userId,
        action: 'change_user_status',
        targetId: user._id,
        meta: { isActive }
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;