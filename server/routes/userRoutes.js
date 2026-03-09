// server/routes/userRoutes.js
const express = require('express');
const User = require('../models/User');
const logAction = require('../utils/logAction');
const ActionLog = require('../models/ActionLog');
const auth = require('../middleware/authMiddleware');
const SUPER_ADMIN_EMAIL = "kamolovmuhsin@icloud.com";
const requireRole = require('../middleware/requireRole');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

/* ========================================
   ADMIN: GET ALL USERS
======================================== */
router.get(
  '/admin/all',
  auth,
  requireRole('admin'),
  asyncHandler(async (req, res) => {

    const users = await User.find()
      .select('-password')
      .sort('-createdAt')
      .lean();

    res.json(users);

  })
);

/* ========================================
   ADMIN: GET USER BY ID
======================================== */
router.get(
  '/admin/:id',
  auth,
  requireRole('admin'),
  asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id)
      .select('-password');

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    return res.json(user);

  })
);

/* ========================================
   ADMIN: CHANGE USER ROLE
======================================== */
router.patch(
  '/admin/:id/role',
  auth,
  requireRole('admin'),
  asyncHandler(async (req, res) => {

    const { role } = req.body;
    const allowedRoles = ['participant', 'jury', 'admin'];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        error: 'Invalid role'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // защита суперадмина
    if (user.email.toLowerCase() === SUPER_ADMIN_EMAIL) {
      return res.status(403).json({
        error: "Super admin role cannot be changed"
      });
    }

    // нельзя снять админку с себя
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

    // лог
    await logAction({
      userId: req.user.userId,
      action: 'change_user_role',
      target: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      },
      meta: { role }
    });

    return res.json({
      message: 'Role updated successfully',
      user: {
        _id: user._id,
        email: user.email,
        role: user.role
      }
    });

  })
);

/* ========================================
   ADMIN: ACTIVATE / DEACTIVATE USER
======================================== */
router.patch(
  '/admin/:id/active',
  auth,
  requireRole('admin'),
  asyncHandler(async (req, res) => {

    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        error: 'isActive must be boolean'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    if (user.email.toLowerCase() === SUPER_ADMIN_EMAIL) {
      return res.status(403).json({
        error: "Super admin cannot be deactivated"
      });
    }

    // нельзя деактивировать себя
    if (user._id.toString() === req.user.userId) {
      return res.status(400).json({
        error: 'You cannot deactivate yourself'
      });
    }

    user.isActive = isActive;
    await user.save();

    // лог
    await ActionLog.create({
      user: req.user.userId,
      action: 'change_user_status',
      meta: {
        targetName: `${user.firstName} ${user.lastName}`,
        targetEmail: user.email,
        isActive
      }
    });

    return res.json({
      message: 'User status updated',
      user: {
        _id: user._id,
        isActive: user.isActive
      }
    });

  })
);

module.exports = router;