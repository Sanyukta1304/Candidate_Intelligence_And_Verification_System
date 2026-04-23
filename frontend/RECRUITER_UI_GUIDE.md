# Recruiter UI Implementation Guide

## Overview

Complete recruiter-side interface for CredVerify with React.js and Tailwind CSS. This guide covers all components, pages, and API integrations.

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── recruiter/
│   │       ├── RecruiterStats.jsx      # 4-column stats grid
│   │       ├── ActivityFeed.jsx        # Recent activity list
│   │       ├── QuickLinks.jsx          # Quick action cards
│   │       ├── FilterBar.jsx           # Search filters
│   │       ├── ResultsTable.jsx        # Search results table
│   │       ├── CandidateCard.jsx       # Candidate grid card
│   │       └── index.js                # Barrel exports
│   └── pages/
│       └── recruiter/
│           ├── RecruiterDashboardPage.jsx    # Main dashboard
│           ├── TalentSearchPage.jsx          # Search & filtering
│           ├── StarredCandidatesPage.jsx     # Saved candidates
│           ├── RecruiterProfilePage.jsx      # Company profile
│           └── RecruiterCandidateViewPage.jsx # Candidate details
├── App.jsx                              # Updated with recruiter routes
├── tailwind.config.js                  # Updated with badge colors
```

---

## 🛣️ Routes

### Recruiter Routes
| Route | Component | Description |
|-------|-----------|-------------|
| `/recruiter/dashboard` | RecruiterDashboardPage | Main dashboard with stats, activity, and quick links |
| `/recruiter/search` | TalentSearchPage | Search and filter candidates |
| `/recruiter/starred` | StarredCandidatesPage | Grid view of saved candidates |
| `/recruiter/profile` | RecruiterProfilePage | Manage company profile |
| `/recruiter/candidate/:candidateId` | RecruiterCandidateViewPage | Detailed candidate view |

---

## 🧩 Components

### 1. **RecruiterStats**
Displays 4-column grid with key metrics.

**Props:**
- `profilesViewed` (number) - Count of viewed profiles
- `profilesStarred` (number) - Count of starred candidates
- `totalCandidates` (number) - Total candidates in pool
- `githubVerified` (number) - GitHub verified candidates
- `loading` (boolean) - Loading state

**Usage:**
```jsx
<RecruiterStats
  profilesViewed={100}
  profilesStarred={25}
  totalCandidates={500}
  githubVerified={45}
  loading={false}
/>
```

---

### 2. **ActivityFeed**
Displays recent recruiter activities with timestamps.

**Props:**
- `activities` (array) - Activity objects with `candidateName`, `action`, `timestamp`
- `loading` (boolean) - Loading state

**Activity Object Format:**
```js
{
  candidateName: "John Doe",
  action: "profile viewed",
  timestamp: "2024-04-22T10:30:00Z"
}
```

**Usage:**
```jsx
<ActivityFeed
  activities={activities}
  loading={false}
/>
```

---

### 3. **QuickLinks**
Quick action cards for common tasks.

**No props required** - Static links to:
- Search Candidates → `/recruiter/search`
- Starred Candidates → `/recruiter/starred`
- Company Profile → `/recruiter/profile`

**Usage:**
```jsx
<QuickLinks />
```

---

### 4. **FilterBar**
Search filters with role categories, score range slider, and top-only checkbox.

**Props:**
- `selectedRoles` (array) - Selected role filters
- `minScore` (number) - Minimum score threshold
- `maxScore` (number) - Maximum score (fixed at 100)
- `topOnly` (boolean) - Filter top 10 candidates only
- `onRoleChange` (function) - Callback when roles change
- `onMinScoreChange` (function) - Callback when score changes
- `onMaxScoreChange` (function) - Callback for max score
- `onTopOnlyChange` (function) - Callback for top-only toggle
- `onReset` (function) - Reset all filters

**Available Roles:**
- Full Stack, Frontend, Backend, Data Analyst, DevOps, Product Manager, Design

**Usage:**
```jsx
<FilterBar
  selectedRoles={selectedRoles}
  minScore={minScore}
  topOnly={topOnly}
  onRoleChange={handleRoleChange}
  onMinScoreChange={handleMinScoreChange}
  onTopOnlyChange={handleTopOnlyChange}
  onReset={handleReset}
/>
```

---

### 5. **ResultsTable**
Search results in table format.

**Props:**
- `candidates` (array) - Candidate objects with name, score, tier, topSkills
- `loading` (boolean) - Loading state
- `onView` (function) - Callback when viewing candidate

**Candidate Object Format:**
```js
{
  _id: "candidate123",
  name: "Jane Smith",
  university: "Stanford University",
  score: 85,
  tier: "High Potential",
  topSkills: ["React", "Node.js", "MongoDB"]
}
```

**Table Columns:**
- Name (with avatar)
- Score (blue progress bar)
- Tier (badge)
- Top Skills (tags)
- View Button

**Usage:**
```jsx
<ResultsTable
  candidates={candidates}
  loading={false}
  onView={handleView}
/>
```

---

### 6. **CandidateCard**
Grid card for starred candidates.

**Props:**
- `candidate` (object) - Candidate data
- `isStarred` (boolean) - Star status
- `onStarToggle` (function) - Handle star toggle
- `loading` (boolean) - Loading state

**Card Elements:**
- Star icon (top-right) - Toggle to unstar
- Circular avatar with initials
- Name and university
- Credibility Score with progress bar
- Potential Tier badge
- Top Skills tags (max 4)
- View Profile button

**Usage:**
```jsx
<CandidateCard
  candidate={candidate}
  isStarred={true}
  onStarToggle={handleStarToggle}
/>
```

---

## 📄 Pages

### 1. **RecruiterDashboardPage**
Main recruiter dashboard.

**Features:**
- 4-column stats widget
- Recent activity feed (vertical list)
- Quick action links
- Parallel loading of stats and activities

**API Endpoints Used:**
- `GET /api/recruiter/stats`
- `GET /api/recruiter/activity?limit=10`

---

### 2. **TalentSearchPage**
Search and filter candidates.

**Features:**
- Search bar (by name, skills, university)
- Dynamic filter bar with:
  - Role pill buttons
  - Min score slider
  - Top 10 checkbox
- Results table with instant filtering
- Shows candidate count

**API Endpoints Used:**
- `GET /api/recruiter/candidates?{filters}`

**Filters Parameter:**
```js
{
  roles: ["Full Stack", "Frontend"],
  minScore: 50,
  topOnly: false,
  search: "React"
}
```

---

### 3. **StarredCandidatesPage**
Grid view of saved candidates.

**Features:**
- 3-column responsive grid
- Each card shows full candidate info
- Star button to unstar/remove
- Empty state with helpful message
- Candidate count summary

**API Endpoints Used:**
- `GET /api/recruiter/starred`
- `DELETE /api/recruiter/star/:candidateId`

---

### 4. **RecruiterProfilePage**
Manage recruiter/company information.

**Features:**
- View mode by default
- Edit mode on "Edit Profile" button
- Fields:
  - Recruiter Name
  - Email
  - Company Name
  - Position
  - Address
  - About the Company (textarea)
- Save and Cancel buttons in edit mode

**API Endpoints Used:**
- `GET /api/recruiter/profile`
- `PUT /api/recruiter/profile`

---

### 5. **RecruiterCandidateViewPage**
Detailed read-only candidate view.

**Features:**
- Large avatar with initials
- Name, university, tier
- Score breakdown chart (if available)
- Top skills section
- Projects section with technologies
- Contact email
- Star toggle button (top-right)
- Back navigation

**API Endpoints Used:**
- `GET /api/recruiter/candidates/:candidateId`
- `POST /api/recruiter/star/:candidateId`
- `DELETE /api/recruiter/star/:candidateId`

---

## 🔌 API Integration

### Service: `recruiterService`

**Location:** `src/api/recruiterService.js`

**Available Methods:**

```js
// Dashboard
recruiterService.getStats()
recruiterService.getActivity(limit)

// Search & Discovery
recruiterService.getCandidates(filters)
recruiterService.getCandidateDetail(candidateId)
recruiterService.getStarredCandidates(filters)

// Star/Favorites
recruiterService.starCandidate(candidateId)
recruiterService.unstarCandidate(candidateId)

// Profile
recruiterService.getProfile()
recruiterService.updateProfile(profileData)
```

---

## 🎨 Design System

### Colors
- **Primary Dark:** `#2D333F`
- **Primary Light:** `#F5F7FA`
- **Background:** `#F9FAFB` (light gray)
- **Cards:** White with `border-slate-200`

### Badge Tiers
| Tier | Background | Text | Usage |
|------|-----------|------|-------|
| High Potential | `bg-emerald-100` | `text-emerald-800` | Top candidates |
| Moderate | `bg-orange-100` | `text-orange-800` | Mid-tier candidates |
| Entry Level | `bg-blue-100` | `text-blue-800` | Junior candidates |
| Specialist | `bg-purple-100` | `text-purple-800` | Specialized skills |

### Typography
- **Page Titles:** 3xl, bold, primary-dark
- **Section Headers:** lg, semibold, primary-dark
- **Labels:** sm, medium, slate-700
- **Body:** base, slate-700
- **Small:** xs, slate-600

### Spacing
- **Container:** `max-w-7xl`, `px-4 sm:px-6 lg:px-8`
- **Vertical Spacing:** `py-8` for pages
- **Cards:** `rounded-xl`, `p-6`

### Shadows
- **Card Default:** `shadow-soft` (light)
- **Card Hover:** `shadow-soft-lg` (medium)

---

## 🚀 How to Use

### Installation

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

4. Navigate to recruiter pages:
   - Dashboard: `http://localhost:5173/recruiter/dashboard`
   - Search: `http://localhost:5173/recruiter/search`
   - Starred: `http://localhost:5173/recruiter/starred`
   - Profile: `http://localhost:5173/recruiter/profile`

### Backend Requirements

Ensure the backend has these endpoints implemented:

1. **GET /api/recruiter/stats**
   - Returns: `{ profilesViewed, profilesStarred, totalCandidates, githubVerified }`

2. **GET /api/recruiter/activity?limit=10**
   - Returns: `[{ candidateName, action, timestamp }, ...]`

3. **GET /api/recruiter/candidates?{filters}**
   - Returns: `[{ _id, name, university, score, tier, topSkills }, ...]`

4. **GET /api/recruiter/candidates/:id**
   - Returns: `{ _id, name, university, score, tier, topSkills, scoreBreakdown, projects, email }`

5. **GET /api/recruiter/starred**
   - Returns: `[{ _id, name, university, score, tier, topSkills }, ...]`

6. **POST /api/recruiter/star/:id**
   - Returns: `{ success: true }`

7. **DELETE /api/recruiter/star/:id**
   - Returns: `{ success: true }`

8. **GET /api/recruiter/profile**
   - Returns: `{ name, email, company, position, address, aboutCompany }`

9. **PUT /api/recruiter/profile**
   - Payload: `{ name, email, company, position, address, aboutCompany }`
   - Returns: `{ success: true, data: {...} }`

---

## 📊 State Management

All pages use React hooks:
- `useState` for component state
- `useEffect` for data fetching
- `useAuth` from AuthContext for authentication
- `useNavigate` from React Router for navigation

### Example State Pattern:
```jsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  loadData();
}, [isAuthenticated]);

const loadData = async () => {
  try {
    setLoading(true);
    const response = await recruiterService.getData();
    setData(response?.data || response);
  } catch (err) {
    setError('Error loading data');
  } finally {
    setLoading(false);
  }
};
```

---

## 🔒 Authentication

All recruiter pages check:
1. `isAuthenticated` - User is logged in
2. `user?.role === 'recruiter'` - User is a recruiter

If not authenticated or wrong role, access is denied with a message.

---

## ✅ Testing Checklist

- [ ] Dashboard loads stats and activities
- [ ] Search page filters work (roles, score, top-only)
- [ ] Search results display correctly
- [ ] Starring/unstarring candidates works
- [ ] Starred candidates page shows grid view
- [ ] Profile page loads and saves changes
- [ ] Candidate detail view displays all information
- [ ] Navbar shows role-specific links
- [ ] Navigation between pages works

---

## 📝 Notes

- All components use Tailwind CSS for styling
- No external UI library dependencies (only React, React Router, Axios)
- Responsive design: mobile-first approach
- Loading skeletons for better UX
- Error handling with user-friendly messages
- Success notifications on profile update

---
