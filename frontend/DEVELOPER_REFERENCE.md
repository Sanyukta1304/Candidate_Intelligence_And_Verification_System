# CredVerify Frontend - Developer Quick Reference

## 🚀 Quick Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Key Files & Folders

```
src/
├── api/              # API integration
│   ├── axios.js      # Configured axios instance
│   ├── authService.js
│   └── ...
├── components/       # Reusable components
├── contexts/         # Global state (AuthContext)
├── pages/            # Page components
├── hooks/            # Custom hooks
└── App.jsx           # Main app router

tailwind.config.js    # Tailwind customization
vite.config.js        # Vite configuration
.env                  # Environment variables
```

## 🔐 Authentication Flow

```
Login/Register Form
    ↓
authService.login/register()
    ↓
API POST request
    ↓
Backend validation
    ↓
JWT token returned
    ↓
useAuth().login() stores token
    ↓
localStorage updated
    ↓
Redirect to /dashboard
```

## 🎯 Component Usage

### Use useAuth Hook
```javascript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, token, isAuthenticated, logout } = useAuth();
  
  return (
    <div>
      {isAuthenticated && <p>Hello {user.name}</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Use PrivateRoute
```javascript
import { PrivateRoute } from '@/components/PrivateRoute';

<PrivateRoute requiredRole="candidate">
  <CandidatePage />
</PrivateRoute>
```

### Use API Services
```javascript
import { candidateService } from '@/api/candidateService';

// Token automatically added by axios interceptor
const profile = await candidateService.getProfile();
```

## 🎨 Tailwind CSS Utilities

```javascript
// Colors
className="text-primary-dark"      // #2D333F
className="bg-primary-light"       // #F5F7FA
className="border-slate-200"       // Subtle borders

// Spacing
className="p-6"                    // Padding
className="mb-4"                   // Margin bottom
className="gap-4"                  // Gap between items

// Sizing
className="w-full"                 // Full width
className="max-w-md"               // Max width

// Layout
className="flex items-center"      // Flexbox
className="grid md:grid-cols-2"    // Grid responsive

// Typography
className="text-lg font-semibold"  // Font size & weight
className="text-slate-600"         // Text color

// Effects
className="rounded-xl"             // Border radius
className="shadow-soft"            // Custom shadow
className="hover:bg-slate-800"     // Hover state
```

## 🔍 Debugging

### Check localStorage
```javascript
// Browser DevTools > Application > Local Storage
localStorage.getItem('token')
localStorage.getItem('user')
```

### Check Network Requests
```javascript
// Browser DevTools > Network tab
// Look for Authorization header: Bearer <token>
```

### Check Component State
```javascript
// Use React DevTools browser extension
// or console.log in components
```

## 🛠️ Common Tasks

### Add New Page
1. Create file in `src/pages/NewPage.jsx`
2. Add route in `App.jsx`
3. Use `PrivateRoute` if protected

### Add New API Service
1. Create `src/api/newService.js`
2. Import `axiosInstance`
3. Export functions that call API

### Add New Component
1. Create file in `src/components/NewComponent.jsx`
2. Export as named export
3. Import in pages/components

### Style a Component
1. Use Tailwind classes
2. Custom styles in `index.css` if needed
3. Reference `tailwind.config.js` for custom values

## 📊 Response Format Expected

### Login/Register Response
```json
{
  "user": {
    "_id": "id",
    "name": "Name",
    "email": "email@example.com",
    "role": "candidate" | "recruiter"
  },
  "token": "jwt_token_here"
}
```

### API Error Response
```json
{
  "message": "Error description",
  "status": 400
}
```

## 🔗 Environment Variables

```
VITE_API_URL=http://localhost:5000
```

## ✅ Testing Checklist

- [ ] Can register with email/password
- [ ] Can login with credentials
- [ ] Token stored in localStorage
- [ ] Can access protected routes
- [ ] Cannot access wrong role routes
- [ ] Logout clears token
- [ ] Refresh page maintains auth
- [ ] 401 redirects to login
- [ ] GitHub OAuth works
- [ ] Responsive design works

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| README.md | Overview |
| QUICK_START.md | 5-min setup |
| SETUP_GUIDE.md | Detailed setup |
| INTEGRATION_GUIDE.md | API integration |
| FEATURES_ARCHITECTURE.md | Features |
| IMPLEMENTATION_CHECKLIST.md | Checklist |
| IMPLEMENTATION_SUMMARY.md | Summary |

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| Cannot connect to API | Check backend running on :5000 |
| 401 errors | Clear localStorage, re-login |
| Routes not working | Check React Router config |
| Styles not loading | Rebuild Tailwind CSS |
| GitHub OAuth fails | Check OAuth credentials |
| Components not rendering | Check console for errors |

## 🌐 API Endpoints Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/github | GitHub OAuth |
| GET | /api/auth/me | Current user |
| POST | /api/auth/logout | Logout |

## 💡 Tips & Tricks

- Use browser DevTools for debugging
- Check console for error messages
- Use Network tab to verify API calls
- Use React DevTools browser extension
- Use `console.log()` for debugging
- Read error messages carefully

## 🎓 Learning Resources

- [React Docs](https://react.dev)
- [React Router Docs](https://reactrouter.com)
- [Tailwind Docs](https://tailwindcss.com)
- [Axios Docs](https://axios-http.com)

## 📞 Quick Help

**Backend not working?**
```bash
cd backend
npm install
npm run dev
```

**Frontend not starting?**
```bash
npm install
npm run dev
```

**Clear cache?**
```
Ctrl+Shift+Delete (Chrome/Edge)
Cmd+Shift+Delete (Mac)
```

**Kill port 3000?**
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows (PowerShell as Admin)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

**Happy Coding! 🚀**
