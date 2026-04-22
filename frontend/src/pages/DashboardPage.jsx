import React from "react";
import { useAuth } from "../contexts/AuthContext";

const DashboardPage = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <p className="text-gray-500 mt-2">
          Please log in to view your dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">
        Welcome, {user?.name || "User"} 👋
      </h2>

      <div className="mt-6 grid grid-cols-3 gap-4">
        
        <div className="bg-white shadow p-4 rounded-lg">
          <p className="text-gray-500">Profile Views</p>
          <h3 className="text-xl font-bold">0</h3>
        </div>

        <div className="bg-white shadow p-4 rounded-lg">
          <p className="text-gray-500">Applications</p>
          <h3 className="text-xl font-bold">0</h3>
        </div>

        <div className="bg-white shadow p-4 rounded-lg">
          <p className="text-gray-500">Reputation Score</p>
          <h3 className="text-xl font-bold">0</h3>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;