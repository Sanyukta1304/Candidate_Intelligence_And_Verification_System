<<<<<<< HEAD
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-soft-lg p-8 mb-8">
        <h1 className="text-3xl font-bold text-primary-dark mb-2">
          Welcome, {user?.name}!
        </h1>
        <p className="text-slate-600">
          You are logged in as a <span className="font-semibold capitalize">{user?.role}</span>
        </p>
      </div>

      {/* Role-Based Content */}
      {user?.role === 'candidate' && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Profile Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-soft-lg p-8">
            <h2 className="text-xl font-semibold text-primary-dark mb-4">Your Profile</h2>
            <p className="text-slate-600 mb-6">Build and verify your professional profile.</p>
            <button className="w-full bg-primary-dark text-white font-semibold py-3 rounded-lg hover:bg-slate-800 transition-colors">
              Edit Profile
            </button>
          </div>

          {/* Projects Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-soft-lg p-8">
            <h2 className="text-xl font-semibold text-primary-dark mb-4">Your Projects</h2>
            <p className="text-slate-600 mb-6">Showcase your best work and achievements.</p>
            <button className="w-full bg-primary-dark text-white font-semibold py-3 rounded-lg hover:bg-slate-800 transition-colors">
              Manage Projects
            </button>
          </div>
        </div>
      )}

      {user?.role === 'recruiter' && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Browse Candidates Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-soft-lg p-8">
            <h2 className="text-xl font-semibold text-primary-dark mb-4">Browse Candidates</h2>
            <p className="text-slate-600 mb-6">Find and shortlist qualified candidates.</p>
            <button className="w-full bg-primary-dark text-white font-semibold py-3 rounded-lg hover:bg-slate-800 transition-colors">
              View Candidates
            </button>
          </div>

          {/* Shortlist Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-soft-lg p-8">
            <h2 className="text-xl font-semibold text-primary-dark mb-4">Your Shortlist</h2>
            <p className="text-slate-600 mb-6">Manage your shortlisted candidates.</p>
            <button className="w-full bg-primary-dark text-white font-semibold py-3 rounded-lg hover:bg-slate-800 transition-colors">
              View Shortlist
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
=======
import React from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const DashboardPage = () => {
  const navigate = useNavigate();
  const score = 68;

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial",
        background: "#f7f9fc",
        minHeight: "100vh"
      }}
    >
      {/* Navbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px"
        }}
      >
        <h2>CredVerify</h2>

        <div style={{ display: "flex", gap: "20px", cursor: "pointer" }}>
          <span onClick={() => navigate("/dashboard")}>Dashboard</span>
          <span onClick={() => navigate("/profile")}>Profile</span>
          <span onClick={() => navigate("/notifications")}>Notifications</span>
          <span>Logout</span>
        </div>
      </div>

      {/* Banner */}
      <div
        style={{
          background: "#ffe5b4",
          padding: "15px",
          borderRadius: "10px",
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px"
        }}
      >
        <span>
          Connect your GitHub account to unlock Resume ATS scoring and Project verification
        </span>

        <button
          style={{
            background: "#ff7f50",
            border: "none",
            padding: "10px 15px",
            borderRadius: "8px",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          Connect GitHub
        </button>
      </div>

      {/* Top Section */}
      <div style={{ display: "flex", gap: "20px" }}>
        
        {/* Circle */}
        <div
          style={{
            width: "250px",
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 0 10px #eee",
            textAlign: "center"
          }}
        >
          <CircularProgressbar
            value={score}
            text={`${score}`}
            styles={buildStyles({
              pathColor: "#4f46e5",
              textColor: "#000",
              trailColor: "#eee"
            })}
          />

          <p style={{ marginTop: "10px" }}>Credibility score</p>
          <span style={{ color: "orange" }}>Moderate</span>
        </div>

        {/* Cards */}
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px"
          }}
        >
          <div style={card("#f0f8ff")}>
            <h4>Skills</h4>
            <h2>34/40</h2>
          </div>

          <div style={card("#f5fff0")}>
            <h4>Resume</h4>
            <h2>21/30</h2>
          </div>

          <div style={card("#f0f0ff")}>
            <h4>Projects</h4>
            <h2>13/30</h2>
          </div>

          <div style={card("#fff5f5")}>
            <h4>Verified Projects</h4>
            <h2>2</h2>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div style={{ marginTop: "30px", display: "flex", gap: "20px" }}>
        
        {/* Breakdown */}
        <div
          style={{
            flex: 2,
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 0 10px #eee"
          }}
        >
          <h3>Score breakdown</h3>

          <p>Skills</p>
          <progress value="34" max="40" style={{ width: "100%" }} />

          <p>Resume</p>
          <progress value="21" max="30" style={{ width: "100%" }} />

          <p>Projects</p>
          <progress value="13" max="30" style={{ width: "100%" }} />
        </div>

        {/* Activity */}
        <div
          style={{
            flex: 1,
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 0 10px #eee"
          }}
        >
          <h3>Profile activity</h3>
          <p>Profile views: 42</p>
          <p>Stars received: 7</p>
          <p>Last scored: 2 hours ago</p>
          <p>GitHub status: Not connected</p>

          {/* 🔥 FIXED BUTTON */}
          <button
            onClick={() => navigate("/edit-profile")}
            style={{
              marginTop: "10px",
              padding: "10px",
              borderRadius: "8px",
              background: "black",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              width: "100%"
            }}
          >
            Edit Profile
          </button>
        </div>

      </div>
    </div>
  );
};

// Card style
const card = (bg) => ({
  background: bg,
  padding: "20px",
  borderRadius: "10px"
});

export default DashboardPage;
>>>>>>> 57a1e520ceaf0e759720d82a067372c2c675ec15
