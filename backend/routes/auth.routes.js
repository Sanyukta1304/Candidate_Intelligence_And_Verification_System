const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const Candidate = require('../models/Candidate');
const {
  register,
  login,
  getCurrentUser,
  logout,
  generateToken,
} = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/requireRole');

/**
 * ========================================
 * 📝 PUBLIC ROUTES (No Authentication)
 * ========================================
 */

// User Registration
router.post('/register', register);

// User Login
router.post('/login', login);

/**
 * ========================================
 * 🔐 PROTECTED ROUTES (Authentication Required)
 * ========================================
 */

// Get current logged-in user
router.get('/me', verifyToken, getCurrentUser);

// Logout (client-side token deletion)
router.post('/logout', verifyToken, logout);

/**
 * ========================================
 * 👑 ADMIN ROUTES (Authentication + Admin Role Required)
 * ========================================
 */

// Example: Admin-only endpoint
router.get(
  '/admin/users',
  verifyToken,
  requireRole('admin'),
  (req, res) => {
    res.json({
      success: true,
      message: 'This is an admin-only endpoint',
      user: req.user,
    });
  }
);

/**
 * ========================================
 * 🐙 GITHUB OAUTH ROUTES
 * ========================================
 */

// Initiate GitHub OAuth login
// GitHub will match email to link to existing user
router.get(
  '/github',
  passport.authenticate('github', {
    scope: ['user:email'],
  })
);

<<<<<<< HEAD
// GitHub OAuth callback with email-based linking
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login', session: true }),
  async (req, res) => {
    try {
      const githubUser = req.user;

      // ✅ GitHub is already linked via email matching in Passport strategy
      // Generate token for the authenticated user
      const token = generateToken(githubUser._id, githubUser.role);

      // Redirect with token
      res.redirect(
        `${process.env.CLIENT_URL}/auth/github/callback?token=${token}&userId=${githubUser._id}`
      );
=======
// GitHub OAuth callback
router.get('/github/callback', (req, res, next) => {
  passport.authenticate('github', (err, user, info) => {
    try {
      if (err) {
        console.error('GitHub callback auth error:', err);
        return res.redirect(`${process.env.CLIENT_URL}/login?error=authentication_failed`);
      }

      if (!user) {
        return res.redirect(`${process.env.CLIENT_URL}/login?error=authentication_failed`);
      }

      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error('GitHub login session error:', loginErr);
          return res.redirect(`${process.env.CLIENT_URL}/login?error=authentication_failed`);
        }

        const token = generateToken(user._id, user.role);

        return res.redirect(
          `${process.env.CLIENT_URL}/auth/github/callback?token=${token}&userId=${user._id}`
        );
      });
>>>>>>> cf42a878e44737cf5323d658874f430fa0cae478
    } catch (error) {
      console.error('GitHub callback error:', error);
      return res.redirect(`${process.env.CLIENT_URL}/login?error=authentication_failed`);
    }
  })(req, res, next);
});

module.exports = router;