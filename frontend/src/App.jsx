import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/candidate/ProfilePage";
import ProfileEditPage from "./pages/candidate/ProfileEditPage";
import NotificationsPage from "./pages/NotificationsPage";

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

      </Routes>
    </BrowserRouter>
  );
}

export default App;