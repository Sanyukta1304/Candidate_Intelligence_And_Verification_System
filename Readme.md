# 🚀 Candidate Intelligence & Verification System (CIVS)

---

## 📌 Project Overview
The **Candidate Intelligence & Verification System (CIVS)** is a modern recruitment platform designed to replace traditional resume-based hiring with a **verified, data-driven evaluation system**.

Instead of relying on self-declared information, CIVS ensures that candidates are evaluated based on **real, verifiable work**, structured profiles, and standardized scoring. This enables recruiters to make faster, more accurate, and unbiased hiring decisions.

---

## 🎯 Objective
The primary goal of this project is to:
- Eliminate unreliable resume-based screening  
- Introduce a **proof-based evaluation system**  
- Provide a **standardized scoring mechanism** for candidates  
- Improve efficiency in recruitment workflows  

---

## 💡 Concept
CIVS is built on three core ideas:
1. **Verification over claims** → Skills must be proven through projects  
2. **Structured evaluation** → Every candidate is scored using the same criteria  
3. **Role-based interaction** → Separate experiences for candidates and recruiters  

---

## 👥 User Roles

### 🧑‍💻 Candidate
- Creates and manages a professional profile  
- Verifies identity using GitHub  
- Uploads resume and project work  
- Receives a credibility score  

---

### 🧑‍💼 Recruiter
- Searches and filters candidates  
- Views structured candidate profiles  
- Tracks interactions  
- Shortlists candidates  

---

## ⚙️ System Workflow

### Candidate Flow
1. Registration and login  
2. Profile creation  
3. Identity verification  
4. Resume submission  
5. Project submission  
6. Automated evaluation  
7. Score generation  

---

### Recruiter Flow
1. Login  
2. Candidate search  
3. Apply filters  
4. View detailed profiles  
5. Shortlist candidates  

---

## 📊 Evaluation Approach
Candidates are evaluated using a **multi-dimensional scoring system** that considers:
- Profile completeness  
- Demonstrated skills  
- Verified project contributions  
- Consistency and quality of information  

This ensures fairness and comparability across all candidates.

---

## 🏗️ Technology Stack

### Frontend
- Responsible for user interface and experience  
- Provides dashboards, forms, and visualizations  

### Backend
- Handles application logic and data processing  
- Manages authentication, scoring, and APIs  

### Database
- Stores user data, profiles, projects, and scores  
- Ensures structured and scalable data management  

### Authentication
- Secure login system with role-based access  
- External verification for identity validation  

### Realtime Communication
- Enables instant updates for user interactions  

---

## 📁 Project Structure (Detailed)
```
civs/
│
├── README.md # Project documentation and overview
├── .gitignore # Files and folders ignored by version control
├── .env.example # Sample environment configuration
│
├── docs/ # Project documentation files
│ ├── architecture.png # System architecture diagram
│ ├── scoring.md # Explanation of scoring approach
│ └── api.md # API reference documentation
│
├── backend/ # Server-side application
│ ├── server.js # Entry point of backend application
│ ├── package.json # Backend dependencies and scripts
│ ├── .env # Environment variables (not committed)
│
│ ├── config/ # Configuration files
│ │ ├── db.js # Database connection setup
│ │ └── passport.js # Authentication configuration
│
│ ├── models/ # Data models (database structure)
│ │ ├── User.js # User identity and authentication data
│ │ ├── Candidate.js # Candidate profile data
│ │ ├── Recruiter.js # Recruiter profile data
│ │ ├── Project.js # Candidate project information
│ │ ├── ResumeScore.js # Resume evaluation data
│ │ └── Notification.js # Notification records
│
│ ├── routes/ # API route definitions
│ │ ├── auth.routes.js # Authentication routes
│ │ ├── candidate.routes.js # Candidate-related routes
│ │ ├── recruiter.routes.js # Recruiter-related routes
│ │ ├── project.routes.js # Project management routes
│ │ ├── score.routes.js # Scoring system routes
│ │ └── notification.routes.js # Notification routes
│
│ ├── controllers/ # Request handling logic
│ │ ├── auth.controller.js
│ │ ├── candidate.controller.js
│ │ ├── recruiter.controller.js
│ │ ├── project.controller.js
│ │ ├── score.controller.js
│ │ └── notification.controller.js
│
│ ├── middleware/ # Middleware functions
│ │ ├── auth.js # Authentication verification
│ │ ├── requireRole.js # Role-based access control
│ │ └── upload.js # File handling
│
│ ├── services/ # Core business logic
│ │ ├── resumeScorer.js # Resume evaluation logic
│ │ ├── skillsScorer.js # Skill evaluation logic
│ │ ├── projectScorer.js # Project evaluation logic
│ │ ├── githubVerifier.js # External verification integration
│ │ ├── scoreOrchestrator.js # Final score aggregation
│ │ └── notificationService.js # Notification handling
│
│ ├── sockets/ # Real-time communication setup
│ │ └── socket.js
│
│ ├── utils/ # Utility/helper functions
│ │ ├── parser.js
│ │ ├── validators.js
│ │ └── constants.js
│
│ ├── uploads/ # Uploaded files storage
│ │ └── resumes/
│
│ └── tests/ # Backend test cases
│ ├── auth.test.js
│ ├── candidate.test.js
│ ├── recruiter.test.js
│ └── scoring.test.js
│
├── frontend/ # Client-side application
│ ├── package.json # Frontend dependencies
│ ├── vite.config.js # Build configuration
│ ├── index.html # Entry HTML file
│
│ ├── public/ # Static assets
│ │ └── assets/
│ │ ├── logo.png
│ │ └── icons/
│
│ └── src/ # Source code
│ ├── main.jsx # Entry point of frontend
│ ├── App.jsx # Routing and layout setup
│
│ ├── api/ # API communication layer
│ │ ├── axiosInstance.js
│ │ ├── auth.api.js
│ │ ├── candidate.api.js
│ │ ├── recruiter.api.js
│ │ └── score.api.js
│
│ ├── context/ # Global state management
│ │ ├── AuthContext.jsx
│ │ └── NotificationContext.jsx
│
│ ├── components/ # Reusable UI components
│ │ ├── Navbar.jsx
│ │ ├── PrivateRoute.jsx
│ │ ├── ScoreBar.jsx
│ │ ├── SkillTag.jsx
│ │ ├── NotificationBell.jsx
│ │ ├── ProjectCard.jsx
│ │ ├── CandidateRow.jsx
│ │ └── Modal.jsx
│
│ ├── pages/ # Application pages
│ │ ├── LandingPage.jsx
│ │ ├── LoginPage.jsx
│ │ ├── RegisterPage.jsx
│ │ ├── AboutPage.jsx
│ │ ├── GitHubCallback.jsx
│ │
│ │ ├── candidate/ # Candidate-specific pages
│ │ │ ├── CandidateDashboard.jsx
│ │ │ ├── CandidateProfile.jsx
│ │ │ ├── NotificationsPage.jsx
│ │ │ ├── ProfileEditPage.jsx
│ │ │
│ │ │ ├── tabs/
│ │ │ │ ├── DetailsTab.jsx
│ │ │ │ ├── ResumeTab.jsx
│ │ │ │ └── ProjectsTab.jsx
│ │ │
│ │ │ └── modals/
│ │ │ └── AddProjectModal.jsx
│ │
│ │ └── recruiter/ # Recruiter-specific pages
│ │ ├── RecruiterDashboard.jsx
│ │ ├── SearchSection.jsx
│ │ ├── StarredSection.jsx
│ │ └── RecruiterProfile.jsx
│
│ ├── hooks/ # Custom reusable hooks
│ │ ├── useAuth.js
│ │ └── useNotifications.js
│
│ ├── utils/ # Helper utilities
│ │ ├── scoreUtils.js
│ │ ├── dateUtils.js
│ │ └── helpers.js
│
│ ├── styles/ # Styling files
│ │ ├── global.css
│ │ └── variables.css
│
│ └── assets/ # Images and icons
│ ├── images/
│ └── icons/
│
└── scripts/ # Utility scripts
├── seedDatabase.js # Populate sample data
└── cleanup.js # Reset/cleanup scripts
```


---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js installed  
- Database service running  
- Environment variables configured  

---

### Installation Steps
1. Clone the repository  
2. Install backend dependencies  
3. Install frontend dependencies  
4. Configure environment variables  
5. Start backend server  
6. Start frontend application  

---

## 🔔 System Highlights
- Role-based access control  
- Verified candidate evaluation  
- Real-time interaction updates  
- Modular and scalable architecture  

---

## 📊 Key Benefits
- Reduces hiring bias  
- Improves evaluation accuracy  
- Saves recruiter time  
- Encourages skill-based hiring  

---

## 🔮 Future Scope
- AI-based candidate insights  
- Interview scheduling integration  
- Advanced analytics dashboard  
- Multi-platform verification  

---

## 🏷️ Tagline
**From Resumes to Reality — Hire Based on Proof**