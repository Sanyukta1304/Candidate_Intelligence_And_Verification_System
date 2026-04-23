import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../UI';

/**
 * CandidateCard Component
 * Grid card for starred candidates with full details
 */
export const CandidateCard = ({
  candidate,
  isStarred = false,
  onStarToggle = () => {},
  loading = false,
}) => {
  const [isStarring, setIsStarring] = useState(false);

  const handleStarClick = async () => {
    setIsStarring(true);
    try {
      await onStarToggle(candidate._id || candidate.id);
    } finally {
      setIsStarring(false);
    }
  };

  const getTierColor = (tier) => {
    const colors = {
      'High Potential': 'text-emerald-600 bg-emerald-50',
      'Moderate': 'text-orange-600 bg-orange-50',
      'Entry Level': 'text-blue-600 bg-blue-50',
      'Specialist': 'text-purple-600 bg-purple-50',
    };
    return colors[tier] || 'text-slate-600 bg-slate-50';
  };

  return (
    <Card className="p-0 overflow-hidden hover:shadow-soft-lg transition-shadow">
      {/* Star Icon */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={handleStarClick}
          disabled={isStarring}
          className={`text-2xl transition-transform ${
            isStarred ? 'text-yellow-400' : 'text-slate-300 hover:text-yellow-300'
          } ${isStarring ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          ⭐
        </button>
      </div>

      <div className="p-6">
        {/* Avatar & Basic Info */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-primary-dark text-white flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold">
              {candidate.name
                .split(' ')
                .map((n) => n.charAt(0).toUpperCase())
                .join('')
                .slice(0, 2)}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{candidate.name}</h3>
            <p className="text-sm text-slate-600">{candidate.university || 'N/A'}</p>
          </div>
        </div>

        {/* Score & Tier */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">Credibility Score</span>
            <span className="text-2xl font-bold text-blue-600">
              {(candidate.score || 0).toFixed(0)}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-full rounded-full transition-all"
              style={{ width: `${Math.min((candidate.score || 0), 100)}%` }}
            />
          </div>
        </div>

        {/* Potential Tier Badge */}
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${getTierColor(candidate.tier)}`}>
          {candidate.tier || 'N/A'}
        </div>

        {/* Top Skills */}
        {candidate.topSkills && candidate.topSkills.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-700 mb-2">Top Skills</p>
            <div className="flex flex-wrap gap-2">
              {candidate.topSkills.slice(0, 4).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-xs rounded bg-slate-100 text-slate-700"
                >
                  {skill}
                </span>
              ))}
              {candidate.topSkills.length > 4 && (
                <span className="px-2 py-1 text-xs text-slate-600">
                  +{candidate.topSkills.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* View Profile Button */}
        <Link
          to={`/recruiter/candidate/${candidate._id || candidate.id}`}
          className="w-full block text-center px-4 py-2.5 bg-primary-dark text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
        >
          View Profile
        </Link>
      </div>
    </Card>
  );
};
