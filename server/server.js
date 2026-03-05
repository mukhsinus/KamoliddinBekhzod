// server.js
const path = require('path');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

/* ===================================================
   DIAGNOSTICS
=================================================== */

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("RUNTIME DIR:", __dirname);

const uploadAbsolutePath = path.resolve(__dirname, 'uploads');
console.log("STATIC ABS PATH:", uploadAbsolutePath);

const testAvatarPath = path.resolve(
  __dirname,
  'uploads/avatars/avatar-1772035067615.webp'
);

console.log("TEST FILE PATH:", testAvatarPath);
console.log("FILE EXISTS:", fs.existsSync(testAvatarPath));
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━");

/* ===================================================
   CORS
=================================================== */

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:8080',
      'http://localhost:8081',
      'https://kodbekhzod.netlify.app'
    ],
    credentials: true
  })
);

/* ===================================================
   MIDDLEWARE
=================================================== */

app.use(express.json({ limit: '1mb' }));

// Абсолютный путь
app.use('/uploads', express.static(uploadAbsolutePath));

// Логируем любые 404 на uploads
app.use('/uploads', (req, res, next) => {
  console.log("UPLOAD REQUEST:", req.originalUrl);
  next();
});

/* ===================================================
   ROUTES
=================================================== */

const evaluationRoutes = require('./routes/evaluationRoutes');
const contestRoutes = require('./routes/contestRoutes');
const logRoutes = require('./routes/logRoutes');
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const authRoutes = require('./routes/authRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const nominationRoutes = require('./routes/nominations');
const diplomaRoutes = require('./routes/diplomaRoutes');
const juryRoutes = require('./routes/juryRoutes');

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/contest', contestRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.use('/api/submissions', submissionRoutes);
app.use('/api/nominations', nominationRoutes);
app.use('/api/diplomas', diplomaRoutes);

/* JURY PANEL ROUTES */

app.use('/api/jury', juryRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});



app.use((err, req, res, next) => {
  console.error("UNHANDLED ERROR:", err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    error: "Internal server error"
  });
});



/* ===================================================
   DATABASE
=================================================== */

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });