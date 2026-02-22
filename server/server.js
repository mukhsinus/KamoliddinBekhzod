
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
// Serve uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =======================
// CORS CONFIG (IMPORTANT)
// =======================
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:8080'],
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

app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/diplomas', diplomaRoutes);



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