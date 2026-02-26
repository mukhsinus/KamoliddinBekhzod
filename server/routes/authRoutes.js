// routes/authRoutes.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sharp = require('sharp');
const fs = require('fs/promises');
const path = require('path');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/avatarUpload');

const router = express.Router();

/* ===================================================
   HELPERS
=================================================== */

const signToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const sanitizeUser = (user) => {
  const obj = user.toObject();
  delete obj.password;
  return obj;
};

/* ===================================================
   REGISTER
=================================================== */

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password too short.' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      avatar: '/default-avatar.png'
    });

    const token = signToken(user);

    res.status(201).json({ token });

  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

/* ===================================================
   LOGIN
=================================================== */

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = signToken(user);

    res.json({ token });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

/* ===================================================
   GET CURRENT USER
=================================================== */

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(user);

  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

/* ===================================================
   UPDATE PROFILE
=================================================== */

router.put('/me', authMiddleware, async (req, res) => {
  try {
    const allowed = ['firstName', 'lastName', 'age', 'city', 'phone', 'email'];
    const updates = {};

    for (const field of allowed) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.email) {
      const existing = await User.findOne({ email: updates.email });
      if (existing && existing._id.toString() !== req.user.userId) {
        return res.status(409).json({ error: 'Email already in use.' });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updates },
      { new: true }
    ).select('-password');

    res.json(user);

  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

/* ===================================================
   AVATAR UPLOAD (PRODUCTION)
=================================================== */

router.put(
  '/avatar',
  authMiddleware,
  upload.single('avatar'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
      }

      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      const uploadDir = path.join(__dirname, '../uploads/avatars');
      await fs.mkdir(uploadDir, { recursive: true });

      const filename = `avatar-${user._id}-${Date.now()}.webp`;
      const filepath = path.join(uploadDir, filename);

      await sharp(req.file.buffer)
        .resize(256, 256, { fit: 'cover' })
        .webp({ quality: 80 })
        .toFile(filepath);

      // Remove old avatar safely
      if (user.avatar && user.avatar.includes('avatar-')) {
        try {
          const oldPath = path.join(__dirname, '..', user.avatar);
          await fs.unlink(oldPath);
        } catch {
          // ignore if file missing
        }
      }

      user.avatar = `/uploads/avatars/${filename}`;
      await user.save();

      res.json(sanitizeUser(user));

    } catch (err) {
      console.error('Avatar upload error:', err);
      res.status(500).json({ error: 'Avatar upload failed.' });
    }
  }
);

/* ===================================================
   CHANGE PASSWORD
=================================================== */

router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password too short.' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password incorrect.' });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.json({ message: 'Password updated successfully.' });

  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;