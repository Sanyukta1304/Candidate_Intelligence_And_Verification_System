import React from 'react';
import { Card } from '../UI';

/**
 * ActivityFeed Component
 * Displays recent activity with timestamps and user initials
 */
export const ActivityFeed = ({ activities = [], loading = false }) => {
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((part) => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'just now';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-primary-dark">Recent Activity</h3>
        <span className="text-xs text-slate-500">Last 10 actions</span>
      </div>

      <div className="space-y-4">
        {loading ? (
          <>
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="flex gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded w-48 mb-2"></div>
                  <div className="h-3 bg-slate-100 rounded w-24"></div>
                </div>
              </div>
            ))}
          </>
        ) : activities.length > 0 ? (
          activities.map((activity, idx) => (
            <div key={idx} className="flex items-start gap-3 pb-4 border-b border-slate-100 last:border-0">
              <div
                className="w-10 h-10 rounded-full bg-primary-dark text-white flex items-center justify-center flex-shrink-0 text-sm font-semibold"
                title={activity.candidateName}
              >
                {getInitials(activity.candidateName)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-800 text-sm">
                  <span className="font-semibold">{activity.candidateName}</span>
                  {' — '}
                  <span className="text-slate-600">{activity.action}</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {formatTime(activity.timestamp)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-slate-500">
            <p className="text-sm">No recent activity</p>
          </div>
        )}
      </div>
    </Card>
  );
};
