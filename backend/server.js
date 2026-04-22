/**
 * ========================================
 * CIVS BACKEND SERVER
 * ========================================
 */

const express = require('express');
const cors = require('cors');
const passport = require('passport');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/db');

// Import passport configuration
require('./config/passport');

// 🔥 CREATE APP FIRST
const app = express();

// Import routes
const authRoutes = require('./routes/auth.routes');
const candidateRoutes = require('./routes/candidate.routes');
const recruiterRoutes = require('./routes/recruiter.routes'); // ✅ ADDED

/**
 * ========================================
 * MIDDLEWARE SETUP
 * ========================================
 */

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔍 DEBUG: Log incoming requests
app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log(`📨 ${req.method} ${req.path}`);
    console.log('Headers:', {
      'content-type': req.headers['content-type'],
      'content-length': req.headers['content-length']
    });
    console.log('Body:', req.body);
  }
  next();
});

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Session setup (for Passport)
app.use(
  require('express-session')({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

/**
 * ========================================
 * DATABASE CONNECTION
 * ========================================
 */

connectDB();

/**
 * ========================================
 * ROUTES
 * ========================================
 */

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Candidate routes
app.use('/api/candidate', candidateRoutes);

// 🔥 YOUR MODULE (Recruiter)
app.use('/api/recruiter', recruiterRoutes);

/**
 * ========================================
 * ERROR HANDLING
 * ========================================
 */

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

/**
 * ========================================
 * SERVER START
 * ========================================
 */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
    ╔════════════════════════════════════╗
    ║  🚀 Server Running Successfully    ║
    ║  📍 http://localhost:${PORT}    ║
    ║  🌍 Environment: ${process.env.NODE_ENV || 'development'}     ║
    ╚════════════════════════════════════╝
  `);
});

module.exports = app;