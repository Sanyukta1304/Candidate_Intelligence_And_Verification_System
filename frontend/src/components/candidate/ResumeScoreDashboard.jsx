import React from 'react';

/**
 * Resume Score Dashboard Component
 * Displays resume ATS score with KPI analysis, section analysis, pie chart, signal strength, and spider chart
 */
export const ResumeScoreDashboard = ({ resumeScore = null, scoreCard = null }) => {
  if (!resumeScore) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-soft-lg p-8">
        <h3 className="text-xl font-semibold text-primary-dark mb-6">Resume + ATS Score</h3>
        <div className="text-center py-8 text-slate-500">
          <p className="text-sm">No resume score available. Upload and submit your resume to see ATS analysis.</p>
        </div>
      </div>
    );
  }

  // Calculate score percentages for proper display
  const atsScore = Math.round(resumeScore.final_score || 0);
  const sectionScore = Math.round(resumeScore.dimension_scores?.structure || 0);
  const keywordScore = Math.round(resumeScore.dimension_scores?.market_demand || 0);
  const formatScore = Math.round(resumeScore.dimension_scores?.evidence || 0);

  // Calculate resume score as percentage of total (30% of 100)
  // Formula: (ATS Score / 100) * 30 = Resume Contribution (0-30)
  const resumeScorePercentage = Math.round((atsScore / 100) * 30);

  // Determine signal strength labels
  const getSignalLabel = (score) => {
    if (score >= 75) return 'Strong';
    if (score >= 50) return 'Moderate';
    return 'Weak';
  };

  const getSignalColor = (score) => {
    if (score >= 75) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Sample spider chart data (in real implementation, calculate from actual metrics)
  const spiderData = [
    { label: 'Experience', value: Math.min((sectionScore / 100 * 100), 100) },
    { label: 'Skills', value: Math.min((keywordScore / 100 * 100), 100) },
    { label: 'Education', value: Math.min((formatScore / 100 * 100), 100) },
    { label: 'Clarity', value: Math.min((atsScore / 100 * 100), 100) },
    { label: 'Quality', value: Math.min((sectionScore / 100 * 100), 100) }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-soft-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-200 px-8 py-6">
        <h3 className="text-xl font-semibold text-primary-dark">Resume + ATS Score</h3>
        <p className="text-sm text-slate-600 mt-1">
          Scored on {resumeScore?.meta?.scored_at ? new Date(resumeScore.meta.scored_at).toLocaleDateString() : 'recently'}
        </p>
      </div>

      <div className="p-8">
        {/* KPI Analysis Section - Top */}
        <div className="mb-8">
          <h4 className="font-semibold text-slate-900 mb-4">KPI Analysis</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <p className="text-xs font-medium text-blue-600 mb-1">ATS Score</p>
              <p className="text-3xl font-bold text-blue-900">{atsScore}</p>
              <p className="text-xs text-blue-700 mt-2">Out of 100</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <p className="text-xs font-medium text-green-600 mb-1">Section Score</p>
              <p className="text-3xl font-bold text-green-900">{sectionScore}</p>
              <p className="text-xs text-green-700 mt-2">/100</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <p className="text-xs font-medium text-purple-600 mb-1">Keyword Score</p>
              <p className="text-3xl font-bold text-purple-900">{keywordScore}</p>
              <p className="text-xs text-purple-700 mt-2">/100</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
              <p className="text-xs font-medium text-orange-600 mb-1">Format Score</p>
              <p className="text-3xl font-bold text-orange-900">{formatScore}</p>
              <p className="text-xs text-orange-700 mt-2">/100</p>
            </div>
          </div>
        </div>

        {/* Profile Balance Score */}
        {scoreCard && (
          <div className="mb-8 bg-slate-50 rounded-lg border border-slate-200 p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold text-slate-700">Resume Score Contribution</p>
              <p className="text-sm font-bold text-slate-900">{Math.round(resumeScorePercentage)}/30</p>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all"
                style={{ width: `${(resumeScorePercentage / 30) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Out of 30% contribution to total profile score
            </p>
          </div>
        )}

        {/* Main Grid - Section Analysis, ATS Breakdown, Signal Strength */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Section Analysis */}
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-6">
            <h4 className="font-semibold text-slate-900 mb-4">Section Analysis</h4>
            <div className="space-y-3">
              {resumeScore.section_presence && Object.entries(resumeScore.section_presence).map(([section, present]) => (
                <div key={section} className="flex justify-between items-center">
                  <span className="text-sm capitalize text-slate-700 font-medium">{section.replace('_', ' ')}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      present
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {present ? '✓ Present' : '✗ Missing'}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-4 italic">
              Add missing sections to improve your ATS score
            </p>
          </div>

          {/* Middle Column - ATS Score Breakdown Pie Chart */}
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-6">
            <h4 className="font-semibold text-slate-900 mb-4">ATS Score Breakdown</h4>
            <div className="flex justify-center mb-6">
              {/* Donut Chart */}
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background circle */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="2.5"
                  />
                  {/* Score circle */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeDasharray={`${(atsScore / 100) * 100}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-slate-900">{atsScore}%</span>
                  <span className="text-xs text-slate-500">Score</span>
                </div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-slate-700">Section: {sectionScore}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-slate-700">Keywords: {keywordScore}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-slate-700">Format: {formatScore}%</span>
              </div>
            </div>
          </div>

          {/* Right Column - Signal Strength */}
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-6">
            <h4 className="font-semibold text-slate-900 mb-4">Signal Strength</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Section Completeness</span>
                  <span className="text-sm font-semibold text-slate-900">{sectionScore}%</span>
                </div>
                <div className="w-full bg-slate-300 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all ${getSignalColor(sectionScore)}`}
                    style={{ width: `${Math.min(sectionScore, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 mt-1">{getSignalLabel(sectionScore)}</p>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Keyword Density</span>
                  <span className="text-sm font-semibold text-slate-900">{keywordScore}%</span>
                </div>
                <div className="w-full bg-slate-300 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all ${getSignalColor(keywordScore)}`}
                    style={{ width: `${Math.min(keywordScore, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 mt-1">{getSignalLabel(keywordScore)}</p>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Format Quality</span>
                  <span className="text-sm font-semibold text-slate-900">{formatScore}%</span>
                </div>
                <div className="w-full bg-slate-300 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all ${getSignalColor(formatScore)}`}
                    style={{ width: `${Math.min(formatScore, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 mt-1">{getSignalLabel(formatScore)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Balance - Spider Chart */}
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-6">
          <h4 className="font-semibold text-slate-900 mb-4">Profile Balance</h4>
          <div className="flex justify-center">
            <svg width="280" height="280" viewBox="0 0 280 280">
              {/* Pentagon grid lines */}
              {[1, 2, 3, 4, 5].map((level) => {
                const points = spiderData.map((_, i) => {
                  const angle = (i * (360 / spiderData.length) - 90) * (Math.PI / 180);
                  const r = (level / 5) * 100;
                  const x = 140 + r * Math.cos(angle);
                  const y = 140 + r * Math.sin(angle);
                  return `${x},${y}`;
                });
                return (
                  <polygon
                    key={`grid-${level}`}
                    points={points.join(' ')}
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Axis labels */}
              {spiderData.map((data, i) => {
                const angle = (i * (360 / spiderData.length) - 90) * (Math.PI / 180);
                const x = 140 + 125 * Math.cos(angle);
                const y = 140 + 125 * Math.sin(angle);
                return (
                  <text
                    key={`label-${i}`}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dy="0.3em"
                    className="text-xs font-medium fill-slate-700"
                  >
                    {data.label}
                  </text>
                );
              })}

              {/* Data polygon */}
              <polygon
                points={spiderData
                  .map((data, i) => {
                    const angle = (i * (360 / spiderData.length) - 90) * (Math.PI / 180);
                    const r = (data.value / 100) * 100;
                    const x = 140 + r * Math.cos(angle);
                    const y = 140 + r * Math.sin(angle);
                    return `${x},${y}`;
                  })
                  .join(' ')}
                fill="#3b82f6"
                fillOpacity="0.2"
                stroke="#3b82f6"
                strokeWidth="2"
              />
            </svg>
          </div>
          <p className="text-xs text-slate-500 text-center mt-4">
            Overall profile balance across key metrics
          </p>
        </div>

        {/* Improvement Suggestions */}
        {resumeScore.improvement_suggestions && resumeScore.improvement_suggestions.length > 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 mb-4">💡 Improvement Suggestions</h4>
            <ul className="space-y-2">
              {resumeScore.improvement_suggestions.slice(0, 5).map((suggestion, idx) => (
                <li key={idx} className="text-sm text-blue-800">
                  <span className="font-medium">• {suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
