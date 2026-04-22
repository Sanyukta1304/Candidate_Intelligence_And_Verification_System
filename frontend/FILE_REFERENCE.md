# CredVerify Frontend - Complete File Reference

## 📋 File Inventory & Documentation

This document provides a complete listing of all files created for the CredVerify frontend, along with their purposes, key contents, and relationships.

---

## 📦 Configuration & Setup Files

### package.json
**Purpose**: NPM dependencies and scripts configuration  
**Key Content**:
- React 18.2.0
- React Router 6.20.0
- Axios 1.6.0
- Tailwind CSS 3.4.1
- Vite build tool
- Scripts: dev, build, preview

**Usage**: Installed via `npm install`

### vite.config.js
**Purpose**: Vite build tool configuration  
**Key Content**:
- React plugin
- Dev server port: 3000
- Proxy to backend /api routes
- Hot Module Replacement (HMR)

**Usage**: Automatically loaded by Vite

### tailwind.config.js
**Purpose**: Tailwind CSS customization  
**Key Content**:
- Custom color scheme (primary-dark, primary-light)
- Extended shadows (soft, soft-lg)
- Template paths for scanning files
- Theme extensions

**Usage**: Automatically loaded by Tailwind

### postcss.config.js
**Purpose**: PostCSS configuration  
**Key Content**:
- Tailwind CSS plugin
- Autoprefixer plugin

**Usage**: Used during CSS build process

### index.html
**Purpose**: HTML entry point for the application  
**Key Content**:
- Meta tags
- Title: "CredVerify - Candidate Intelligence & Verification System"
- Root div with id="root"
- Script tag for main.jsx
- Vite auto-detection

**Usage**: Served by Vite, template for React rendering

### .env.example
**Purpose**: Environment variables template  
**Key Content**:
- VITE_API_URL (backend URL)
- Comments explaining each variable

**Usage**: Copy to .env file and update values

### .gitignore
**Purpose**: Specifies files to ignore in git  
**Key Content**:
- node_modules/
- dist/
- .env
- .DS_Store
- *.log

**Usage**: Automatically applied by git

### setup.sh
**Purpose**: Quick setup script for Linux/Mac  
**Key Content**:
- Node.js version check
- npm install
- .env file creation
- Instructions

**Usage**: `bash setup.sh`

### setup.bat
**Purpose**: Quick setup script for Windows  
**Key Content**:
- Node.js version check
- npm install
- .env file creation
- Instructions

**Usage**: Double-click or `setup.bat`

---

## 📝 Main Application Files

### src/App.jsx
**Purpose**: Main application component with routing  
**Key Content**:
- BrowserRouter setup
- AuthProvider wrapper
- Navbar component
- Route definitions
  - Public: /, /login, /register
  - Protected: /dashboard
  - OAuth: /auth/github/callback
  - Role-based: /candidate/*, /recruiter/*
- 404 fallback

**Imports**: React Router, AuthProvider, PrivateRoute, Pages

### src/main.jsx
**Purpose**: React DOM entry point  
**Key Content**:
- React.StrictMode
- ReactDOM.createRoot()
- App component rendering
- index.css import

**Imports**: React, ReactDOM, App, styles

### src/index.css
**Purpose**: Global styles and Tailwind imports  
**Key Content**:
- Tailwind CSS directives (@tailwind)
- Global CSS reset
- Typography defaults
- Base styles

**Usage**: Automatically applied to all pages

---

## 🔐 Authentication & State Management

### src/contexts/AuthContext.jsx
**Purpose**: Global authentication state management  
**Key Content**:
- AuthContext creation
- AuthProvider component
- State variables:
  - user (object)
  - token (string)
  - loading (boolean)
  - error (string)
- Methods:
  - login(userData, token)
  - logout()
  - register(userData, token)
  - setAuthError(message)
  - clearError()
- useAuth() custom hook

**Usage**: Wrap App with `<AuthProvider>`; Use `useAuth()` in components

**Key Functions**:
```javascript
const { user, token, isAuthenticated, login, logout } = useAuth();
```

---

## 🌐 API Integration

### src/api/axios.js
**Purpose**: Configured Axios instance with JWT interceptor  
**Key Content**:
- Base URL configuration
- Default headers
- Request interceptor:
  - Adds Authorization header with JWT token
- Response interceptor:
  - Handles 401 errors
  - Redirects to login on token expiration
  - Clears localStorage

**Usage**: Import and use for all API calls

**Key Code**:
```javascript
const token = localStorage.getItem('token');
config.headers.Authorization = `Bearer ${token}`;
```

### src/api/config.js
**Purpose**: API configuration and error handling utilities  
**Key Content**:
- handleApiError() function
- Error message extraction
- Error status handling

**Usage**: Use for standardized error handling

### src/api/authService.js
**Purpose**: Authentication API functions  
**Key Content**:
- register(name, email, password, role)
- login(email, password)
- githubAuth()
- githubCallback(code, state)
- getCurrentUser()
- logout()

**Usage**: `import { authService } from '@/api/authService'`

**Example**:
```javascript
const response = await authService.login(email, password);
login(response.user, response.token);
```

### src/api/candidateService.js
**Purpose**: Candidate-related API functions  
**Key Content**:
- getProfile()
- updateProfile(data)
- getResume()
- uploadResume(file)
- getProjects()
- createProject(data)
- updateProject(id, data)
- deleteProject(id)
- getScoreCard()

**Usage**: `import { candidateService } from '@/api/candidateService'`

### src/api/recruiterService.js
**Purpose**: Recruiter-related API functions  
**Key Content**:
- getCandidates(filters)
- getCandidateDetail(id)
- addToShortlist(candidateId)
- removeFromShortlist(candidateId)
- getShortlist()
- sendNotification(candidateId, message)

**Usage**: `import { recruiterService } from '@/api/recruiterService'`

---

## 🎨 Components

### src/components/Navbar.jsx
**Purpose**: Navigation bar component  
**Key Content**:
- Logo "CredVerify"
- Navigation links
- Auth status display
- Conditional rendering:
  - Unauthenticated: Login/Sign up buttons
  - Authenticated: User info, Logout button
- Sticky positioning
- Responsive design

**Props**: None (uses useAuth hook)

**Exports**: Navbar component

### src/components/PrivateRoute.jsx
**Purpose**: Route protection wrapper component  
**Key Content**:
- PrivateRoute component:
  - Checks isAuthenticated
  - Checks user role
  - Loading state
  - Redirects to login if unauthorized
- PublicRoute component:
  - Redirects authenticated users to dashboard
  - Loading state

**Usage**:
```javascript
<PrivateRoute requiredRole="candidate">
  <CandidatePage />
</PrivateRoute>
```

### src/components/UI.jsx
**Purpose**: Reusable UI components  
**Key Content**:
- Card component (with shadow variants)
- Button component (with variants)
- Input component (with error support)
- Alert component (error, success, warning, info)
- Skeleton component (loading placeholders)

**Usage**: Import and use throughout app

**Example**:
```javascript
import { Card, Button, Input } from '@/components/UI';
```

---

## 📄 Pages

### src/pages/HomePage.jsx
**Purpose**: Landing/home page  
**Key Content**:
- Hero section with headline
- Features overview (3 cards)
- Call-to-action buttons
- Responsive grid layout

**Props**: None

**Uses**: useAuth hook for conditional rendering

### src/pages/LoginPage.jsx
**Purpose**: User login form page  
**Key Content**:
- Email input field
- Password input field
- Login button
- GitHub OAuth button
- Error message display
- Form validation
- Link to register page
- Soft UI design

**Props**: None

**Uses**: useAuth, useNavigate, authService

**Form Data**: email, password

### src/pages/RegisterPage.jsx
**Purpose**: User registration with role selection  
**Key Content**:
- Role selector (Candidate/Recruiter)
- Full name input
- Email input
- Password input
- Confirm password input
- Form validation
- GitHub OAuth button
- Error handling
- Link to login page
- Custom radio button UI

**Props**: None

**Uses**: useAuth, useNavigate, authService

**Form Data**: name, email, password, confirmPassword, role

### src/pages/DashboardPage.jsx
**Purpose**: User dashboard (role-specific)  
**Key Content**:
- Welcome message with user name
- Role badge display
- Conditional rendering based on role:
  - Candidate: Profile and Projects cards
  - Recruiter: Browse and Shortlist cards
- Quick action buttons

**Props**: None

**Uses**: useAuth hook

### src/pages/GitHubCallbackPage.jsx
**Purpose**: GitHub OAuth callback handler  
**Key Content**:
- URL parameter parsing (token, user, error)
- Error handling
- User login on success
- Redirect logic
- Loading indicator

**Props**: None

**Uses**: useAuth, useNavigate, useSearchParams

---

## 🎣 Custom Hooks

### src/hooks/useApiCall.js
**Purpose**: Reusable hook for API calls  
**Key Content**:
- execute() function for making API calls
- loading state
- error state
- data state
- reset() function
- Standardized error handling

**Usage**:
```javascript
const { data, loading, error, execute } = useApiCall();
const result = await execute(() => candidateService.getProfile());
```

---

## 📚 Documentation Files

### README.md
**Purpose**: Comprehensive project overview and documentation  
**Key Sections**:
- Features
- Tech stack
- Project structure
- Setup instructions
- API service functions
- Authentication flow
- Error handling
- Security considerations
- Contributing guidelines

### SETUP_GUIDE.md
**Purpose**: Detailed installation and testing guide  
**Key Sections**:
- Installation steps
- Environment configuration
- Testing procedures
- Backend integration checklist
- Common issues and solutions
- Build for production
- Deployment options

### QUICK_START.md
**Purpose**: 5-minute quick start guide  
**Key Sections**:
- Prerequisites
- 5-step quick setup
- Key features overview
- Project structure
- Troubleshooting
- Next steps
- Learning resources

### INTEGRATION_GUIDE.md
**Purpose**: Backend API integration documentation  
**Key Sections**:
- Authentication flow (registration, login, OAuth)
- API endpoints reference
- Backend requirements
- Service usage examples
- Common backend issues
- Testing with cURL/Postman
- Deployment considerations
- Troubleshooting checklist

### IMPLEMENTATION_CHECKLIST.md
**Purpose**: Feature implementation checklist  
**Key Sections**:
- Project setup checklist
- Authentication system checklist
- Routing & protection checklist
- Component checklist
- Pages checklist
- UI/UX checklist
- API integration checklist
- Testing checklist
- Deployment checklist
- Future enhancements

### FEATURES_ARCHITECTURE.md
**Purpose**: Detailed features and architecture documentation  
**Key Sections**:
- Core features
- RBAC details
- Responsive design info
- Smart routing details
- API integration details
- Architecture diagrams
- Component hierarchy
- State management
- Data flow
- Security features
- Performance optimizations
- Testing strategy
- Deployment info

### IMPLEMENTATION_SUMMARY.md
**Purpose**: Complete implementation status and summary  
**Key Sections**:
- Implementation status (✅ all complete)
- Files created (with purposes)
- Task completion details (all 4 tasks)
- Architecture implemented
- Features implemented
- UI/UX features
- Security features
- Documentation provided
- How to use
- Integration checklist
- Next steps

### DEVELOPER_REFERENCE.md
**Purpose**: Quick reference for developers  
**Key Sections**:
- Quick commands
- Key files & folders
- Authentication flow
- Component usage examples
- Tailwind CSS utilities
- Debugging tips
- Common tasks
- Response format expected
- Testing checklist
- Common issues & solutions
- API endpoints reference
- Tips & tricks
- Learning resources

---

## 🔗 File Relationships

```
App.jsx (Main Router)
├── AuthContext.jsx (Global State)
├── Navbar.jsx
├── PrivateRoute.jsx
└── Routes
    ├── HomePage.jsx
    ├── LoginPage.jsx
    │   └── authService.js
    ├── RegisterPage.jsx
    │   └── authService.js
    ├── DashboardPage.jsx
    └── GitHubCallbackPage.jsx

API Calls
├── axios.js (Interceptors)
├── authService.js
├── candidateService.js
└── recruiterService.js

Reusable
├── UI.jsx (Components)
└── useApiCall.js (Hook)

Configuration
├── vite.config.js
├── tailwind.config.js
├── package.json
└── .env
```

---

## 📊 File Statistics

| Category | Count |
|----------|-------|
| Configuration Files | 8 |
| Core App Files | 3 |
| Auth/State Files | 4 |
| Components | 3 |
| Pages | 5 |
| Hooks | 1 |
| API Services | 3 |
| Documentation | 9 |
| Setup Scripts | 2 |
| **Total** | **41** |

---

## 🚀 Getting Started

1. **Read**: QUICK_START.md (5 minutes)
2. **Setup**: Run `npm install` then `npm run dev`
3. **Reference**: DEVELOPER_REFERENCE.md for quick lookups
4. **Integrate**: Follow INTEGRATION_GUIDE.md for backend
5. **Deploy**: Follow instructions in SETUP_GUIDE.md

---

## ✨ File Highlights

### Most Important Files
1. **App.jsx** - Main routing and structure
2. **AuthContext.jsx** - Global authentication state
3. **axios.js** - API configuration and interceptors
4. **PrivateRoute.jsx** - Route protection

### Most Referenced Files
1. **useAuth.js** (from AuthContext.jsx)
2. **authService.js** - Used by Login/Register pages
3. **Navbar.jsx** - Used in every page

### First Files to Modify
1. **authService.js** - To add backend endpoints
2. **API services** - To add new API calls
3. **Pages** - To customize UI
4. **tailwind.config.js** - To customize styles

---

## 🔄 Typical Development Workflow

1. Edit component in `src/pages/` or `src/components/`
2. Vite hot reloads automatically
3. Test in browser at `http://localhost:3000`
4. Check console for errors
5. Update API service if needed
6. Update AuthContext if state changes needed
7. Commit changes to git

---

**For detailed information about any file, refer to the documentation mentioned in each section.**

**Happy Development! 🚀**
