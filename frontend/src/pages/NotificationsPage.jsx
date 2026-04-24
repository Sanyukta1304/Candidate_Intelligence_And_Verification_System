import React from "react";

const NotificationsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-primary-dark mb-8">Notifications</h1>

        {/* Notification Items */}
        <div className="space-y-4">
          {/* Notification Item 1 */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-soft-lg p-6 hover:shadow-lg transition">
            <p className="text-slate-700">
              <span className="font-semibold text-slate-900">TechCorp</span> viewed your profile
            </p>
            <p className="text-sm text-slate-500 mt-2">2 hours ago</p>
          </div>

          {/* Notification Item 2 */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-soft-lg p-6 hover:shadow-lg transition">
            <p className="text-slate-700">
              <span className="font-semibold text-slate-900">StartupXYZ</span> starred your profile
            </p>
            <p className="text-sm text-slate-500 mt-2">5 hours ago</p>
          </div>

          {/* Notification Item 3 */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-soft-lg p-6 hover:shadow-lg transition">
            <p className="text-slate-700">
              <span className="font-semibold text-slate-900">DevCo</span> viewed your profile
            </p>
            <p className="text-sm text-slate-500 mt-2">1 day ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;