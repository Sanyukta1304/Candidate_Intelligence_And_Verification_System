# 🚀 Candidate Intelligence & Verification System (CredVerify)

---

## 📌 Project Overview
The **Candidate Intelligence & Verification System (CredVerify)** is a modern recruitment platform designed to replace traditional resume-based hiring with a **verified, data-driven evaluation system**.

Instead of relying on self-declared information, CIVS ensures that candidates are evaluated based on **real, verifiable work**, structured profiles, standardized scoring, and **real-time interactions**. This enables recruiters to make faster, more accurate, and unbiased hiring decisions.

---

## 🎯 Objective
The primary goal of this project is to:
- Eliminate unreliable resume-based screening  
- Introduce a **proof-based evaluation system** with semantic skill detection
- Provide a **standardized scoring mechanism** for candidates  
- Improve efficiency in recruitment workflows
- Enable **real-time notifications** for candidate interactions
- Track and display **profile activity** (views, stars) in real-time

---

## 💡 Concept
CredVerify is built on two core ideas:
1. **Verification over claims** → Skills must be proven through projects and resume content
2. **Structured evaluation** → Every candidate is scored using the same multi-dimensional criteria  
 

---

## ✨ Key Features

### 🎓 Advanced ATS Scoring System
- **Multi-dimensional scoring** combining resume, skills, and projects (0-100)
- **Semantic-based resume declaration detection** - extracts skills from actual resume content
- **Skill validation** - verifies skills against extracted resume content
- **Score breakdown** - resume (30%), skills (40%), projects (30%)
- **Formula**: (Project Usage × 0.5) + (Resume Declaration × 0.3) + (Skill Declaration × 0.2)



### 📊 Profile Activity Dashboard
- **Live profile views counter** - updates in real-time
- **Stars received counter** - displays all favorited interactions
- **Last scored timestamp** - shows when profile was last evaluated
- **Activity polling** - 5-second refresh interval for live data
- **Score breakdown visualization** - interactive progress bars for each metric

### 📄 Smart Resume Management
- **Single resume storage policy** - only latest resume is stored
- **Automatic cleanup** - old resumes deleted on new upload
- **Resume download** - both candidates and recruiters can download latest resume
- **Semantic text extraction** - extracts structured data from PDF and DOCX files
- **Extracted skills storage** - maintains list of skills found in resume

### 🔍 Enhanced Recruiter Features
- **Candidate search and filtering** by score, skills, and other criteria
- **Star/favorite candidates** for quick access
- **View detailed candidate profiles** with all scoring details
- **Resume download** functionality (latest version only)
- **Real-time activity feed** showing profile views and interactions
- **Dashboard statistics** with instant updates

### 👤 Candidate Self-Service
- **Real-time dashboard** with activity metrics
- **Notification center** with recruiter interactions
- **Profile management** with GitHub verification
- **Resume upload and download**
- **Project portfolio management**
- **Skills profile with semantic validation**

---

## 👥 User Roles

### 🧑‍💻 Candidate
- Creates and manages a professional profile  
- Verifies identity using GitHub (OAuth)
- Uploads resume and project work  
- Receives multi-dimensional credibility score
- Tracks **profile activity** (views, stars)
- Manages resume versions (single latest maintained)

### 🧑‍💼 Recruiter
- Searches and filters candidates by score and skills  
- Views **structured candidate profiles** with detailed scoring
- Receives **real-time updates** on viewed profiles  
- Stars/favorites candidates for later
- **Downloads latest resume** from candidate profiles
- Tracks interactions through **activity feed**
- Views comprehensive candidate evaluation data

---

## ⚙️ System Workflow

### Candidate Flow
1. Registration and login via email or GitHub OAuth
2. Profile creation with education and skills
3. GitHub verification and locking
4. Resume submission (single version, auto-cleanup on re-upload)
5. Project portfolio submission  
6. Automatic evaluation and scoring
7. **Real-time score generation and notification**
8. **Profile activity visibility** (views, stars, timestamps)

### Recruiter Flow
1. Login via email or OAuth
2. Dashboard with instant statistics
3. Candidate search with filters (score, skills)
4. View detailed profiles with full evaluation data
5. Star/favorite candidates
6. Download latest candidate resume
7. **Receive activity feed updates** in real-time
8. Track interaction history

---

## 📊 Evaluation Approach

### Scoring Breakdown
Candidates are evaluated using a **multi-dimensional scoring system**:

| Component | Weight | Range | Details |
|-----------|--------|-------|---------|
| **Resume Score (ATS)** | 30% | 0-30 | Resume structure, keywords, ATS compatibility |
| **Skills Score** | 40% | 0-40 | Project usage (50%) + Resume Declaration (30%) + Skill Declaration (20%) |
| **Projects Score** | 30% | 0-30 | Verified GitHub projects, code quality, contributions |
| **Total Score** | 100% | 0-100 | Final credibility score |

### Resume Declaration Detection
- **Semantic parsing** of full resume content
- **Context-aware skill detection** - finds skills in:
  - Work experience and employment history
  - Internships and entry-level positions
  - Projects and personal projects
  - Certifications and training
  - Technical profile/summary sections
- **Confidence scoring** (0-100) based on mention context
- **Multi-section validation** - skills mentioned in multiple sections score higher

### Skill Validation
- **Resume-backed validation** - skills must exist in actual resume content
- **Project verification** - cross-references with verified GitHub projects
- **Confidence scoring** - combines project usage, resume context, and declarations
- **Invalid skill handling** - skills not found in resume marked with validation status

---

## 🏗️ Technology Stack

### Frontend
- **React 18.2** - UI framework
- **Vite 5.0** - Build tooling
- **TailwindCSS 3.4** - Styling
- **React Router 6.20** - Routing and navigation
- **Axios 1.6** - HTTP client
- **Socket.IO Client 4.7** - Real-time communication ✨ NEW
- **React Circular Progressbar** - Data visualization

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Document database
- **Mongoose** - MongoDB ODM
- **Passport.js** - Authentication framework
- **Socket.IO 4.7** - Real-time communication server ✨ NEW
- **pdf-parse** - PDF text extraction
- **Mammoth** - DOCX text extraction
- **dotenv** - Environment configuration

### Authentication & Security
- **GitHub OAuth 2.0** - Social authentication
- **JWT Tokens** - Secure token-based authentication
- **Role-based access control** - Candidate and Recruiter roles
- **Password hashing** - Secure credential storage

### Real-Time Features
- **Socket.IO** - WebSocket-based real-time communication
- **Event-driven notifications** - Profile views and stars
- **Room-based messaging** - User-specific notification delivery
- **Auto-reconnection** - Robust connection management

### Data Processing
- **pdf-parse 1.1** - Extract text from PDF resumes
- **Mammoth 1.6** - Extract text from DOCX resumes
- **Semantic skill extraction** - Context-aware parsing
- **Score aggregation** - Multi-stage evaluation pipeline

---

## 📁 Project Structure (Detailed)

```
civs/
│
├── README.md # Project documentation and overview
├── .gitignore # Files and folders ignored by version control
├── .env.example # Sample environment configuration
│
├── backend/ # Server-side application
│ ├── server.js # Entry point with Socket.IO setup
│ ├── package.json # Backend dependencies and scripts
│ ├── .env # Environment variables (not committed)
│
│ ├── config/ # Configuration files
│ │ ├── db.js # Database connection setup
│ │ └── passport.js # GitHub OAuth configuration
│
│ ├── models/ # Data models
│ │ ├── User.js # User authentication data
│ │ ├── Candidate.js # Candidate profile (with extracted_skills) ✨
│ │ ├── Recruiter.js # Recruiter profile
│ │ ├── Project.js # Candidate projects
│ │ ├── ResumeScore.js # Resume evaluation data
│ │ └── Notifications.js # Real-time notification records ✨
│
│ ├── routes/ # API route definitions
│ │ ├── auth.routes.js # Authentication
│ │ ├── candidate.routes.js # Candidate endpoints (+ resume download) ✨
│ │ ├── recruiter.routes.js # Recruiter endpoints (+ resume download) ✨
│ │ ├── project.routes.js # Project management
│ │ ├── score.routes.js # Scoring endpoints
│ │ └── notification.routes.js # Notification endpoints ✨
│
│ ├── controllers/ # Request handlers
│ │ ├── auth.controller.js
│ │ ├── candidate.controller.js # Enhanced with resume management ✨
│ │ ├── recruiter.controller.js # Real-time notifications ✨
│ │ ├── project.controller.js
│ │ ├── score.controller.js
│ │ └── notification.controller.js # Real-time handlers ✨
│
│ ├── middleware/ # Middleware
│ │ ├── auth.js # JWT verification
│ │ ├── requireRole.js # Role-based access control
│ │ └── upload.js # Resume file handling
│
│ ├── services/ # Core business logic
│ │ ├── resumeSkillsExtractor.js # Semantic skill extraction ✨ NEW
│ │ ├── resumeScorer.js # Resume evaluation (ATS)
│ │ ├── skillsScorer.js # Skill scoring with validation ✨
│ │ ├── projectScorer.js # Project evaluation
│ │ ├── scoreOrchestrator.js # Score aggregation ✨
│ │ ├── githubVerifier.js # GitHub integration
│ │ └── notificationService.js # Real-time notifications ✨
│
│ ├── uploads/ # File storage
│ │ └── resumes/ # Latest resumes only (single per candidate) ✨
│
│ └── tests/ # Test cases
│ ├── auth.test.js
│ ├── candidate.test.js
│ ├── recruiter.test.js
│ └── scoring.test.js
│
├── frontend/ # Client-side application
│ ├── package.json # Dependencies (+ socket.io-client) ✨
│ ├── vite.config.js # Build configuration
│ ├── index.html # Entry HTML
│
│ └── src/ # Source code
│ ├── main.jsx # Entry point
│ ├── App.jsx # Router and layout
│
│ ├── api/ # API communication
│ │ ├── axios.js # HTTP client setup
│ │ ├── candidateService.js # Candidate endpoints
│ │ ├── recruiterService.js # Recruiter endpoints
│ │ └── config.js # API configuration
│
│ ├── contexts/ # Global state
│ │ └── AuthContext.jsx # Authentication state
│
│ ├── hooks/ # Custom hooks
│ │ ├── useApiCall.js # API calling utility
│ │ └── useSocketNotifications.js # Socket.IO real-time ✨ NEW
│
│ ├── components/ # Reusable components
│ │ ├── Navbar.jsx # Navigation
│ │ ├── PrivateRoute.jsx # Protected routes
│ │ ├── NotificationToast.jsx # Toast notifications ✨ NEW
│ │ ├── recruiter/ # Recruiter components
│ │ │ ├── RecruiterStats.jsx
│ │ │ ├── ActivityFeed.jsx # Real-time activity ✨
│ │ │ └── QuickLinks.jsx
│ │ └── candidate/ # Candidate components
│
│ ├── pages/ # Application pages
│ │ ├── LoginPage.jsx
│ │ ├── RegisterPage.jsx
│ │ ├── NotificationsPage.jsx # Real-time notifications ✨
│ │ ├── candidate/
│ │ │ └── CandidateDashboardPage.jsx # Real-time activity ✨
│ │ └── recruiter/
│ │ └── RecruiterDashboardPage.jsx # Real-time stats ✨
│
│ └── assets/ # Images and icons
│
└── scripts/ # Utility scripts
├── seedDatabase.js
└── cleanup.js
```

---

## 🛠️ Setup Instructions

### Prerequisites
- **Node.js 14+** - JavaScript runtime
- **MongoDB** - Database (local or Atlas)
- **GitHub OAuth App** - For GitHub verification
- **npm or yarn** - Package manager

### Installation Steps

#### 1. Clone Repository
```bash
git clone https://github.com/Deekshith1983/Candidate_Intelligence_And_Verification_System.git
cd Candidate_Intelligence_And_Verification_System
```

#### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URL, GitHub OAuth credentials, etc.
npm run dev
```

#### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

#### 4. Access Application
- **Frontend**: http://localhost:3000 (or Vite port)
- **Backend**: http://localhost:5000

---

## 🔌 Real-Time Features Configuration

### Socket.IO Setup
The system uses **Socket.IO** for real-time notifications:

1. **Backend** - `server.js` initializes Socket.IO server
2. **Frontend** - `useSocketNotifications.js` hook handles connections
3. **Notifications** - Auto-emitted when recruiters interact with profiles

### Testing Real-Time Features
1. Open candidate dashboard in one window
2. Use recruiter dashboard in another window
3. View or star a candidate profile

---

## 📊 Scoring System Details

### Resume Declaration Scoring (30%)
- **Semantic extraction** from resume sections
- **Context-aware detection** of skill mentions
- **Confidence scoring** (0-100):
  - Not found: 0
  - Found once, weak context: 30
  - Found once, good context: 60
  - Found multiple times: 90
  - Found in multiple sections: 100

### Skills Score (40%)
**Formula**: (Project Usage × 0.5) + (Resume Declaration × 0.3) + (Skill Declaration × 0.2)
- **Project Usage**: 0-100 based on verified GitHub projects
- **Resume Declaration**: Semantic detection from uploaded resume
- **Skill Declaration**: 100 for explicitly declared skills
- **Validation**: Skills must exist in extracted resume content

### Projects Score (30%)
- **Code quality**: Complexity, structure, documentation
- **Contributions**: Commits, pull requests, ownership percentage
- **Recency**: Last push date and activity level
- **Verification**: GitHub API validation

---

## 🔔 Notification System

### Real-Time Events
| Event | Trigger |
|-------|---------|
| **Profile Viewed** 👁️ | Recruiter visits candidate | 
| **Profile Starred** ⭐ | Recruiter favorites candidate | 


### Notification History
- **Database storage**: All notifications persisted
- **Mark as read**: Individual or bulk marking
- **Notification center**: Full history view in candidate dashboard

---

## 🔐 Security Features
- **JWT Authentication** - Secure token-based access
- **GitHub OAuth** - Verified identity integration
- **Role-based Access Control** - Separate candidate/recruiter views
- **Encrypted passwords** - bcrypt hashing
- **CORS enabled** - Cross-origin request handling
- **File validation** - Resume format checking (PDF, DOCX only)
- **Single resume storage** - No version conflicts or leaks

---

## 📈 Performance Features
- **Polling optimization** - 5-second intervals for live data
- **Socket.IO efficiency** - Room-based targeted notifications
- **Database indexing** - Optimized queries
- **File compression** - Efficient resume storage
- **Frontend caching** - Reduced API calls

---

## 🔮 Future Scope
- **AI-based candidate insights** - Predictive hiring analytics
- **Interview scheduling** - Integrated calendar system
- **Advanced analytics dashboard** - Detailed hiring metrics
- **Multi-platform verification** - LinkedIn, portfolio, etc.
- **Video interviews** - Built-in interview platform
- **Salary prediction** - Market-based compensation guidance
- **Batch operations** - Bulk candidate actions
- **Email notifications** - Optional email alerts alongside toasts

---

## 🤝 Contributing
Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License
This project is licensed under the MIT License - see LICENSE file for details

---

## 🏷️ Tagline
**From Resumes to Reality — Hire Based on Proof** ✨ **With Real-Time Insights**
