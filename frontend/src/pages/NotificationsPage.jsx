import React from "react";
import { useAuth } from "../contexts/AuthContext";

const NotificationsPage = () => {
  const { isAuthenticated } = useAuth();

  // No hardcoded fake data
  const notifications = [];

  // If not logged in
  if (!isAuthenticated) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-6">
        <h2 className="text-2xl font-semibold mb-2">Notifications</h2>
        <p className="text-gray-500">No new notifications</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Notifications</h2>
          <p className="text-sm text-gray-500">
            {notifications.length} unread
          </p>
        </div>

        {notifications.length > 0 && (
          <button className="text-sm border px-4 py-2 rounded-md hover:bg-gray-100">
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg border">
        {notifications.length === 0 ? (
          <p className="p-6 text-gray-500">No new notifications</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className="flex items-center justify-between p-4 border-b hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                
                {/* Avatar */}
                <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full">
                  {n.initials}
                </div>

                {/* Text */}
                <div>
                  <p className="font-medium">{n.text}</p>
                  <p className="text-sm text-gray-500">{n.time}</p>
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;