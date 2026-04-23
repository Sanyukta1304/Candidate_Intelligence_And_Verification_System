import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { recruiterService } from '../../api/recruiterService';
import { Card } from '../../components/UI';

/**
 * RecruiterCandidateViewPage
 * Detailed read-only view of a candidate from recruiter perspective
 */
const RecruiterCandidateViewPage = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStarred, setIsStarred] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'recruiter' && candidateId) {
      loadCandidateDetail();
    }
  }, [isAuthenticated, user, candidateId]);

  const loadCandidateDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await recruiterService.getCandidateDetail(candidateId);
      const candidateData = response?.data || response;

      setCandidate(candidateData);
      setIsStarred(candidateData?.isStarred || false);
    } catch (err) {
      console.error('Failed to load candidate:', err);
      setError('Failed to load candidate details');
    } finally {
      setLoading(false);
    }
  };

  const handleStarToggle = async () => {
    try {
      setIsToggling(true);

      if (isStarred) {
        await recruiterService.unstarCandidate(candidateId);
        setIsStarred(false);
      } else {
        await recruiterService.starCandidate(candidateId);
        setIsStarred(true);
      }
    } catch (err) {
      console.error('Failed to update star status:', err);
      setError('Failed to update candidate');
    } finally {
      setIsToggling(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'recruiter') {
    return (
      <div className="p-6">
        <p className="text-slate-600">Access denied. This page is for recruiters only.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 animate-pulse">
            <div className="space-y-4">
              <div className="h-8 bg-slate-200 rounded w-48"></div>
              <div className="h-32 bg-slate-200 rounded"></div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error || 'Candidate not found'}</p>
              <button
                onClick={() => navigate('/recruiter/search')}
                className="px-4 py-2 bg-primary-dark text-white font-medium rounded-lg hover:bg-slate-800"
              >
                Back to Search
              </button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Back Button */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-primary-dark hover:text-slate-800 font-medium flex items-center gap-2"
          >
            ← Back
          </button>
          <button
            onClick={handleStarToggle}
            disabled={isToggling}
            className={`text-3xl transition-transform ${
              isStarred ? 'text-yellow-400' : 'text-slate-300 hover:text-yellow-300'
            } ${isToggling ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            ⭐
          </button>
        </div>

        {/* Candidate Header Card */}
        <Card className="p-8 mb-8">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-24 h-24 rounded-full bg-primary-dark text-white flex items-center justify-center flex-shrink-0">
              <span className="text-4xl font-bold">
                {candidate.name
                  .split(' ')
                  .map((n) => n.charAt(0).toUpperCase())
                  .join('')
                  .slice(0, 2)}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-primary-dark mb-2">
                {candidate.name}
              </h1>
              <p className="text-slate-600 mb-3">{candidate.university || 'N/A'}</p>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getTierColor(
                    candidate.tier
                  )}`}
                >
                  {candidate.tier || 'N/A'}
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  {(candidate.score || 0).toFixed(0)}
                </span>
              </div>
            </div>
          </div>

          {/* Score Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-700">Credibility Score</p>
              <p className="text-xs text-slate-600">
                {(candidate.score || 0).toFixed(0)} / 100
              </p>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-blue-500 h-full rounded-full transition-all"
                style={{ width: `${Math.min((candidate.score || 0), 100)}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Score Breakdown */}
        {candidate.scoreBreakdown && (
          <Card className="p-8 mb-8">
            <h2 className="text-xl font-semibold text-primary-dark mb-6">Score Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(candidate.scoreBreakdown).map(([key, value]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-slate-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-sm font-semibold text-slate-900">{value}%</p>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-primary-dark h-full rounded-full"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Skills */}
        {candidate.topSkills && candidate.topSkills.length > 0 && (
          <Card className="p-8 mb-8">
            <h2 className="text-xl font-semibold text-primary-dark mb-6">Top Skills</h2>
            <div className="flex flex-wrap gap-3">
              {candidate.topSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Card>
        )}

        {/* Projects */}
        {candidate.projects && candidate.projects.length > 0 && (
          <Card className="p-8 mb-8">
            <h2 className="text-xl font-semibold text-primary-dark mb-6">Projects</h2>
            <div className="space-y-6">
              {candidate.projects.map((project, idx) => (
                <div key={idx} className="pb-6 border-b border-slate-200 last:border-0">
                  <h3 className="font-semibold text-slate-900 mb-2">{project.title}</h3>
                  <p className="text-sm text-slate-600 mb-3">{project.description}</p>
                  {project.technologies && (
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, tidx) => (
                        <span
                          key={tidx}
                          className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Contact */}
        {candidate.email && (
          <Card className="p-8 mb-8">
            <h2 className="text-xl font-semibold text-primary-dark mb-4">Contact</h2>
            <div className="space-y-2">
              <p className="text-slate-700">
                <span className="text-sm font-medium text-slate-600">Email:</span>
              </p>
              <a
                href={`mailto:${candidate.email}`}
                className="text-blue-600 hover:underline font-medium"
              >
                {candidate.email}
              </a>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RecruiterCandidateViewPage;
