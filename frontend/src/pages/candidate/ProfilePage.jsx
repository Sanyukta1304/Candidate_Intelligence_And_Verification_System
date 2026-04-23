import React from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>

      {/* Navbar */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h2>CredVerify</h2>

        <div style={{ display: "flex", gap: "20px", cursor: "pointer" }}>
          <span onClick={() => navigate("/dashboard")}>Dashboard</span>
          <span onClick={() => navigate("/profile")}>Profile</span>
          <span onClick={() => navigate("/notifications")}>Notifications</span>
          <span>Logout</span>
        </div>
      </div>

      {/* Top Profile Card */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 0 10px #eee"
      }}>
        <div>
          <h2>John Doe</h2>
          <p>B.Tech Computer Science • MIT</p>
          <span style={{ color: "orange", marginRight: "10px" }}>Moderate</span>
          <span style={{ color: "red" }}>Not Verified</span>
        </div>

        <div style={{ textAlign: "right" }}>
          <h2>68 / 100</h2>
          <button
            onClick={() => navigate("/edit-profile")}
            style={{ padding: "8px 12px", borderRadius: "8px", cursor: "pointer" }}
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex",
        gap: "20px",
        marginTop: "20px",
        borderBottom: "2px solid #eee",
        paddingBottom: "10px"
      }}>
        <span style={{ fontWeight: "bold" }}>Details + Skills</span>
        <span>Resume + ATS score</span>
        <span>Projects</span>
      </div>

      {/* Content Section */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>

        {/* Left */}
        <div style={{
          flex: 1,
          background: "#fff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 0 10px #eee"
        }}>
          <h3>Personal Info</h3>
          <p>Degree: B.Tech Computer Science</p>
          <p>Institution: MIT</p>
          <p>Graduation Year: 2024</p>
          <p>GitHub: Not connected</p>
        </div>

        {/* Right */}
        <div style={{
          flex: 1,
          background: "#fff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 0 10px #eee"
        }}>
          <h3>Score Breakdown</h3>

          <p>Skills</p>
          <progress value="34" max="40" style={{ width: "100%" }} />

          <p>Resume</p>
          <progress value="21" max="30" style={{ width: "100%" }} />

          <p>Projects</p>
          <progress value="13" max="30" style={{ width: "100%" }} />

          <h4 style={{ marginTop: "10px" }}>Total: 68 / 100</h4>
        </div>

      </div>

      {/* Bottom Locked Section */}
      <div style={{
        marginTop: "20px",
        background: "#fff3cd",
        padding: "20px",
        borderRadius: "10px",
        textAlign: "center"
      }}>
        <h4>GitHub verification required</h4>
        <p>Connect your GitHub account to unlock full scoring</p>
        <button style={{
          background: "#ff7f50",
          color: "#fff",
          padding: "10px",
          border: "none",
          borderRadius: "8px"
        }}>
          Connect GitHub
        </button>
      </div>

    </div>
  );
};

export default ProfilePage;