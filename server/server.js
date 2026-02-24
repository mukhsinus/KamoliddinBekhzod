
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
// Serve uploads folder
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:8080',
      'http://localhost:8081',
      'https://kodbekhzod.netlify.app/'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

// =======================
// CORS CONFIG (IMPORTANT)
// =======================
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:8080', 'http://localhost:8081'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// =======================
// MIDDLEWARE
// =======================
app.use(express.json());

// =======================
// ROUTES
// =======================

const authRoutes = require('./routes/authRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const diplomaRoutes = require('./routes/diplomaRoutes');

const nominationRoutes = require('./routes/nominations');
const submissionRoutes = require('./routes/submissionRoutes');


app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/diplomas', diplomaRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/nominations', nominationRoutes);



app.get('/test', (req, res) => {
  res.send('server works');
});


// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// =======================
// DATABASE CONNECTION
// =======================
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