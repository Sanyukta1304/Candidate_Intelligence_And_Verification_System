import React from 'react';
import { Card } from '../UI';
import { Avatar } from '../Avatar';

/**
 * ActivityFeed Component
 * Displays recent activity with timestamps and user initials
 */
export const ActivityFeed = ({ activities = [], loading = false }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return 'just now';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    // If within the last hour, show relative time like "5m ago"
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    // If today, show time like "2:47 PM"
    if (diffHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).toLowerCase();
    }
    
    // If recently, show relative
    if (diffDays < 7) return `${diffDays}d ago`;

    // Otherwise show date
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>Recent Activity</h3>
        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Last 10 actions</span>
      </div>

      <div className="space-y-4">
        {loading ? (
          <>
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="flex gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-full" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}></div>
                <div className="flex-1">
                  <div className="h-4 rounded w-48 mb-2" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}></div>
                  <div className="h-3 rounded w-24" style={{ backgroundColor: 'var(--color-bg-secondary)' }}></div>
                </div>
              </div>
            ))}
          </>
        ) : activities.length > 0 ? (
          activities.map((activity, idx) => {
            const candidateName = activity.candidate?.name || 'Unknown';
            const actionLabel = activity.action === 'viewed' ? 'profile viewed' : 'profile starred';
            return (
              <div key={idx} className="flex items-start gap-3 pb-4 border-b last:border-0" style={{ borderBottomColor: 'var(--color-border-light)' }}>
                <Avatar name={candidateName} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                    <span className="font-semibold">{candidateName}</span>
                    {' — '}
                    <span style={{ color: 'var(--color-text-secondary)' }}>{actionLabel}</span>
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                    {formatTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
            <p className="text-sm">No recent activity</p>
          </div>
        )}
      </div>
    </Card>
  );
};
