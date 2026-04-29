import React, { useState } from 'react';
import { Card } from '../UI';

/**
 * FilterBar Component
 * Handles skill filtering, score range, and sorting options
 */
export const FilterBar = ({
  skill = '',
  minScore = 0,
  maxScore = 100,
  sortBy = 'desc',
  onSkillChange = () => {},
  onMinScoreChange = () => {},
  onSortChange = () => {},
  onReset = () => {},
}) => {
  const sortOptions = [
    { value: 'desc', label: 'Highest Score First' },
    { value: 'asc', label: 'Lowest Score First' },
    { value: 'top10', label: 'Top 10 Only' },
    { value: 'name', label: 'Sort by Name' },
    { value: 'recent', label: 'Most Recent' },
  ];

  return (
    <Card className="p-6 mb-6">
      <div className="space-y-6">
        {/* Skill Search */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Search by Skill</h3>
          <input
            type="text"
            value={skill}
            onChange={(e) => onSkillChange(e.target.value)}
            placeholder="e.g., React, Python, AWS..."
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent"
          />
        </div>

        {/* Score Range */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">
            Min Score: {minScore}
          </h3>
          <div className="space-y-3">
            <div className="flex gap-2">
              {[60, 65, 70, 75].map((score) => (
                <button
                  key={score}
                  onClick={() => onMinScoreChange(score)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    minScore === score
                      ? 'bg-primary-dark text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {score}+
                </button>
              ))}
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={minScore}
              onChange={(e) => onMinScoreChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-dark"
            />
          </div>
        </div>

        {/* Sort Options */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Sort By</h3>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
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
