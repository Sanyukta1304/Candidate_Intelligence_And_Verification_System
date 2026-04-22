import React from "react";
import { useAuth } from "../contexts/AuthContext";

const ProfilePage = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold">Profile</h2>
        <p className="text-gray-500 mt-2">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl">
      <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>

      <div className="bg-white shadow p-4 rounded-lg space-y-3">
        
        <div>
          <p className="text-gray-500">Name</p>
          <p className="font-medium">{user?.name || "N/A"}</p>
        </div>

        <div>
          <p className="text-gray-500">Email</p>
          <p className="font-medium">{user?.email || "N/A"}</p>
        </div>

        <div>
          <p className="text-gray-500">Role</p>
          <p className="font-medium">Candidate</p>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;