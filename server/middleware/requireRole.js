// requireRole.js
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // -----------------------------
      // 1. Проверка наличия пользователя
      // -----------------------------
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized.' });
      }

      // -----------------------------
      // 2. Проверка роли
      // -----------------------------
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden.' });
      }

      next();
    } catch (err) {
      console.error('Role check error:', err.message);
      return res.status(500).json({ error: 'Role verification failed.' });
    }
  };
};

module.exports = requireRole;