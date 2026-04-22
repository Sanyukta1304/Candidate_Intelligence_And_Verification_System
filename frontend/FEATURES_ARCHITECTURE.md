# CredVerify Frontend - Features & Architecture

## Overview

CredVerify frontend is a modern React.js application built with Tailwind CSS, React Router, and Axios. It provides a complete authentication system with role-based access control for both candidates and recruiters.

## 🎯 Core Features

### 1. Authentication System

#### Features:
- **Email/Password Registration** - New user account creation
- **Email/Password Login** - Existing user authentication
- **GitHub OAuth** - Social authentication integration
- **JWT Token Management** - Secure token storage and handling
- **Auto-Redirect** - Smart redirects based on auth status
- **Remember Me** - Persistent login sessions

#### Technical Implementation:
- **AuthContext.jsx** - Global state management
- **localStorage** - Token persistence
- **Axios Interceptors** - Automatic JWT injection
- **PrivateRoute** - Route protection

### 2. Role-Based Access Control (RBAC)

#### Two User Roles:

**Candidate**
- Build professional profile
- Upload and manage resume
- Showcase projects
- View skill scores
- Get verified by system

**Recruiter**
- Browse candidate profiles
- View detailed qualifications
- Shortlist candidates
- Send notifications
- Access analytics

#### Implementation:
```javascript
// Role-based route protection
<PrivateRoute requiredRole="candidate">
  <CandidateDashboard />
</PrivateRoute>
```

### 3. Responsive Design

#### Breakpoints:
- **Mobile** - 320px and up
- **Tablet** - 768px and up
- **Desktop** - 1024px and up

#### Design System:
- **Soft UI** aesthetic with rounded cards
- **Tailwind CSS** utility-first approach
- **Custom Colors** - Primary dark (#2D333F) and light (#F5F7FA)
- **Consistent Spacing** - 4px grid system
- **Subtle Shadows** - Soft depth cues

### 4. Smart Routing

#### Route Types:

**Public Routes:**
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page

**Protected Routes:**
- `/dashboard` - User dashboard
- `/auth/github/callback` - OAuth callback

**Role-Specific Routes:**
- `/candidate/*` - Candidate-only pages
- `/recruiter/*` - Recruiter-only pages

#### Navigation Logic:
```
Unauthenticated → Home/Login/Register
Authenticated → Dashboard
Role mismatch → Redirect to main dashboard
Token expired → Redirect to login
```

### 5. API Integration

#### Axios Configuration:
- Base URL configuration
- Automatic JWT injection
- Error handling
- 401 response handling
- CORS support

#### Service Functions:
- `authService` - Authentication APIs
- `candidateService` - Candidate-specific APIs
- `recruiterService` - Recruiter-specific APIs

---

## 🏗️ Architecture

### Component Hierarchy

```
App
├── AuthProvider (Context)
├── Navbar
└── Routes
    ├── PublicRoute
    │   ├── HomePage
    │   ├── LoginPage
    │   └── RegisterPage
    ├── PrivateRoute
    │   ├── DashboardPage
    │   └── GitHubCallbackPage
    └── RoleBasedRoute
        ├── CandidatePage
        └── RecruiterPage
```

### State Management

**Global State (AuthContext):**
```javascript
{
  user: {
    _id: string,
    name: string,
    email: string,
    role: 'candidate' | 'recruiter'
  },
  token: string,
  isAuthenticated: boolean,
  loading: boolean,
  error: string | null
}
```

**Component State:**
- Form data (email, password, etc.)
- Loading states
- Error messages
- UI interactions

### Data Flow

```
User Action (Submit Form)
    ↓
Component Handler
    ↓
API Service Function
    ↓
Axios Request (with JWT)
    ↓
Backend Processing
    ↓
Response Received
    ↓
AuthContext Updated
    ↓
Component Re-render
    ↓
Route Redirect (if needed)
```

---

## 📦 Key Components

### Navbar Component
- Logo and branding
- Navigation links
- Auth status display
- User menu (when logged in)
- Responsive design

### PrivateRoute Component
- Authentication check
- Role verification
- Loading state handling
- Automatic redirect to login

### Public Routes
- Accessible without authentication
- Redirect to dashboard if logged in
- Beautiful landing page
- Clear CTAs

### Auth Pages
- **LoginPage**: Email/password + GitHub OAuth
- **RegisterPage**: Role selection + account creation
- **GitHubCallbackPage**: OAuth callback handler

### Dashboard Pages
- **HomePage**: Landing page with features
- **DashboardPage**: Role-specific dashboard
- **CandidatePage**: Candidate-specific content
- **RecruiterPage**: Recruiter-specific content

---

## 🔐 Security Features

### Authentication Security
- JWT tokens for stateless auth
- Secure token storage in localStorage
- Automatic token injection in headers
- Token expiration handling
- Immediate logout on 401 errors

### Protected Routes
- Role-based access control
- Prevents unauthorized access
- Automatic redirects
- Private data protection

### API Security
- Authorization headers
- CORS configuration
- Error handling
- Input validation (on backend)

### Best Practices
- No sensitive data in localStorage (consider httpOnly cookies)
- HTTPS enforcement (in production)
- CSRF token support
- Rate limiting (backend)

---

## 🎨 UI/UX Design

### Design Philosophy
- **Minimalist** - Clean and simple
- **Accessible** - WCAG compliant
- **Responsive** - Works on all devices
- **Professional** - Enterprise-grade appearance

### Color Palette
```
Primary Dark:    #2D333F (buttons, headings)
Primary Light:   #F5F7FA (backgrounds)
Slate 200:       #E2E8F0 (borders)
Slate 600:       #475569 (text)
Slate 800:       #1E293B (dark text)
White:           #FFFFFF (cards)
```

### Typography
- **Headings**: Bold, 2.5rem - 3rem
- **Body**: Regular, 1rem
- **Labels**: Medium, 0.875rem
- **Font Family**: System stack

### Components
- **Cards**: Rounded corners, subtle shadows
- **Buttons**: Clear states (hover, active, disabled)
- **Forms**: Large inputs, clear labels
- **Alerts**: Color-coded messages

---

## 🔌 API Integration Points

### Authentication APIs
```
POST /api/auth/register
POST /api/auth/login
GET /api/auth/github
POST /api/auth/github/callback
GET /api/auth/me
POST /api/auth/logout
```

### Candidate APIs
```
GET /api/candidate/profile
PUT /api/candidate/profile
GET/POST /api/candidate/resume
GET/POST/PUT/DELETE /api/candidate/projects
GET /api/candidate/score
```

### Recruiter APIs
```
GET /api/recruiter/candidates
GET /api/recruiter/candidates/:id
POST /api/recruiter/shortlist
DELETE /api/recruiter/shortlist/:id
GET /api/recruiter/shortlist
POST /api/recruiter/notifications
```

---

## 📊 Performance Optimizations

### Code Splitting
- Separate route-based bundles
- Lazy loading components

### Rendering Optimization
- React.memo for pure components
- useCallback for event handlers
- useMemo for computed values

### Asset Optimization
- Vite build minification
- CSS minification
- Tree shaking

### State Management
- Efficient context usage
- Minimal re-renders
- Proper dependency arrays

---

## 🧪 Testing Strategy

### Unit Tests
- Component rendering
- Event handlers
- State management

### Integration Tests
- API calls
- Authentication flow
- Route navigation

### E2E Tests
- Complete user journeys
- Form submissions
- Error scenarios

---

## 📚 Technology Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | React | 18.2.0 |
| Routing | React Router | 6.20.0 |
| HTTP Client | Axios | 1.6.0 |
| CSS Framework | Tailwind CSS | 3.4.1 |
| Build Tool | Vite | 5.0.8 |
| Language | JavaScript (ES6+) | Latest |

---

## 🚀 Deployment

### Build Process
```bash
npm run build
```

Creates optimized production build in `dist/` folder.

### Deployment Targets
- **Vercel** - Recommended (automatic deployment)
- **Netlify** - Good alternative
- **Custom Server** - nginx, Apache, etc.

### Environment Configuration
```
VITE_API_URL=https://api.credverify.com
```

---

## 🔄 Development Workflow

### File Structure
```
src/
├── api/
│   ├── axios.js
│   ├── authService.js
│   ├── candidateService.js
│   └── recruiterService.js
├── components/
│   ├── Navbar.jsx
│   ├── PrivateRoute.jsx
│   └── UI.jsx
├── contexts/
│   └── AuthContext.jsx
├── hooks/
│   └── useApiCall.js
├── pages/
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── DashboardPage.jsx
│   └── GitHubCallbackPage.jsx
├── App.jsx
├── main.jsx
└── index.css
```

### Development Commands
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview prod build
```

---

## 🤝 Contributing Guidelines

### Code Style
- Use functional components
- Follow React best practices
- Use meaningful variable names
- Add comments for complex logic

### Git Workflow
1. Create feature branch
2. Make changes
3. Commit with clear messages
4. Push to remote
5. Create Pull Request

### Commit Message Format
```
feat: add new feature
fix: fix bug
style: formatting changes
refactor: code restructuring
docs: documentation
test: add tests
```

---

## 📖 Documentation

- [README.md](./README.md) - Project overview
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Installation guide
- [QUICK_START.md](./QUICK_START.md) - 5-minute setup
- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - API integration
- [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) - Feature checklist

---

## 🎓 Learning Resources

### React Documentation
- [React Docs](https://react.dev)
- [Hooks API Reference](https://react.dev/reference/react)
- [Context API](https://react.dev/reference/react/useContext)

### React Router
- [React Router Documentation](https://reactrouter.com)
- [Route Configuration](https://reactrouter.com/en/main/route/route)

### Tailwind CSS
- [Tailwind Documentation](https://tailwindcss.com)
- [Configuration](https://tailwindcss.com/docs/configuration)

### Axios
- [Axios Documentation](https://axios-http.com)
- [Interceptors](https://axios-http.com/docs/interceptors)

---

## 🆘 Support

### Common Issues
- See [SETUP_GUIDE.md](./SETUP_GUIDE.md#troubleshooting)
- Check [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md#troubleshooting-checklist)

### Getting Help
1. Check documentation
2. Review error messages in console
3. Check browser DevTools
4. Review network requests
5. Check backend logs

---

## 📈 Future Enhancements

### Short Term
- [ ] Add toast notifications
- [ ] Implement form validation
- [ ] Add loading skeletons
- [ ] Add error boundaries
- [ ] Setup testing suite

### Medium Term
- [ ] Add real-time notifications
- [ ] Implement search/filters
- [ ] Add image uploads
- [ ] Add user preferences
- [ ] Add analytics

### Long Term
- [ ] Mobile app (React Native)
- [ ] Progressive Web App (PWA)
- [ ] Offline support
- [ ] Advanced caching
- [ ] AI-powered features

---

Last Updated: April 21, 2024  
Version: 1.0.0
