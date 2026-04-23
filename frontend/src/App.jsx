<<<<<<< HEAD
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { PrivateRoute, PublicRoute } from './components/PrivateRoute';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { GitHubCallbackPage } from './pages/GitHubCallbackPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <main className="min-h-[calc(100vh-64px)]">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <HomePage />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />
            <Route
              path="/auth/github/callback"
              element={<GitHubCallbackPage />}
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />

            {/* Role-Specific Protected Routes (Example) */}
            <Route
              path="/candidate/*"
              element={
                <PrivateRoute requiredRole="candidate">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-3xl font-bold text-primary-dark">Candidate Portal</h1>
                    <p className="text-slate-600 mt-2">This section is only for candidates.</p>
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/recruiter/*"
              element={
                <PrivateRoute requiredRole="recruiter">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-3xl font-bold text-primary-dark">Recruiter Portal</h1>
                    <p className="text-slate-600 mt-2">This section is only for recruiters.</p>
                  </div>
                </PrivateRoute>
              }
            />

            {/* 404 Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </AuthProvider>
    </Router>
  );
}

export default App;
=======
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

        {/* Recruiter Routes */}
        <Route path="/recruiter/dashboard" element={<RecruiterDashboardPage />} />
        <Route path="/recruiter/search" element={<TalentSearchPage />} />
        <Route path="/recruiter/starred" element={<StarredCandidatesPage />} />
        <Route path="/recruiter/profile" element={<RecruiterProfilePage />} />
        <Route path="/recruiter/candidate/:candidateId" element={<RecruiterCandidateViewPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
>>>>>>> 57a1e520ceaf0e759720d82a067372c2c675ec15
