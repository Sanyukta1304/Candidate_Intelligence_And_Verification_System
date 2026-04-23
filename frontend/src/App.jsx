import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/candidate/ProfilePage";
import ProfileEditPage from "./pages/candidate/ProfileEditPage";
import NotificationsPage from "./pages/NotificationsPage";

// Recruiter Pages
import RecruiterDashboardPage from "./pages/recruiter/RecruiterDashboardPage";
import TalentSearchPage from "./pages/recruiter/TalentSearchPage";
import StarredCandidatesPage from "./pages/recruiter/StarredCandidatesPage";
import RecruiterProfilePage from "./pages/recruiter/RecruiterProfilePage";
import RecruiterCandidateViewPage from "./pages/recruiter/RecruiterCandidateViewPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default route */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* Main Pages */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/edit-profile" element={<ProfileEditPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />

        {/* Fallback */}
        <Route path="*" element={<h2 style={{ padding: "20px" }}>Page Not Found</h2>} />

<<<<<<< HEAD
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<ProfileEditPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />

            {/* Recruiter Routes */}
            <Route path="/recruiter/dashboard" element={<RecruiterDashboardPage />} />
            <Route path="/recruiter/search" element={<TalentSearchPage />} />
            <Route path="/recruiter/starred" element={<StarredCandidatesPage />} />
            <Route path="/recruiter/profile" element={<RecruiterProfilePage />} />
            <Route path="/recruiter/candidate/:candidateId" element={<RecruiterCandidateViewPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </main>

      </AuthProvider>
    </Router>
=======
      </Routes>
    </BrowserRouter>
>>>>>>> 996b755ed1bb6a11233e04b926a21af9f6d3bb42
  );
}

export default App;