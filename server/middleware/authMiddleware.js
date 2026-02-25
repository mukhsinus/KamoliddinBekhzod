// authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  try {
    // -----------------------------
    // 1. Проверка заголовка
    // -----------------------------
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    // -----------------------------
    // 2. Верификация JWT
    // -----------------------------
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId) {
      return res.status(401).json({ error: 'Invalid token payload.' });
    }

    // -----------------------------
    // 3. Проверка пользователя в БД
    // -----------------------------
    const user = await User.findById(decoded.userId).select('_id role isActive');

    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is deactivated.' });
    }

    // -----------------------------
    // 4. Прокидываем данные в req
    // -----------------------------
    req.user = {
      userId: user._id.toString(),
      role: user.role
    };

    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};