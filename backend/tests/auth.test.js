/**
 * ========================================
 * AUTHENTICATION TESTS - BE-1
 * ========================================
 * Comprehensive test suite for user authentication and role-based access
 * 
 * Requirements:
 * - MongoDB running on mongodb://localhost:27017
 * - Environment variables in .env file
 * - All auth middleware and controllers properly configured
 */

const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Test utilities
let testServer;
let app;
let testUser = {
  username: 'testcandidate',
  email: 'candidate@test.com',
  password: 'testpassword123',
  role: 'candidate',
};

let recruiterUser = {
  username: 'testrecruiter',
  email: 'recruiter@test.com',
  password: 'recruiterpass123',
  role: 'recruiter',
};

let authToken;
let recruiterToken;
let invalidToken = 'invalid.token.here';

/**
 * ========================================
 * TEST SETUP & TEARDOWN
 * ========================================
 */

// Start server before tests
beforeAll(async () => {
  console.log('\n🔄 Starting server and connecting to database...\n');
  
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/civs_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected for testing');

    // Import and create express app
    app = require('../server');
    console.log('✅ Server instance created');
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    throw error;
  }
});

// Clean up after tests
afterAll(async () => {
  console.log('\n🧹 Cleaning up test data...\n');
  
  try {
    const User = require('../models/User');
    await User.deleteMany({ email: { $in: [testUser.email, recruiterUser.email] } });
    console.log('✅ Test users deleted');
    
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
  }
});

/**
 * ========================================
 * TEST SUITE: REGISTRATION
 * ========================================
 */

describe('🔐 BE-1: User Authentication & Role-Based Access', () => {
  
  describe('📝 POST /api/auth/register - User Registration', () => {
    
    test('✅ Should register a candidate successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.role).toBe('candidate');
      expect(response.body.user.email).toBe(testUser.email);

      authToken = response.body.token;
      console.log('✅ Candidate registration passed');
    });

    test('✅ Should register a recruiter successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(recruiterUser);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.user.role).toBe('recruiter');
      expect(response.body.token).toBeDefined();

      recruiterToken = response.body.token;
      console.log('✅ Recruiter registration passed');
    });

    test('❌ Should fail with missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          // Missing password
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('required fields');
      console.log('✅ Missing fields validation passed');
    });

    test('❌ Should fail with mismatched passwords', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          email: 'newuser@test.com',
          password: 'password123',
          passwordConfirm: 'password456',
          role: 'candidate',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('do not match');
      console.log('✅ Password mismatch validation passed');
    });

    test('❌ Should fail with duplicate email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'different_user',
          email: testUser.email, // Same email as first user
          password: 'password123',
          passwordConfirm: 'password123',
          role: 'candidate',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('already in use');
      console.log('✅ Duplicate email validation passed');
    });
  });

  /**
   * ========================================
   * TEST SUITE: LOGIN
   * ========================================
   */

  describe('🔓 POST /api/auth/login - User Login', () => {
    
    test('✅ Should login candidate with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.token).toBeDefined();
      expect(response.body.user.role).toBe('candidate');
      console.log('✅ Candidate login passed');
    });

    test('✅ Should login recruiter with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: recruiterUser.email,
          password: recruiterUser.password,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user.role).toBe('recruiter');
      console.log('✅ Recruiter login passed');
    });

    test('❌ Should fail with missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          // Missing password
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      console.log('✅ Missing credentials validation passed');
    });

    test('❌ Should fail with non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'anypassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('Invalid');
      console.log('✅ Non-existent user validation passed');
    });

    test('❌ Should fail with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('Invalid');
      console.log('✅ Incorrect password validation passed');
    });
  });

  /**
   * ========================================
   * TEST SUITE: JWT TOKEN VERIFICATION
   * ========================================
   */

  describe('🔑 JWT Token Verification & Protected Routes', () => {
    
    test('✅ Should get current user with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user.role).toBe('candidate');
      console.log('✅ Current user retrieval passed');
    });

    test('❌ Should fail without token', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('No token');
      console.log('✅ Missing token validation passed');
    });

    test('❌ Should fail with invalid token format', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'InvalidFormat');

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('No token');
      console.log('✅ Invalid token format validation passed');
    });

    test('❌ Should fail with malformed token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${invalidToken}`);

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('Invalid token');
      console.log('✅ Malformed token validation passed');
    });
  });

  /**
   * ========================================
   * TEST SUITE: ROLE-BASED ACCESS CONTROL (RBAC)
   * ========================================
   */

  describe('👑 Role-Based Access Control', () => {
    
    test('✅ Admin endpoint should reject candidate', async () => {
      const response = await request(app)
        .get('/api/auth/admin/users')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('Access denied');
      console.log('✅ Candidate rejection from admin endpoint passed');
    });

    test('✅ Recruiter can access their own data', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${recruiterToken}`);

      expect(response.status).toBe(200);
      expect(response.body.user.role).toBe('recruiter');
      console.log('✅ Recruiter access to own data passed');
    });
  });

  /**
   * ========================================
   * TEST SUITE: LOGOUT
   * ========================================
   */

  describe('🚪 POST /api/auth/logout - User Logout', () => {
    
    test('✅ Should logout successfully with valid token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Logout successful');
      console.log('✅ Logout passed');
    });

    test('❌ Should fail logout without token', async () => {
      const response = await request(app)
        .post('/api/auth/logout');

      expect(response.status).toBe(401);
      console.log('✅ Logout without token validation passed');
    });
  });

  /**
   * ========================================
   * TEST SUITE: TOKEN STRUCTURE VALIDATION
   * ========================================
   */

  describe('🔎 Token Structure & Claims Validation', () => {
    
    test('✅ Token should contain correct claims', async () => {
      const decoded = jwt.decode(authToken);

      expect(decoded).toBeDefined();
      expect(decoded.id).toBeDefined();
      expect(decoded.role).toBe('candidate');
      expect(decoded.exp).toBeDefined();
      console.log('✅ Token claims validation passed');
    });

    test('✅ Recruiter token should have recruiter role claim', async () => {
      const decoded = jwt.decode(recruiterToken);

      expect(decoded.role).toBe('recruiter');
      console.log('✅ Recruiter token claims validation passed');
    });
  });

  /**
   * ========================================
   * TEST SUITE: PASSWORD HASHING
   * ========================================
   */

  describe('🔐 Password Hashing & Security', () => {
    
    test('✅ Password should be hashed in database', async () => {
      const User = require('../models/User');
      const user = await User.findOne({ email: testUser.email }).select('+password');

      expect(user.password).toBeDefined();
      expect(user.password).not.toBe(testUser.password);
      expect(user.password.length).toBeGreaterThan(20); // bcrypt hash is long
      console.log('✅ Password hashing validation passed');
    });

    test('✅ comparePassword method should work correctly', async () => {
      const User = require('../models/User');
      const user = await User.findOne({ email: testUser.email }).select('+password');

      const isMatch = await user.matchPassword(testUser.password);
      expect(isMatch).toBe(true);

      const isNoMatch = await user.matchPassword('wrongpassword');
      expect(isNoMatch).toBe(false);
      console.log('✅ Password comparison validation passed');
    });
  });

  /**
   * ========================================
   * TEST SUITE: USER DATA VALIDATION
   * ========================================
   */

  describe('✔️ User Data Validation', () => {
    
    test('✅ Should reject invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'notanemail',
          password: 'password123',
          passwordConfirm: 'password123',
          role: 'candidate',
        });

      expect(response.status).toBe(500);
      console.log('✅ Invalid email format validation passed');
    });

    test('✅ Should reject short username', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'ab', // Too short
          email: 'test@example.com',
          password: 'password123',
          passwordConfirm: 'password123',
          role: 'candidate',
        });

      expect(response.status).toBe(500);
      console.log('✅ Short username validation passed');
    });

    test('✅ Should only allow candidate or recruiter roles', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          passwordConfirm: 'password123',
          role: 'admin', // Invalid role
        });

      expect(response.status).toBe(500);
      console.log('✅ Invalid role validation passed');
    });
  });
});

/**
 * ========================================
 * TEST SUMMARY
 * ========================================
 * 
 * This test suite validates:
 * ✅ User registration with proper validation
 * ✅ User login with credential verification
 * ✅ JWT token generation and validation
 * ✅ Protected route access with token verification
 * ✅ Role-based access control (RBAC)
 * ✅ Logout functionality
 * ✅ Password hashing and security
 * ✅ Input validation and error handling
 * 
 * Run with: npm test
 */
