import React from 'react';
import { Card } from '../UI';

/**
 * RecruiterStats Component
 * Displays 4-column grid with key metrics
 */
export const RecruiterStats = ({
  profilesViewed = 0,
  profilesStarred = 0,
  totalCandidates = 0,
  githubVerified = 0,
  loading = false,
}) => {
  const stats = [
    {
      label: 'Profiles Viewed',
      value: profilesViewed,
      icon: '👁️',
      color: 'text-blue-600',
    },
    {
      label: 'Profiles Starred',
      value: profilesStarred,
      icon: '⭐',
      color: 'text-yellow-600',
    },
    {
      label: 'Total Candidates',
      value: totalCandidates,
      icon: '👥',
      color: 'text-purple-600',
    },
    {
      label: 'GitHub Verified',
      value: githubVerified,
      icon: '✓',
      color: 'text-green-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, idx) => (
        <Card key={idx} className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium mb-1">
                {stat.label}
              </p>
              {loading ? (
                <div className="h-8 bg-slate-200 rounded animate-pulse w-12"></div>
              ) : (
                <h3 className={`text-3xl font-bold ${stat.color}`}>
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </h3>
              )}
            </div>
            <div className="text-3xl">{stat.icon}</div>
          </div>
        </Card>
      ))}
    </div>
  );
};
