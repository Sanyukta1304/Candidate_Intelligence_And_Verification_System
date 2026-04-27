import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { PrivateRoute, PublicRoute } from './components/PrivateRoute';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { GitHubCallbackPage } from './pages/GitHubCallbackPage';
import CandidateProfilePage from './pages/candidate/ProfilePageNew';
import RecruiterDashboardPage from './pages/recruiter/RecruiterDashboardPage';
import TalentSearchPage from './pages/recruiter/TalentSearchPage';
import StarredCandidatesPage from './pages/recruiter/StarredCandidatesPage';
import RecruiterProfilePage from './pages/recruiter/RecruiterProfilePage';
import RecruiterCandidateViewPage from './pages/recruiter/RecruiterCandidateViewPage';
import NotificationsPage from './pages/NotificationsPage';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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

          {/* ADD THIS ABOUT ROUTE */}
          <Route
            path="/about"
            element={
              <PublicRoute>
                <AboutPage />
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

          {/* Protected Routes - Role-Based Dashboard Redirect */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardRedirect />
              </PrivateRoute>
            }
          />

          {/* Candidate Routes */}
          <Route
            path="/candidate/profile"
            element={
              <PrivateRoute requiredRole="candidate">
                <CandidateProfilePage />
              </PrivateRoute>
            }
          />

          {/* Recruiter Routes */}
          <Route
            path="/recruiter/dashboard"
            element={
              <PrivateRoute requiredRole="recruiter">
                <RecruiterDashboardPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/recruiter/search"
            element={
              <PrivateRoute requiredRole="recruiter">
                <TalentSearchPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/recruiter/starred"
            element={
              <PrivateRoute requiredRole="recruiter">
                <StarredCandidatesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/recruiter/profile"
            element={
              <PrivateRoute requiredRole="recruiter">
                <RecruiterProfilePage />
              </PrivateRoute>
            }
          />

          <Route
            path="/recruiter/candidate/:candidateId"
            element={
              <PrivateRoute requiredRole="recruiter">
                <RecruiterCandidateViewPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <CandidateProfilePage />
              </PrivateRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <PrivateRoute requiredRole="candidate">
                <NotificationsPage />
              </PrivateRoute>
            }
          />

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </Router>
  );
}

// Helper component to redirect to role-based dashboard
function DashboardRedirect() {
  const { user } = useAuth();
  
  if (user?.role === 'recruiter') {
    return <Navigate to="/recruiter/dashboard" replace />;
  }
  
  return <DashboardPage />;
}

export default App;