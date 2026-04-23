import React from "react";
import { useNavigate } from "react-router-dom";

const NotificationsPage = () => {
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

      <h2>Notifications</h2>

      <div style={{
        marginTop: "20px",
        background: "#fff",
        padding: "15px",
        borderRadius: "10px",
        boxShadow: "0 0 10px #eee"
      }}>
        <p><b>TechCorp</b> viewed your profile • 2 hours ago</p>
      </div>

      <div style={{
        marginTop: "10px",
        background: "#fff",
        padding: "15px",
        borderRadius: "10px",
        boxShadow: "0 0 10px #eee"
      }}>
        <p><b>StartupXYZ</b> starred your profile • 5 hours ago</p>
      </div>

      <div style={{
        marginTop: "10px",
        background: "#fff",
        padding: "15px",
        borderRadius: "10px",
        boxShadow: "0 0 10px #eee"
      }}>
        <p><b>DevCo</b> viewed your profile • 1 day ago</p>
      </div>

    </div>
  );
};

export default NotificationsPage;