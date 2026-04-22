import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { Navbar } from "./components/Navbar";

import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { GitHubCallbackPage } from "./pages/GitHubCallbackPage";

import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/candidate/ProfilePage";
import ProfileEditPage from "./pages/candidate/ProfileEditPage";
import NotificationsPage from "./pages/NotificationsPage";

function App() {
  return (
    <Router>
      <AuthProvider>

        <Navbar />

        <main className="min-h-[calc(100vh-64px)]">
          <Routes>

            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/auth/github/callback" element={<GitHubCallbackPage />} />

            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<ProfileEditPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </main>

      </AuthProvider>
    </Router>
  );
}

export default App;