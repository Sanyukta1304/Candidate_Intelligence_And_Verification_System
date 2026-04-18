# 🚀 QUICK START GUIDE

## Step 1: Install Dependencies ✅
```bash
npm install
```

All required packages are already in package.json:
- ✅ Express.js (server framework)
- ✅ Mongoose (MongoDB ODM)
- ✅ bcryptjs (password hashing)
- ✅ jsonwebtoken (JWT)
- ✅ Passport.js (authentication)
- ✅ passport-github2 (GitHub OAuth)
- ✅ cors (Cross-Origin Resource Sharing)
- ✅ dotenv (environment variables)

## Step 2: Configure Environment Variables
Copy `.env.example` to `.env` and update with your values:

```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

Update these values in `.env`:
```env
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secure-secret-key
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
CLIENT_URL=http://localhost:5173
```

## Step 3: Create/Update Main Server File
Create `server.js` in the backend directory or use the `INTEGRATION_GUIDE.js` as a template.

Key components to include:
```javascript
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth.routes');
require('./config/passport');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

// Routes
app.use('/api/auth', authRoutes);

// Start server
app.listen(process.env.PORT || 5000);
```

## Step 4: Run the Server
```bash
npm run dev    # Development with auto-reload
npm start      # Production
```

Expected output:
```
╔════════════════════════════════════╗
║  🚀 Server Running Successfully    ║
║  📍 http://localhost:5000          ║
║  🌍 Environment: development        ║
╚════════════════════════════════════╝
```

---

## 📝 File Overview

| File | Purpose |
|------|---------|
| `models/User.js` | User database schema |
| `middleware/auth.js` | JWT verification |
| `middleware/requireRole.js` | Role-based access control |
| `controllers/auth.controller.js` | Authentication logic |
| `routes/auth.routes.js` | API endpoints |
| `config/passport.js` | GitHub OAuth strategy |
| `AUTH_DOCUMENTATION.md` | Complete documentation |
| `INTEGRATION_GUIDE.js` | Server setup example |
| `.env.example` | Environment variables template |

---

## 🧪 Testing Endpoints

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test@1234",
    "passwordConfirm": "Test@1234"
  }'
```

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@1234"
  }'
```

### Get Current User (Protected)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## ⚙️ Setup GitHub OAuth (Optional)

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - **Application name:** Your App Name
   - **Homepage URL:** http://localhost:5000
   - **Authorization callback URL:** http://localhost:5000/api/auth/github/callback
4. Get Client ID and Secret
5. Add to `.env`:
   ```env
   GITHUB_CLIENT_ID=your-id
   GITHUB_CLIENT_SECRET=your-secret
   ```

---

## 🔑 Generate JWT Secret

Run this command in Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output to `JWT_SECRET` in `.env`

---

## 📚 Additional Resources

- **JWT Documentation:** https://jwt.io
- **Passport.js:** http://www.passportjs.org
- **Mongoose Documentation:** https://mongoosejs.com
- **Express.js:** https://expressjs.com
- **bcryptjs:** https://github.com/dcodeIO/bcrypt.js

---

## 🚨 Common Issues

**Port already in use?**
```bash
# Change PORT in .env or:
PORT=5001 npm run dev
```

**MongoDB connection error?**
- Check MONGO_URI in .env
- Ensure MongoDB is running
- Check network access if using Atlas

**JWT errors?**
- Verify JWT_SECRET is set and consistent
- Check token format: `Bearer <token>`
- Ensure token hasn't expired

---

## ✨ Next Steps

1. ✅ Test registration & login
2. ✅ Test protected routes
3. ✅ Setup GitHub OAuth
4. Implement password reset
5. Add email verification
6. Add user profile endpoints
7. Implement refresh tokens
8. Add rate limiting

---

**Need help?** Read `AUTH_DOCUMENTATION.md` for detailed information!
