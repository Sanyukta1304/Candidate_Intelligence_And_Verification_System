# Frontend-Backend Integration Guide

## Overview

This guide outlines how the CredVerify frontend integrates with the backend API.

## API Base URL

- **Development**: `http://localhost:5000`
- **Production**: Configure via `VITE_API_URL` environment variable

## Authentication Flow

### 1. Registration Flow

**Frontend:**
```javascript
// User fills form in RegisterPage.jsx
const handleSubmit = async (e) => {
  const response = await authService.register(name, email, password, role);
  login(response.user, response.token);
};
```

**Backend Endpoint:**
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "hashedPassword",
  "role": "candidate" | "recruiter"
}
```

**Expected Response:**
```json
{
  "user": {
    "_id": "objectId",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "candidate",
    "createdAt": "2024-04-21T10:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login Flow

**Frontend:**
```javascript
// User enters credentials in LoginPage.jsx
const handleSubmit = async (e) => {
  const response = await authService.login(email, password);
  login(response.user, response.token);
};
```

**Backend Endpoint:**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "userPassword"
}
```

**Expected Response:**
```json
{
  "user": {
    "_id": "objectId",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "candidate"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. GitHub OAuth Flow

**Step 1: Redirect to GitHub**
```
Frontend Button Click → authService.githubAuth()
↓
Redirect to: http://localhost:5000/api/auth/github
```

**Step 2: GitHub Authorization**
```
User approves authorization on GitHub
↓
GitHub redirects to: /api/auth/github/callback?code=xxxxx&state=xxxxx
```

**Step 3: Backend Exchanges Code**
```
Backend exchanges code for GitHub access token
Fetches user data from GitHub API
Creates/Updates user in database
Generates JWT token
```

**Step 4: Redirect to Frontend**
```
Redirect to: http://localhost:3000/dashboard?token=xxxxx
OR
Store token in session and redirect
```

**Frontend Handling:**
```javascript
// The frontend should handle redirect with token
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  
  if (token) {
    login(user, token);
    navigate('/dashboard');
  }
}, []);
```

### 4. Authenticated Requests

**How JWT Token is Sent:**

```javascript
// Axios Interceptor (axios.js)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Header Format:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. Error Handling

**401 Unauthorized:**
```javascript
// Response Interceptor
if (error.response?.status === 401) {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login'; // Redirect to login
}
```

**Other Errors:**
```javascript
// Return error object with message
{
  message: "Invalid credentials",
  status: 400,
  data: {...}
}
```

## API Endpoints Reference

### Authentication Endpoints

| Method | Endpoint | Purpose | Requires Auth |
|--------|----------|---------|-----------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/github` | Initiate GitHub OAuth | No |
| POST | `/api/auth/github/callback` | Handle GitHub callback | No |
| GET | `/api/auth/me` | Get current user | Yes |
| POST | `/api/auth/logout` | Logout user | Yes |

### Candidate Endpoints (Role: candidate)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/candidate/profile` | Get candidate profile |
| PUT | `/api/candidate/profile` | Update profile |
| GET | `/api/candidate/resume` | Get resume |
| POST | `/api/candidate/resume` | Upload resume |
| GET | `/api/candidate/projects` | Get projects |
| POST | `/api/candidate/projects` | Create project |
| PUT | `/api/candidate/projects/:id` | Update project |
| DELETE | `/api/candidate/projects/:id` | Delete project |
| GET | `/api/candidate/score` | Get score card |

### Recruiter Endpoints (Role: recruiter)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/recruiter/candidates` | List candidates |
| GET | `/api/recruiter/candidates/:id` | Get candidate detail |
| POST | `/api/recruiter/shortlist` | Add to shortlist |
| DELETE | `/api/recruiter/shortlist/:id` | Remove from shortlist |
| GET | `/api/recruiter/shortlist` | Get shortlist |
| POST | `/api/recruiter/notifications` | Send notification |

## Backend Requirements

### CORS Configuration

```javascript
// backend/server.js
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

### JWT Configuration

```javascript
// Backend should use same JWT secret for token verification
// Token should be signed with secret and expire time

// Example token payload:
{
  _id: userId,
  email: userEmail,
  role: userRole,
  iat: issuedAt,
  exp: expiresAt
}
```

### GitHub OAuth Configuration

```javascript
// backend/.env
GITHUB_CLIENT_ID=xxxxx
GITHUB_CLIENT_SECRET=xxxxx
GITHUB_REDIRECT_URI=http://localhost:5000/api/auth/github/callback
```

## Frontend Service Usage Examples

### Register Example

```javascript
import { authService } from '@/api/authService';
import { useAuth } from '@/contexts/AuthContext';

export function RegisterForm() {
  const { register, error } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await authService.register(
        formData.name,
        formData.email,
        formData.password,
        'candidate'
      );
      register(response.user, response.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Form JSX
  );
}
```

### API Call with Token Example

```javascript
import { candidateService } from '@/api/candidateService';

export function ProfileEdit() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Token automatically added by axios interceptor
        const data = await candidateService.getProfile();
        setProfile(data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    // Profile JSX
  );
}
```

## Common Backend Issues & Solutions

### Issue: CORS Error
```
Error: Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution:** Update CORS configuration in backend to include frontend URL

```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Issue: Token Not Working
```
401 Unauthorized: Invalid token
```

**Solution:** Verify:
1. Token is being sent in Authorization header
2. Backend JWT secret matches
3. Token hasn't expired

### Issue: GitHub OAuth Loop
```
Continuous redirects between frontend and backend
```

**Solution:** Implement state parameter and verify callback properly

```javascript
// Backend should verify state and set token properly
res.redirect(`http://localhost:3000/dashboard?token=${jwtToken}`);
```

## Testing the Integration

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "candidate"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Get current user (requires token)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

### Using Postman

1. Create collection for CredVerify
2. Create environment with `base_url` and `token` variables
3. Test each endpoint
4. Use Tests to auto-set token variable

```javascript
// In Postman Tests tab
if (pm.response.code === 200) {
  let jsonData = pm.response.json();
  pm.environment.set("token", jsonData.token);
}
```

## Deployment Considerations

### Environment Variables

**Frontend (.env):**
```
VITE_API_URL=https://api.credverify.com
```

**Backend (.env):**
```
FRONTEND_URL=https://credverify.com
JWT_SECRET=your-secret-key
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx
```

### Security

1. **HTTPS Only**: Ensure all communication is HTTPS
2. **Token Security**: Use httpOnly cookies instead of localStorage (if possible)
3. **CSRF Protection**: Implement CSRF tokens
4. **Rate Limiting**: Add rate limits to auth endpoints
5. **Input Validation**: Validate all inputs on backend

## Troubleshooting Checklist

- [ ] Backend is running on port 5000
- [ ] Frontend has correct VITE_API_URL
- [ ] CORS is properly configured
- [ ] JWT secret is same in backend
- [ ] Token format is correct in Authorization header
- [ ] GitHub OAuth credentials are set
- [ ] Database is connected and migrations run
- [ ] Check browser console for errors
- [ ] Check backend logs for errors
- [ ] Network tab shows correct API calls

---

For backend setup, see [BACKEND_INTEGRATION_GUIDE.md](../backend/INTEGRATION_GUIDE.js)
