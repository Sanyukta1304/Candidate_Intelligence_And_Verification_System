const User = require('../models/User');

const Candidate = require('../models/Candidate');
const Recruiter = require('../models/Recruiter');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * Generate JWT token
 */
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role: role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY || '7d' }
  );
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
const register = async (req, res, next) => {
  try {

    // Check if request body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Request body is empty. Please ensure Content-Type is set to application/json and body contains username, email, password, passwordConfirm, and role.',
      });
    }


    const { username, email, password, passwordConfirm, role } = req.body;

    // Validation
    if (!username || !email || !password || !passwordConfirm) {
      return res.status(400).json({
        success: false,

        message: 'Please provide all required fields',

        message: 'Please provide all required fields: username, email, password, passwordConfirm',
      });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Email or username already in use',
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role: role && ['candidate', 'recruiter'].includes(role) ? role : 'candidate', // Default role is 'candidate'
    });


    // ✅ AUTO-CREATE CANDIDATE PROFILE IF ROLE IS CANDIDATE
    if (user.role === 'candidate') {
      try {
        await Candidate.create({
          user_id: user._id,
          // Other fields will have defaults from schema
        });
      } catch (candidateError) {
        console.error('Candidate profile creation error:', candidateError);
        // Don't fail the registration if candidate profile creation fails
      }
    }

    // ✅ AUTO-CREATE RECRUITER PROFILE IF ROLE IS RECRUITER
    if (user.role === 'recruiter') {
      try {
        await Recruiter.create({
          user_id: user._id,
          company_name: '',
          company_email: '',
          about_company: '',
          address: '',
          logo_url: null
          // starred, viewed_profiles, counters will have defaults from schema
        });
      } catch (recruiterError) {
        console.error('Recruiter profile creation error:', recruiterError);
        // Don't fail the registration if recruiter profile creation fails
      }
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
const login = async (req, res, next) => {
  try {

    // Check if request body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Request body is empty. Please ensure Content-Type is set to application/json and body contains email and password.',
      });
    }

    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,

        message: 'Please provide email and password',

        message: 'Please provide both email and password',
      });
    }

    // Check if user exists and get password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'User account is deactivated',
      });
    }

    // Check password
    const isPasswordValid = await user.matchPassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user
 * @access  Private
 */
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        github_verified: user.github_verified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token deletion)
 * @access  Private
 */
const logout = (req, res, next) => {
  return res.status(200).json({
    success: true,
    message: 'Logout successful. Please delete the token from client side.',
  });
};

module.exports = {
  register,
  login,
  getCurrentUser,
  logout,
  generateToken,
};
