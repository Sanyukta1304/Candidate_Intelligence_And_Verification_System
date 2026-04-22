import React from "react";
import { useNavigate } from "react-router-dom";

const ProfileEditPage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f9fc",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          width: "400px",
          background: "#fff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 0 10px #eee"
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Edit Profile
        </h2>

        <input
          placeholder="Name"
          style={inputStyle}
        />

        <input
          placeholder="Degree"
          style={inputStyle}
        />

        <input
          placeholder="Institution"
          style={inputStyle}
        />

        <input
          placeholder="Skills"
          style={inputStyle}
        />

        <textarea
          placeholder="Bio"
          style={{ ...inputStyle, height: "80px" }}
        />

        {/* Buttons */}
        <button
          onClick={() => navigate("/profile")}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "10px",
            borderRadius: "8px",
            background: "black",
            color: "#fff",
            border: "none",
            cursor: "pointer"
          }}
        >
          Save Changes
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "10px",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

export default ProfileEditPage;