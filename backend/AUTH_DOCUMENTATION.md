# 🛡️ Authentication & Role-Based Access Control (RBAC) Module

## 📋 Table of Contents
1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Files Explanation](#files-explanation)
4. [Installation](#installation)
5. [API Endpoints](#api-endpoints)
6. [Usage Examples](#usage-examples)
7. [Best Practices](#best-practices)

---

## Overview

This authentication module provides a complete JWT-based authentication system with role-based access control for the MERN stack. It supports:

✅ User registration with hashed passwords (bcrypt)
✅ User login with JWT token generation
✅ Role-based access control (user/admin)
✅ GitHub OAuth 2.0 integration
✅ Protected routes middleware
✅ Modular and scalable architecture

---

## Project Structure

```
backend/
├── models/
│   └── User.js                 # Mongoose User schema
├── middleware/
│   ├── auth.js                 # JWT verification
│   └── requireRole.js          # Role-based access control
├── controllers/
│   └── auth.controller.js      # Authentication logic
├── routes/
│   └── auth.routes.js          # API routes
├── config/
│   └── passport.js             # GitHub OAuth strategy
├── .env                        # Environment variables
└── INTEGRATION_GUIDE.js        # Server integration example
```

---

## Files Explanation

### 1. **models/User.js** - Mongoose Schema

**What it does:**
- Defines the User database schema
- Implements password hashing before saving
- Provides methods for password comparison and sensitive data removal

**Key Fields:**
```javascript
- username: String (unique, required)
- email: String (unique, required)
- password: String (hashed, not returned by default)
- role: String (enum: ['user', 'admin'], default: 'user')
- githubId: String (for OAuth)
- githubProfile: Object (stores GitHub user info)
- isActive: Boolean (account status)
```

**Methods:**
- `matchPassword(enteredPassword)` - Compare entered password with hashed password
- `toJSON()` - Remove sensitive fields before sending response

---

### 2. **middleware/auth.js** - JWT Verification

**What it does:**
- Validates JWT tokens from Authorization headers
- Extracts user info and attaches to request object
- Handles token expiration and invalid tokens

**Usage:**
```javascript
app.use('/api/protected', verifyToken);
```

**Expected Header:**
```
Authorization: Bearer <your-jwt-token>
```

**Error Handling:**
- ✅ Token expired → 401 with "Token expired" message
- ✅ Invalid token → 401 with "Invalid token" message
- ✅ No token provided → 401 with "No token provided" message

---

### 3. **middleware/requireRole.js** - Role-Based Access Control

**What it does:**
- Restricts access based on user role
- Can accept multiple allowed roles
- Must be used AFTER verifyToken middleware

**Usage:**
```javascript
// Single role
router.get('/admin', verifyToken, requireRole('admin'), handler);

// Multiple roles
router.post('/manage', verifyToken, requireRole('admin', 'manager'), handler);
```

---

### 4. **controllers/auth.controller.js** - Business Logic

**Functions:**

#### `register(req, res)`
- Creates a new user account
- Validates input and checks for duplicates
- Hashes password automatically
- Generates JWT token
- **Body:** `{ username, email, password, passwordConfirm, role? }`
- **Returns:** User object + JWT token

#### `login(req, res)`
- Authenticates user with email and password
- Compares passwords using bcrypt
- Checks if account is active
- Generates JWT token
- **Body:** `{ email, password }`
- **Returns:** User object + JWT token

#### `getCurrentUser(req, res)`
- Retrieves current logged-in user info
- Requires valid JWT token
- **Returns:** User object

#### `logout(req, res)`
- Logs out user (backend just acknowledges)
- Client should delete token from storage
- **Returns:** Success message

---

### 5. **routes/auth.routes.js** - API Endpoints

**Public Endpoints:**
```
POST   /api/auth/register      # Register new user
POST   /api/auth/login         # Login user
GET    /api/auth/github        # GitHub OAuth initiation
GET    /api/auth/github/callback  # GitHub OAuth callback
```

**Protected Endpoints:**
```
GET    /api/auth/me            # Get current user (requires JWT)
POST   /api/auth/logout        # Logout (requires JWT)
```

**Admin Endpoints:**
```
GET    /api/auth/admin/users   # Get users (admin only)
```

---

### 6. **config/passport.js** - GitHub OAuth

**What it does:**
- Configures Passport.js for GitHub authentication
- Creates or updates user on successful GitHub login
- Serializes/deserializes user for sessions

**Flow:**
1. User clicks "Login with GitHub"
2. Redirected to GitHub auth page
3. GitHub redirects back to `/api/auth/github/callback`
4. User created/updated in database
5. JWT token generated and sent to frontend
6. Frontend stores token in localStorage

---

## Installation

### 1. Install Dependencies
```bash
npm install bcryptjs jsonwebtoken passport passport-github2 express express-session
```

### 2. Update .env File
```env
# JWT Configuration
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRY=7d

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback

# Client URL (for redirects)
CLIENT_URL=http://localhost:5173
```

### 3. Update package.json scripts (optional)
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

---

## API Endpoints

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "passwordConfirm": "SecurePass123",
  "role": "user"  // Optional, defaults to 'user'
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <your-jwt-token>

Response (200):
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-04-18T10:30:00.000Z"
  }
}
```

### GitHub OAuth
```
Step 1: User visits /api/auth/github
Step 2: Redirected to GitHub login
Step 3: GitHub redirects to /api/auth/github/callback
Step 4: Redirected to frontend with token in URL
```

---

## Usage Examples

### Frontend - Register User
```javascript
async function register() {
  const response = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'john_doe',
      email: 'john@example.com',
      password: 'SecurePass123',
      passwordConfirm: 'SecurePass123',
    }),
  });
  
  const data = await response.json();
  localStorage.setItem('token', data.token);
}
```

### Frontend - Login User
```javascript
async function login() {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'john@example.com',
      password: 'SecurePass123',
    }),
  });
  
  const data = await response.json();
  localStorage.setItem('token', data.token);
}
```

### Frontend - Protected API Call
```javascript
async function getProtectedData() {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:5000/api/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  const data = await response.json();
  console.log(data.user);
}
```

### Frontend - GitHub OAuth
```javascript
function loginWithGithub() {
  window.location.href = 'http://localhost:5000/api/auth/github';
}

// Handle callback
function handleGithubCallback() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  localStorage.setItem('token', token);
  // Redirect to dashboard
}
```

### Backend - Creating Protected Routes
```javascript
const express = require('express');
const { verifyToken } = require('./middleware/auth');
const { requireRole } = require('./middleware/requireRole');

const router = express.Router();

// User routes
router.get('/profile', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

// Admin routes
router.delete('/users/:id', verifyToken, requireRole('admin'), (req, res) => {
  // Delete user logic
});

module.exports = router;
```

---

## Best Practices

### Security
✅ Always use HTTPS in production
✅ Store JWT_SECRET securely (use strong, random values)
✅ Set short expiry times for tokens (7d recommended)
✅ Validate all user input
✅ Never expose passwords in responses
✅ Use httpOnly cookies for production (add middleware)

### Backend Integration
✅ Place verifyToken BEFORE requireRole middleware
✅ Always validate user existence before operations
✅ Use timestamps for created/updated tracking
✅ Implement rate limiting for login/register

### Frontend Integration
✅ Store token in localStorage or sessionStorage
✅ Include token in Authorization header for protected routes
✅ Handle token expiration gracefully
✅ Redirect to login on 401 errors
✅ Implement token refresh mechanism (optional)

### Database
✅ Use unique indexes for username and email
✅ Store passwords hashed (bcryptjs handles this)
✅ Add email verification (optional enhancement)
✅ Implement password reset flow (optional enhancement)

---

## 📞 Common Issues & Solutions

**Issue:** Token always returning 401
- **Solution:** Make sure JWT_SECRET is set in .env and used consistently

**Issue:** Password comparison failing
- **Solution:** Ensure matchPassword method is called correctly in login

**Issue:** GitHub OAuth not working
- **Solution:** Verify GitHub Client ID/Secret and Callback URL in .env

**Issue:** CORS errors
- **Solution:** Update CLIENT_URL in .env to match frontend URL

---

## 🚀 Next Steps

1. Update your main `server.js` using `INTEGRATION_GUIDE.js` as reference
2. Add email verification
3. Implement password reset functionality
4. Add refresh token mechanism
5. Implement rate limiting
6. Add user profile update endpoint
7. Add admin user management endpoints

---

**Created:** April 18, 2026
**Version:** 1.0.0
**Status:** Production Ready
