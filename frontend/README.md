# CredVerify Frontend

A modern React.js frontend for the CredVerify platform - an intelligent candidate verification and assessment system.

## Features

- **Authentication System**: JWT-based authentication with localStorage persistence
- **OAuth Integration**: GitHub OAuth support for seamless registration/login
- **Role-Based Access Control**: Separate dashboards for Candidates and Recruiters
- **Responsive Design**: Built with Tailwind CSS for a professional, responsive UI
- **Protected Routes**: Role-based route protection with automatic redirects
- **Axios Interceptors**: Automatic JWT token injection and error handling

## Tech Stack

- **React 18** - UI framework
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Vite** - Build tool and development server

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   ├── axios.js          # Configured axios instance with interceptors
│   │   ├── authService.js    # Auth API functions
│   │   ├── candidate.api.js  # Candidate API functions
│   │   └── score.api.js      # Scoring API functions
│   ├── components/
│   │   ├── Navbar.jsx        # Navigation bar
│   │   └── PrivateRoute.jsx  # Protected route wrapper
│   ├── contexts/
│   │   └── AuthContext.jsx   # Global auth state management
│   ├── pages/
│   │   ├── HomePage.jsx      # Landing page
│   │   ├── LoginPage.jsx     # Login page
│   │   ├── RegisterPage.jsx  # Registration page
│   │   └── DashboardPage.jsx # User dashboard
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # React entry point
│   └── index.css             # Global styles
├── index.html                # HTML template
├── package.json              # Dependencies
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind configuration
└── postcss.config.js         # PostCSS configuration
```

## Setup & Installation

### Prerequisites

- Node.js v16+ and npm v8+
- Backend API running on http://localhost:5000

### Installation Steps

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

4. **Configure API URL** (optional, defaults to http://localhost:5000):
   ```
   VITE_API_URL=http://localhost:5000
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:3000`

## Development

### Running the Development Server

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm preview
```

## Key Components & Files

### AuthContext.jsx
Global state management for authentication:
- Manages user data and JWT token
- Persists authentication to localStorage
- Provides login/logout/register functions
- Exposes `useAuth()` hook for component access

### axios.js
Configured Axios instance with:
- Base URL configuration
- Request interceptor: Automatically adds JWT token
- Response interceptor: Handles 401 errors and redirects to login

### PrivateRoute.jsx
Route protection component:
- **PrivateRoute**: Checks for valid JWT and role
- **PublicRoute**: Redirects authenticated users to dashboard

### API Service Functions (authService.js)

#### Register
```javascript
authService.register(name, email, password, role)
// POST /api/auth/register
```

#### Login
```javascript
authService.login(email, password)
// POST /api/auth/login
```

#### GitHub OAuth
```javascript
authService.githubAuth()
// GET /api/auth/github (redirects to GitHub)

authService.githubCallback(code, state)
// POST /api/auth/github/callback
```

#### Get Current User
```javascript
authService.getCurrentUser()
// GET /api/auth/me
```

#### Logout
```javascript
authService.logout()
// POST /api/auth/logout
```

## Pages Overview

### HomePage
- Landing page with features overview
- Quick access to login/register for unauthenticated users
- Hero section with call-to-action

### LoginPage
- Email/password login form
- GitHub OAuth integration
- Form validation and error handling
- Link to registration page

### RegisterPage
- Role selection (Candidate vs Recruiter)
- Full registration form
- Password confirmation
- GitHub OAuth option
- Link to login page

### DashboardPage
- Role-specific dashboard
- Quick action buttons
- Role-based content rendering

## Authentication Flow

1. **Registration**:
   ```
   User inputs details → Register page → authService.register() 
   → Backend validates & creates account → JWT token returned 
   → Token stored in localStorage → AuthContext updated 
   → Redirected to dashboard
   ```

2. **Login**:
   ```
   User enters credentials → Login page → authService.login() 
   → Backend validates credentials → JWT token returned 
   → Token stored in localStorage → AuthContext updated 
   → Redirected to dashboard
   ```

3. **GitHub OAuth**:
   ```
   User clicks GitHub button → Redirected to GitHub auth 
   → User authorizes → Callback to backend 
   → Backend exchanges code for token → JWT returned 
   → User created/logged in → Redirected to dashboard
   ```

4. **Protected Access**:
   ```
   User navigates to protected route → PrivateRoute checks JWT 
   → If valid, render component; if invalid, redirect to login 
   → Axios interceptor automatically adds token to all requests
   ```

## Styling

### Tailwind Configuration

The project includes a custom Tailwind configuration with:

- **Custom Colors**:
  - `primary-dark`: #2D333F (dark button, headings)
  - `primary-light`: #F5F7FA (backgrounds, accents)
  - Extended slate palette

- **Custom Shadows**:
  - `shadow-soft`: Subtle shadow for cards
  - `shadow-soft-lg`: Larger shadow for hover states

### Style Guidelines

- Use `bg-primary-dark` for primary buttons
- Use `rounded-xl` for main container corners
- Use `border-slate-200` for subtle borders
- Use `shadow-soft` for card styling

## Error Handling

- Form validation on client side
- API errors displayed to user
- Invalid tokens automatically clear localStorage
- 401 errors redirect to login
- User-friendly error messages

## Security Considerations

- JWT tokens stored in localStorage (consider using httpOnly cookies for production)
- Automatic token injection via Axios interceptor
- Protected routes prevent unauthorized access
- Role-based access control enforced
- CORS configured to accept backend requests

## Next Steps & Customization

### Add Additional Pages
- Edit Profile page
- Project Management page
- Candidate Search page (Recruiter)
- Shortlist Management page

### Extend API Services
- Add candidate profile API
- Add project API
- Add search/filter API

### Add Features
- Toast notifications
- Loading states
- Form validation
- Image uploads
- Real-time updates

## Troubleshooting

### API Connection Issues
- Verify backend is running on http://localhost:5000
- Check CORS settings in backend
- Verify VITE_API_URL environment variable

### Token Not Persisting
- Check browser localStorage
- Verify token is being returned from backend
- Check for 401 errors in console

### Routing Issues
- Ensure PrivateRoute wraps protected components
- Check role values match backend (lowercase)
- Verify redirects in useEffect dependencies

## Contributing

1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes and test thoroughly
3. Commit with clear messages: `git commit -m "feat: add feature"`
4. Push to branch: `git push origin feature/feature-name`
5. Create Pull Request

## License

ISC
