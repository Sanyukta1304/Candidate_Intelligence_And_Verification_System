# Frontend Setup & Implementation Guide

## Installation Steps

### 1. Install Dependencies

```bash
cd frontend
npm install
```

This will install:
- React & React DOM
- React Router v6
- Axios
- Tailwind CSS
- Vite (dev server & build tool)

### 2. Environment Configuration

Create a `.env` file in the frontend directory:

```bash
cp .env.example .env
```

Edit `.env` and set your API URL:
```
VITE_API_URL=http://localhost:5000
```

### 3. Verify Backend is Running

Make sure your backend is running on port 5000:
```bash
cd backend
npm run dev
```

### 4. Start Development Server

From the frontend directory:
```bash
npm run dev
```

The frontend will be available at: **http://localhost:3000**

## Testing the Application

### Test User Registration

1. Navigate to http://localhost:3000/register
2. Choose a role (Candidate or Recruiter)
3. Fill in the form
4. Click "Create Account"
5. Should be redirected to dashboard

### Test User Login

1. Navigate to http://localhost:3000/login
2. Enter the email and password you registered with
3. Click "Sign in"
4. Should be redirected to dashboard

### Test Authentication

1. Open browser DevTools (F12)
2. Go to Application > Local Storage
3. Verify `token` and `user` are stored after login
4. Try navigating to `/dashboard` - should work
5. Try navigating to `/login` while logged in - should redirect to dashboard
6. Logout and try accessing `/dashboard` - should redirect to login

### Test Role-Based Access

**Candidate User:**
- Should access `/candidate/*` routes
- Should NOT access `/recruiter/*` routes
- Dashboard should show candidate-specific content

**Recruiter User:**
- Should access `/recruiter/*` routes
- Should NOT access `/candidate/*` routes
- Dashboard should show recruiter-specific content

### Test API Integration

1. Login successfully
2. Open DevTools > Network tab
3. Make requests through the app
4. Verify `Authorization: Bearer <token>` header is present
5. Check responses for expected data

## Backend Integration Checklist

### Required Backend Endpoints

- [ ] `POST /api/auth/register` - User registration
- [ ] `POST /api/auth/login` - User login
- [ ] `GET /api/auth/github` - GitHub OAuth initiation
- [ ] `POST /api/auth/github/callback` - GitHub callback handler
- [ ] `GET /api/auth/me` - Get current user
- [ ] `POST /api/auth/logout` - Logout

### Response Format Expected

**Register & Login Response:**
```json
{
  "user": {
    "_id": "userId",
    "name": "User Name",
    "email": "user@example.com",
    "role": "candidate" | "recruiter"
  },
  "token": "jwt_token_here"
}
```

### CORS Configuration

Backend must allow requests from `http://localhost:3000`:

```javascript
// In backend server.js
cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
})
```

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   ├── axios.js           # Axios instance with interceptors
│   │   ├── authService.js     # Auth API functions
│   │   ├── candidateService.js # Candidate APIs
│   │   ├── recruiterService.js # Recruiter APIs
│   │   └── config.js          # API config & error handler
│   ├── components/
│   │   ├── Navbar.jsx         # Navigation component
│   │   └── PrivateRoute.jsx   # Route protection component
│   ├── contexts/
│   │   └── AuthContext.jsx    # Global auth state
│   ├── hooks/
│   │   └── useApiCall.js      # Reusable API call hook
│   ├── pages/
│   │   ├── HomePage.jsx       # Landing page
│   │   ├── LoginPage.jsx      # Login page
│   │   ├── RegisterPage.jsx   # Registration page
│   │   └── DashboardPage.jsx  # Dashboard
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles
├── .env.example               # Environment template
├── .gitignore                 # Git ignore rules
├── index.html                 # HTML template
├── package.json               # Dependencies
├── postcss.config.js          # PostCSS config
├── tailwind.config.js         # Tailwind config
└── vite.config.js             # Vite config
```

## Key Features Implemented

### ✅ Authentication
- Email/Password registration and login
- GitHub OAuth integration
- JWT token management
- Automatic token refresh in requests

### ✅ State Management
- Global AuthContext for user state
- localStorage persistence
- Loading states during auth

### ✅ Routing
- Public routes (home, login, register)
- Protected routes with role-based access
- Automatic redirects based on auth status
- 404 fallback

### ✅ UI/UX
- Soft UI design with Tailwind CSS
- Responsive layout
- Form validation
- Error messaging
- Loading indicators

### ✅ API Integration
- Axios instance with JWT interceptor
- Automatic error handling
- Request/Response interceptors
- Service functions for all API calls

## Common Issues & Solutions

### Issue: CORS Error
**Solution**: Verify backend CORS configuration allows frontend URL

### Issue: Token not persisting
**Solution**: Check localStorage is enabled, verify token in response

### Issue: 401 Unauthorized on API calls
**Solution**: Check JWT token in localStorage, verify token format in headers

### Issue: Routes not working
**Solution**: Verify React Router setup, check route paths match components

### Issue: Styles not loading
**Solution**: Check Tailwind CSS build, verify CSS imports in main.jsx

## Next Steps

1. **Add role-specific pages** (candidate profile, recruiter dashboard)
2. **Implement API error handling** (toast notifications)
3. **Add form validation** (client-side validation)
4. **Implement loading skeletons** (better UX)
5. **Add logout confirmation** (prevent accidental logout)
6. **Setup testing** (Jest + React Testing Library)
7. **Add environment variables** (sensitive data)
8. **Deploy** (Vercel, Netlify, or custom server)

## Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist` folder.

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

Connect your Git repository to Netlify and it will auto-deploy.

### Custom Server

Copy `dist` folder to your server and serve with a static file server.

---

For more details, see [README.md](./README.md)
