import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { recruiterService } from '../../api/recruiterService';
import { Card } from '../../components/UI';

/**
 * RecruiterCandidateViewPage
 * Detailed read-only view of a candidate from recruiter perspective
 * Features: Tabbed interface, star/unstar, resume viewing, score breakdown
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
  const [activeTab, setActiveTab] = useState('details'); // 'details', 'resume', 'projects'

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
    } finally {
      setIsToggling(false);
    }
  };

  const handleDownloadResume = () => {
    if (candidate?.resume_url) {
      // Download resume from backend
      const link = document.createElement('a');
      link.href = `/api/candidate/resume/download/${candidateId}`;
      link.download = `${candidate?.name}_resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <Card className="p-8 animate-pulse">
            <div className="space-y-4">
              <div className="h-12 bg-slate-200 rounded w-2/3"></div>
              <div className="h-32 bg-slate-200 rounded"></div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <Card className="p-8">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error || 'Candidate not found'}</p>
              <button
                onClick={() => navigate('/recruiter/search')}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
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
      'High Potential': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'Moderate': 'bg-orange-50 text-orange-700 border border-orange-200',
      'Entry Level': 'bg-blue-50 text-blue-700 border border-blue-200',
      'Specialist': 'bg-purple-50 text-purple-700 border border-purple-200',
    };
    return colors[tier] || 'bg-slate-50 text-slate-700 border border-slate-200';
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/recruiter/search')}
          className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mb-6"
        >
          ← Back to search
        </button>

        {/* Header with Profile and Actions */}
        <Card className="p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                <span className="text-3xl font-bold">{getInitials(candidate.name)}</span>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-slate-900">{candidate.name}</h1>
                </div>
                <p className="text-sm text-slate-600 mb-1">{candidate.user_id?.email || 'No email'}</p>
                <p className="text-slate-600 mb-3">{candidate.university || 'N/A'}</p>
                <div className="flex items-center gap-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getTierColor(candidate.tier)}`}>
                    {candidate.tier || 'Not Rated'}
                  </span>
                  {candidate.github_verified && (
                    <span className="text-green-600 font-medium text-sm flex items-center gap-1">
                      ✓ GitHub Verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleStarToggle}
                disabled={isToggling}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isStarred
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                } disabled:opacity-50`}
              >
                {isStarred ? '⭐ Starred' : '☆ Star'}
              </button>
              {candidate.resume_url && (
                <button
                  onClick={handleDownloadResume}
                  className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all"
                >
                  ↓ Download resume
                </button>
              )}
            </div>
          </div>

          {/* Overall Score */}
          <div className="bg-slate-50 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Overall Score</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-blue-600">{Math.round(candidate.score || 0)}</p>
              <p className="text-sm text-slate-600">/100</p>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="border-b border-slate-200 mb-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'details'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              Details + skills
            </button>
            <button
              onClick={() => setActiveTab('resume')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'resume'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              Resume + ATS score
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'projects'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              Projects
            </button>
          </div>
        </div>

        {/* TAB 1: DETAILS + SKILLS */}
        {activeTab === 'details' && (
          <div className="space-y-8">
            {/* Two Column Layout: Personal Info + Score Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Personal Info */}
              <Card className="p-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Personal info</h3>
                <div className="space-y-4">
                  {candidate.education?.degree && (
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Degree</p>
                      <p className="text-slate-900 font-medium mt-1">{candidate.education.degree}</p>
                    </div>
                  )}
                  {candidate.education?.institution && (
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Institution</p>
                      <p className="text-slate-900 font-medium mt-1">{candidate.education.institution}</p>
                    </div>
                  )}
                  {candidate.education?.graduation_year && (
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Graduation year</p>
                      <p className="text-slate-900 font-medium mt-1">{candidate.education.graduation_year || candidate.education.year}</p>
                    </div>
                  )}
                  {candidate.github_verified && (
                    <div>
                      <p className="text-sm text-slate-600 font-medium">GitHub status</p>
                      <p className="text-green-600 font-medium mt-1">✓ Verified</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Right: Score Breakdown */}
              {candidate.scoreBreakdown && (
                <Card className="p-8">
                  <h3 className="text-lg font-semibold text-slate-900 mb-6">Score breakdown</h3>
                  <div className="space-y-6">
                    {/* Skills */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-slate-700">Skills</p>
                        <p className="text-sm font-bold text-slate-900">
                          {candidate.scoreBreakdown.skills || 0}/40
                        </p>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-full rounded-full"
                          style={{ width: `${Math.min((candidate.scoreBreakdown.skills || 0) / 40 * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Resume */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-slate-700">Resume</p>
                        <p className="text-sm font-bold text-slate-900">
                          {candidate.scoreBreakdown.resume || 0}/30
                        </p>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2.5">
                        <div
                          className="bg-green-500 h-full rounded-full"
                          style={{ width: `${Math.min((candidate.scoreBreakdown.resume || 0) / 30 * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Projects */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-slate-700">Projects</p>
                        <p className="text-sm font-bold text-slate-900">
                          {candidate.scoreBreakdown.projects || 0}/30
                        </p>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2.5">
                        <div
                          className="bg-purple-500 h-full rounded-full"
                          style={{ width: `${Math.min((candidate.scoreBreakdown.projects || 0) / 30 * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Total */}
                    <div className="border-t border-slate-200 pt-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-700">Total</p>
                        <p className="text-lg font-bold text-slate-900">
                          {Math.round(candidate.score || 0)}/100
                        </p>
                      </div>
                      
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Skills with Sub-scores */}
            {candidate.skills && candidate.skills.length > 0 && (
              <Card className="p-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Skills — with sub-scores</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {candidate.skills.slice(0, 6).map((skill, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-lg p-4">
                      {/* Skill Name & Overall Score */}
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-slate-900">{skill.name}</h4>
                        <span className="text-2xl font-bold text-blue-600">{Math.round(skill.sub_score || 0)}</span>
                      </div>

                      {/* Overall Progress Bar */}
                      <div className="mb-4">
                        <div className="h-2 bg-slate-200 rounded-full">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${Math.min(skill.sub_score || 0, 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Sub-score Breakdown */}
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">📊 Project Score</span>
                          <span className="font-semibold text-slate-900">{Math.round(skill.project_score || 0)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">📄 Resume Score</span>
                          <span className="font-semibold text-slate-900">{Math.round(skill.resume_score || 0)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">🏷️ Declared Score</span>
                          <span className="font-semibold text-slate-900">{Math.round(skill.decl_score || 0)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* TAB 2: RESUME + ATS SCORE */}
        {activeTab === 'resume' && (
          <div className="space-y-8">
            {candidate.resumeScoreDetails ? (
              <>
                {/* Top Metrics Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="p-4">
                    <p className="text-xs text-slate-600 font-medium mb-1">Final Score</p>
                    <p className="text-3xl font-bold text-slate-900">{candidate.resumeScoreDetails.final_score || 0}/100</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-xs text-slate-600 font-medium mb-1">Structure</p>
                    <p className="text-3xl font-bold text-slate-900">{Math.round(candidate.resumeScoreDetails.dimensions?.structure || 0)}/100</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-xs text-slate-600 font-medium mb-1">Market Demand</p>
                    <p className="text-3xl font-bold text-slate-900">{Math.round(candidate.resumeScoreDetails.dimensions?.market_demand || 0)}/100</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-xs text-slate-600 font-medium mb-1">Skill Depth</p>
                    <p className="text-3xl font-bold text-slate-900">{Math.round(candidate.resumeScoreDetails.dimensions?.skill_depth || 0)}/100</p>
                  </Card>
                </div>

                {/* Two Column: Section Analysis + ATS Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left: Dimension Scores */}
                  <Card className="p-8">
                    <h3 className="text-lg font-semibold text-slate-900 mb-6">DIMENSION SCORES</h3>
                    <div className="space-y-5">
                      {candidate.resumeScoreDetails.dimensions && Object.entries(candidate.resumeScoreDetails.dimensions).map(([key, value]) => (
                        <div key={key}>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-slate-900 font-medium text-sm capitalize">{key.replace(/_/g, ' ')}</p>
                            <span className="text-slate-900 font-bold text-sm">{Math.round(value || 0)}/100</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-full rounded-full"
                              style={{ width: `${Math.min(value || 0, 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Right: Penalties Applied */}
                  <Card className="p-8">
                    <h3 className="text-lg font-semibold text-slate-900 mb-6">PENALTIES APPLIED</h3>
                    <div className="space-y-4">
                      {candidate.resumeScoreDetails.penalties && Object.entries(candidate.resumeScoreDetails.penalties).length > 0 ? (
                        Object.entries(candidate.resumeScoreDetails.penalties).map(([key, value]) => {
                          if (key === 'total') return null; // Skip total in the list
                          return (
                            <div key={key} className="flex items-center justify-between pb-3 border-b border-slate-100">
                              <p className="text-slate-900 font-medium text-sm capitalize">{key.replace(/_/g, ' ')}</p>
                              <span className={`font-bold text-sm ${value > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {value > 0 ? `-${Math.round(value)}` : '✓'}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-green-600 font-medium">✓ No penalties applied</p>
                        </div>
                      )}
                      {candidate.resumeScoreDetails.penalties?.total > 0 && (
                        <div className="border-t border-slate-200 pt-4">
                          <div className="flex items-center justify-between">
                            <p className="text-slate-900 font-semibold">Total Penalties</p>
                            <span className="text-red-600 font-bold">-{Math.round(candidate.resumeScoreDetails.penalties.total)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>

                {/* Resume Info & Contribution */}
                <Card className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left: Detected Role */}
                    <div>
                      <p className="text-sm text-slate-600 font-medium mb-2">DETECTED ROLE</p>
                      <p className="text-2xl font-bold text-slate-900">{candidate.resumeScoreDetails.detected_role || 'Unknown'}</p>
                      <p className="text-xs text-slate-600 mt-2">Identified based on resume content analysis</p>
                    </div>

                    {/* Center: Resume Contribution */}
                    <div className="flex flex-col justify-center">
                      <p className="text-sm text-slate-600 font-medium mb-2">CONTRIBUTION TO SCORE</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-bold text-slate-900">{candidate.scoreBreakdown?.resume || 0}</p>
                        <p className="text-lg text-slate-600">/30</p>
                      </div>
                      <p className="text-xs text-slate-600 mt-2">
                        {Math.round((candidate.scoreBreakdown?.resume || 0) / 30 * 100)}% of total score
                      </p>
                    </div>

                    {/* Right: File Info */}
                    <div>
                      <p className="text-sm text-slate-600 font-medium mb-2">RESUME FILE</p>
                      <p className="text-slate-900 font-medium text-sm break-all">{candidate.resume_url || 'Not uploaded'}</p>
                      {candidate.resume_url && (
                        <button
                          onClick={handleDownloadResume}
                          className="mt-3 px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700"
                        >
                          ↓ Download
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-slate-600">Resume scoring not available yet. Score the resume to see detailed analysis.</p>
                <button
                  onClick={handleDownloadResume}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  View Resume
                </button>
              </Card>
            )}
          </div>
        )}

        {/* TAB 3: PROJECTS */}
        {activeTab === 'projects' && (
          <div>
            {candidate.projects && candidate.projects.length > 0 ? (
              <div className="space-y-6">
                {candidate.projects.map((project, idx) => (
                  <Card key={idx} className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        {/* Project Header */}
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-slate-900">{project.title}</h3>
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                            ✓ GitHub Verified
                          </span>
                        </div>

                        {/* GitHub Link */}
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm mb-3 block truncate"
                          >
                            {project.github_url}
                          </a>
                        )}

                        {/* Description */}
                        <p className="text-slate-600 mb-4 text-sm">{project.description}</p>

                        {/* Technologies */}
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-6">
                            {project.technologies.map((tech, tidx) => (
                              <span
                                key={tidx}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          <div className="border-l-4 border-blue-500 pl-4">
                            <p className="text-xs text-slate-600 font-medium">Total Commits</p>
                            <p className="text-lg font-bold text-slate-900 mt-1">{project.total_commits || 0}</p>
                          </div>
                          <div className="border-l-4 border-blue-500 pl-4">
                            <p className="text-xs text-slate-600 font-medium">Your Commits</p>
                            <p className="text-lg font-bold text-slate-900 mt-1">{project.your_commits || 0}</p>
                          </div>
                          <div className="border-l-4 border-slate-400 pl-4">
                            <p className="text-xs text-slate-600 font-medium">Visibility</p>
                            <p className="text-lg font-bold text-slate-900 mt-1">{project.visibility}</p>
                          </div>
                          <div className={`border-l-4 pl-4 ${project.has_readme ? 'border-green-500' : 'border-red-500'}`}>
                            <p className="text-xs text-slate-600 font-medium">README</p>
                            <p className={`text-lg font-bold mt-1 ${project.has_readme ? 'text-green-600' : 'text-red-600'}`}>
                              {project.has_readme ? 'Yes' : 'No'}
                            </p>
                          </div>
                          <div className="border-l-4 border-slate-400 pl-4">
                            <p className="text-xs text-slate-600 font-medium">Last Push</p>
                            <p className="text-lg font-bold text-slate-900 mt-1">{project.last_push}</p>
                          </div>
                        </div>
                      </div>

                      {/* Project Score */}
                      <div className="ml-4 flex-shrink-0">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 text-center">
                          <p className="text-xs text-blue-600 font-medium uppercase mb-2">Score</p>
                          <p className="text-4xl font-bold text-blue-600">{project.score}</p>
                        </div>
                      </div>
                    </div>

                    {/* Score Breakdown (if available) */}
                    {project.score_breakdown && Object.keys(project.score_breakdown).length > 0 && (
                      <div className="border-t border-slate-200 pt-4">
                        <p className="text-sm font-semibold text-slate-700 mb-3">Score Breakdown</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {Object.entries(project.score_breakdown).map(([key, value]) => (
                            <div key={key} className="bg-slate-50 rounded p-3">
                              <p className="text-xs text-slate-600 capitalize">{key.replace(/_/g, ' ')}</p>
                              <p className="text-lg font-bold text-slate-900 mt-1">{Math.round(value || 0)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-slate-600 mb-3">No projects added yet</p>
                <p className="text-xs text-slate-500">Projects from GitHub will appear here once verified</p>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterCandidateViewPage;
