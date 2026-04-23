import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../UI';

/**
 * QuickLinks Component
 * Shows quick action cards for common recruiter tasks
 */
export const QuickLinks = () => {
  const quickLinks = [
    {
      label: 'Search Candidates',
      description: 'Find and filter talented candidates',
      icon: '🔍',
      to: '/recruiter/search',
      color: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'Starred Candidates',
      description: 'View your saved candidates',
      icon: '⭐',
      to: '/recruiter/starred',
      color: 'bg-yellow-50',
      textColor: 'text-yellow-600',
    },
    {
      label: 'Company Profile',
      description: 'Update your company info',
      icon: '🏢',
      to: '/recruiter/profile',
      color: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {quickLinks.map((link, idx) => (
        <Link key={idx} to={link.to}>
          <Card className={`p-4 hover:shadow-soft-lg transition-shadow cursor-pointer h-full`}>
            <div className={`${link.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
              <span className="text-xl">{link.icon}</span>
            </div>
            <h4 className={`font-semibold text-slate-900 mb-1`}>{link.label}</h4>
            <p className="text-xs text-slate-600">{link.description}</p>
          </Card>
        </Link>
      ))}
    </div>
  );
};
