import React, { useState } from 'react';
import { Card } from '../UI';

/**
 * FilterBar Component
 * Handles role filtering, score range, and top candidates
 */
export const FilterBar = ({
  selectedRoles = [],
  minScore = 0,
  maxScore = 100,
  topOnly = false,
  onRoleChange = () => {},
  onMinScoreChange = () => {},
  onMaxScoreChange = () => {},
  onTopOnlyChange = () => {},
  onReset = () => {},
}) => {
  const roles = [
    'Full Stack',
    'Frontend',
    'Backend',
    'Data Analyst',
    'DevOps',
    'Product Manager',
    'Design',
  ];

  const toggleRole = (role) => {
    const updated = selectedRoles.includes(role)
      ? selectedRoles.filter((r) => r !== role)
      : [...selectedRoles, role];
    onRoleChange(updated);
  };

  return (
    <Card className="p-6 mb-6">
      <div className="space-y-6">
        {/* Role Filters */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Role</h3>
          <div className="flex flex-wrap gap-2">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => toggleRole(role)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedRoles.includes(role)
                    ? 'bg-primary-dark text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Score Range */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">
            Min Score: {minScore}
          </h3>
          <div className="flex gap-4 items-center">
            <input
              type="range"
              min="0"
              max="100"
              value={minScore}
              onChange={(e) => onMinScoreChange(Number(e.target.value))}
              className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-dark"
            />
            <span className="text-sm font-semibold text-slate-700 min-w-fit">
              {minScore}
            </span>
          </div>
        </div>

        {/* Top Only Checkbox */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="topOnly"
            checked={topOnly}
            onChange={(e) => onTopOnlyChange(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-primary-dark focus:ring-primary-dark cursor-pointer"
          />
          <label htmlFor="topOnly" className="text-sm font-medium text-slate-700 cursor-pointer">
            Top 10 Candidates Only
          </label>
        </div>

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="w-full px-4 py-2 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </Card>
  );
};
