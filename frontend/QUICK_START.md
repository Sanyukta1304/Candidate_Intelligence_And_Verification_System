# CredVerify Frontend - Quick Start Guide

Get up and running with the CredVerify frontend in 5 minutes!

## 📋 Prerequisites

- Node.js v16+ ([Download](https://nodejs.org/))
- Backend API running on `http://localhost:5000`
- Git

## 🚀 Quick Start (5 Minutes)

### Step 1: Navigate to Frontend Directory
```bash
cd frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

This installs React, Tailwind CSS, Axios, React Router, and all other dependencies.

### Step 3: Create Environment File
```bash
cp .env.example .env
```

The default API URL is already configured for local development.

### Step 4: Start Development Server
```bash
npm run dev
```

Open your browser to: **http://localhost:3000**

### Step 5: Test Authentication

1. **Register**: Click "Sign up" → Fill form → Select role → Submit
2. **Login**: Click "Log in" → Enter credentials → Submit
3. **Dashboard**: Should show role-specific dashboard after login
4. **Logout**: Click logout in navbar

✅ **You're Done!** The frontend is now running and ready to test.

---

## 🎯 Key Features at a Glance

### ✨ Authentication
- **Email/Password** registration and login
- **GitHub OAuth** integration
- **JWT Tokens** stored securely
- **Auto-redirect** based on auth status

### 🔐 Role-Based Access
- **Candidate** dashboard - Profile & Projects
- **Recruiter** dashboard - Browse & Shortlist
- Protected routes prevent unauthorized access

### 🎨 Modern UI
- **Soft UI** design with rounded cards
- **Responsive** layout (mobile, tablet, desktop)
- **Tailwind CSS** for consistent styling
- **Smooth animations** and transitions

### 📱 Smart Routing
- Public pages: Home, Login, Register
- Protected pages: Dashboard
- Role-specific pages: Candidate/Recruiter portals
- Auto logout on token expiration

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/              # API integration
│   ├── components/       # Reusable components
│   ├── contexts/         # Global state (Auth)
│   ├── pages/            # Page components
│   ├── App.jsx           # Main router
│   └── index.css         # Global styles
├── package.json
└── README.md
```

---

## 🔧 Troubleshooting

### "Cannot connect to API"
- ✅ Verify backend is running: `npm run dev` in `/backend`
- ✅ Check backend is on port 5000
- ✅ Verify CORS is enabled in backend

### "Token errors / 401"
- ✅ Clear localStorage: Open DevTools > Storage > Clear
- ✅ Try registering a new account
- ✅ Check backend JWT configuration

### "Styles not loading"
- ✅ Verify Tailwind is building: Check console for no errors
- ✅ Run `npm install` again
- ✅ Clear browser cache (Ctrl+Shift+Delete)

### "Routes not working"
- ✅ Verify you're not using old browser cache
- ✅ Check React Router is imported
- ✅ Verify route paths match components

---

## 📚 Next Steps

### Learn the Code
- Read [README.md](./README.md) for detailed overview
- Read [SETUP_GUIDE.md](./SETUP_GUIDE.md) for installation guide
- Read [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for API integration

### Customize the App
- Edit pages in `src/pages/`
- Customize styles in `tailwind.config.js`
- Add new API services in `src/api/`

### Deploy to Production
```bash
npm run build
```
Creates optimized build in `dist/` folder.

---

## 🎓 Learning Resources

### React Concepts Used
- Hooks (useState, useEffect, useContext)
- Context API for state management
- React Router for navigation
- Custom hooks (useAuth)

### Libraries
- **React Router v6** - Client-side routing
- **Axios** - HTTP requests
- **Tailwind CSS** - Styling
- **Vite** - Build tool

### Documentation
- [React Docs](https://react.dev)
- [React Router Docs](https://reactrouter.com)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Axios Docs](https://axios-http.com)

---

## 🛠️ Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install new package
npm install <package-name>

# Update dependencies
npm update
```

---

## 📖 File Purpose Guide

| File | Purpose |
|------|---------|
| `AuthContext.jsx` | Global user state management |
| `axios.js` | API client with JWT interceptor |
| `authService.js` | Authentication API functions |
| `PrivateRoute.jsx` | Protected route component |
| `Navbar.jsx` | Navigation header |
| `LoginPage.jsx` | Login form |
| `RegisterPage.jsx` | Registration form with role select |
| `DashboardPage.jsx` | Role-specific dashboard |
| `App.jsx` | Main app with routing |

---

## ✅ Checklist: Your First Features

After getting familiar with the codebase, try adding:

- [ ] Profile Edit page for candidates
- [ ] Project Management page
- [ ] Candidate Search page (recruiter)
- [ ] Shortlist page
- [ ] Notifications page
- [ ] Settings page
- [ ] Dark mode toggle
- [ ] Toast notifications
- [ ] Form validation library
- [ ] Loading skeletons

---

## 🤝 Need Help?

1. Check the [troubleshooting](#-troubleshooting) section
2. Read [SETUP_GUIDE.md](./SETUP_GUIDE.md)
3. Check backend logs for API errors
4. Review [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)

---

## 🎉 You're All Set!

Happy coding! The CredVerify frontend is ready for development.

**Frontend**: http://localhost:3000  
**Backend**: http://localhost:5000

For detailed setup, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)
