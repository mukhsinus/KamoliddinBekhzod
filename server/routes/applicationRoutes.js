const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');


// ===============================
// CREATE APPLICATION
// ===============================
router.post(
  '/',
  authMiddleware,
  upload.array('works', 10), // максимум 10 файлов
  async (req, res) => {
    try {
      const { fullName, education, nomination, driveLink } = req.body;

      // --- Базовая валидация ---
      if (!fullName || !education || !nomination) {
        return res.status(400).json({
          error: 'Заполните обязательные поля'
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          error: 'Необходимо загрузить хотя бы одну работу'
        });
      }

      // --- Извлекаем имена файлов ---
      const works = req.files.map(file => file.filename);

      const application = new Application({
        user: req.user.userId,
        fullName,
        education,
        nomination,
        driveLink,
        works
      });

      await application.save();

      res.status(201).json({
        message: 'Заявка успешно создана',
        application
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: 'Ошибка сервера'
      });
    }
  }
);


// ===============================
// GET MY APPLICATIONS
// ===============================
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({
      user: req.user.userId
    })
      .sort({ createdAt: -1 });

    res.json(applications);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Ошибка сервера'
    });
  }
});


module.exports = router;