import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { candidateService } from "../api/candidateService";

const NotificationsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initial load of notifications
  useEffect(() => {
    if (isAuthenticated && user?.role === 'candidate') {
      loadNotifications();
    }
  }, [isAuthenticated, user]);

  // Real-time notifications polling (5-second interval)
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'candidate') return;

    const notificationInterval = setInterval(async () => {
      try {
        const notificationData = await candidateService.getNotifications();
        const newNotifications = notificationData?.data || (Array.isArray(notificationData) ? notificationData : []);
        setNotifications(newNotifications);
      } catch (err) {
        console.warn('[NotificationPolling] Failed to fetch notifications:', err.message);
        // Don't show error for polling failures, silently retry
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(notificationInterval);
  }, [isAuthenticated, user]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const notificationData = await candidateService.getNotifications();
      const newNotifications = notificationData?.data || (Array.isArray(notificationData) ? notificationData : []);
      setNotifications(newNotifications);
    } catch (err) {
      console.error('Failed to load notifications:', err);
      setError('Failed to load notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await candidateService.markNotificationRead(notificationId);
      // Update local state to reflect read status
      setNotifications(notifications.map(notif =>
        notif._id === notificationId ? { ...notif, read: true } : notif
      ));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await candidateService.markAllNotificationsRead();
      // Update all notifications to read status
      setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  const formatTimeAgo = (date) => {
    if (!date) return 'Recently';
    const now = new Date();
    const diff = now - new Date(date);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 30) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  if (!isAuthenticated || user?.role !== 'candidate') {
    return (
      <div className="p-6">
        <p className="text-slate-600">Access denied. This page is for candidates only.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Notifications</h1>
            <p className="text-slate-600 mt-2">
              {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
              {notifications.some(n => !n.read) && ` (${notifications.filter(n => !n.read).length} unread)`}
            </p>
          </div>
          {notifications.some(n => !n.read) && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Notification Items */}
        {notifications.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 shadow-soft-lg p-12 text-center">
            <p className="text-slate-600 text-lg">No notifications yet</p>
            <p className="text-slate-500 mt-2">When recruiters view or star your profile, you'll see them here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`rounded-lg border shadow-soft-lg p-6 hover:shadow-lg transition cursor-pointer ${
                  notification.read
                    ? 'bg-white border-slate-200'
                    : 'bg-blue-50 border-blue-200'
                }`}
                onClick={() => !notification.read && handleMarkAsRead(notification._id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className={`${notification.read ? 'text-slate-700' : 'text-slate-900 font-semibold'}`}>
                      {notification.message || `${notification.recruiter_name || 'Someone'} ${notification.action === 'viewed' ? 'viewed' : 'starred'} your profile`}
                    </p>
                    <p className="text-sm text-slate-500 mt-2">
                      {formatTimeAgo(notification.createdAt)}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="ml-4 flex-shrink-0">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;