import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { candidateService } from '../../api/candidateService';
import { projectService } from '../../api/projectService';
import { triggerScore } from '../../api/score.api';

const ProfilePageNew = () => {
  const navigate = useNavigate();
  const { user: authUser, login } = useAuth();

  // State management
  const [profile, setProfile] = useState(null);
  const [scoreCard, setScoreCard] = useState(null);
  const [resumeScore, setResumeScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editModalTab, setEditModalTab] = useState('basic');
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [verifying, setVerifying] = useState(false);
  const [verifyingGithub, setVerifyingGithub] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [resumeUploading, setResumeUploading] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    education: null,
    about: '',
    skills: [],
  });

  // Project form state
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    github_link: '',
    tech_stack: [],
  });
  const [projectTechInput, setProjectTechInput] = useState('');

  // Load profile data on mount
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load profile
      const profileRes = await candidateService.getProfile();

      setProfile(profileRes.data);
      // Set scoreCard from profile data - extract scores
      setScoreCard({
        skills: profileRes.data?.skills_score || 0,
        resume: profileRes.data?.resume_score || 0,
        projects: profileRes.data?.projects_score || 0,
        total: profileRes.data?.total_score || 0,
      });

      // Initialize edit form
      setEditForm({
        education: profileRes.data?.education || null,
        about: profileRes.data?.about || '',
        skills: profileRes.data?.skills || [],
      });

      // Load projects
      try {
        const projectsRes = await projectService.getProjects();
        setProjects(Array.isArray(projectsRes) ? projectsRes : []);
      } catch (projErr) {
        console.error('Failed to load projects:', projErr);
        setProjects([]);
      }

      // Load resume score
      try {
        const resumeRes = await candidateService.getResumeScore();
        setResumeScore(resumeRes.data);
      } catch (resumeErr) {
        console.error('Failed to load resume score:', resumeErr);
        setResumeScore(null);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectGithub = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    window.location.href = `${apiUrl}/api/auth/github`;
  };

  const handleVerifyGithub = async () => {
    try {
      setVerifying(true);
      setError(null);

      const response = await candidateService.verifyGithub();

      if (response.success) {
        setSuccessMessage('GitHub verification successful! All features unlocked.');
        
        // Fetch latest user data from /api/auth/me to get updated verification flags
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const token = localStorage.getItem('token');
        
        try {
          const userResponse = await fetch(`${apiUrl}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            // Update Auth context with latest user data including github_verification_locked
            login(userData.user, token);
          }
        } catch (err) {
          console.error('Failed to fetch updated user data:', err);
        }
        
        // Reload profile to get updated verification status
        await loadProfileData();
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to verify GitHub');
    } finally {
      setVerifying(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setVerifying(true);
      setError(null);

      let updateData = {};

      if (editModalTab === 'basic') {
        updateData = {
          education: editForm.education,
          about: editForm.about,
        };
      } else if (editModalTab === 'skills') {
        updateData = {
          skills: editForm.skills.map(skill => typeof skill === 'object' ? skill : { name: skill }),
        };
      }

      const response = await candidateService.updateProfile(updateData);

      if (response.success) {
        setProfile(response.data);
        
        // Trigger score re-calculation after skills update
        if (editModalTab === 'skills' && profile?._id) {
          try {
            await triggerScore(profile._id);
          } catch (scoreErr) {
            console.error('Failed to trigger score re-calculation:', scoreErr);
          }
        }
        
        setShowEditModal(false);
        setSuccessMessage('Profile updated successfully!');
        await loadProfileData();
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setVerifying(false);
    }
  };

  const handleAddProject = async () => {
    try {
      setVerifying(true);
      setError(null);

      const response = await projectService.createProject(projectForm);

      if (response.project || response.message) {
        setSuccessMessage('Project added and verified successfully!');
        setShowProjectModal(false);
        setProjectForm({
          title: '',
          description: '',
          github_link: '',
          tech_stack: [],
        });
        setProjectTechInput('');
        // Reload projects
        await loadProfileData();
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to add project');
    } finally {
      setVerifying(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      setVerifying(true);
      setError(null);

      const response = await projectService.deleteProject(projectId);

      if (response) {
        setSuccessMessage('Project deleted successfully!');
        // Reload projects
        await loadProfileData();
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete project');
    } finally {
      setVerifying(false);
    }
  };

  const handleAddTechStack = () => {
    if (projectTechInput.trim()) {
      setProjectForm({
        ...projectForm,
        tech_stack: [...projectForm.tech_stack, projectTechInput.trim()],
      });
      setProjectTechInput('');
    }
  };

  const handleRemoveTechStack = (index) => {
    setProjectForm({
      ...projectForm,
      tech_stack: projectForm.tech_stack.filter((_, i) => i !== index),
    });
  };

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      const newSkill = {
        name: skillInput.trim(),
        sub_score: 0,
        project_score: 0,
        resume_score: 0,
        decl_score: 20,
      };
      setEditForm({
        ...editForm,
        skills: [...editForm.skills, newSkill],
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (index) => {
    setEditForm({
      ...editForm,
      skills: editForm.skills.filter((_, i) => i !== index),
    });
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.pdf') && !file.name.toLowerCase().endsWith('.docx')) {
      setError('Only PDF and DOCX files are supported');
      return;
    }

    try {
      setResumeUploading(true);
      setError(null);

      const response = await candidateService.uploadResume(file);

      if (response.success || response.data) {
        setSuccessMessage('Resume uploaded and scored successfully!');
        // Reload profile data to get updated scores
        await loadProfileData();
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to upload resume');
    } finally {
      setResumeUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  // Check if GitHub is verified
  const isGithubVerified = authUser?.github_verified && authUser?.github_verification_locked;
  const isVerificationLocked = authUser?.github_verification_locked;

  // Feature lock check
  const canAccessRestrictedFeatures = isGithubVerified;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark mx-auto mb-4"></div>
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* GitHub Connection Alert */}
        {!isGithubVerified && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-yellow-900">
                Connect your GitHub account to unlock Resume ATS scoring and Project verification
              </h3>
              <p className="text-sm text-yellow-800 mt-2">
                {isVerificationLocked
                  ? 'Complete the verification below'
                  : 'Start by connecting your GitHub account'}
              </p>
            </div>
            <button
              onClick={handleConnectGithub}
              className="ml-4 px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 whitespace-nowrap"
            >
              Connect GitHub
            </button>
          </div>
        )}

        {/* Profile Header Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-soft-lg p-8 mb-8">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {authUser?.username?.charAt(0) || 'U'}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold text-primary-dark">{authUser?.username}</h2>
                  {isGithubVerified ? (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      ✓ Verified
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                      Not Verified
                    </span>
                  )}
                </div>
                <p className="text-slate-600">
                  {authUser?.email}
                </p>
                <p className="text-slate-500 text-sm mt-1">
                  {profile?.education?.degree || 'No degree'} • {profile?.education?.institution || 'No institution'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-primary-dark mb-2">
                {scoreCard?.total || 0} / 100
              </div>
              {isGithubVerified && (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-slate-800"
                >
                  Edit profile
                </button>
              )}
              {!isGithubVerified && (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-4 py-2 bg-slate-300 text-slate-600 rounded-lg cursor-not-allowed"
                  disabled
                >
                  Edit profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Verification Button - Show after GitHub OAuth but before verification */}
        {authUser?.github_verified && !authUser?.github_verification_locked && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-6 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-blue-900">Complete GitHub Verification</h3>
              <p className="text-sm text-blue-800 mt-2">
                Click the button below to verify your GitHub connection and unlock all features
              </p>
            </div>
            <button
              onClick={handleVerifyGithub}
              disabled={verifying}
              className="ml-4 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {verifying ? 'Verifying...' : 'Verify GitHub'}
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-slate-200 mb-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-4 font-semibold border-b-2 transition-colors ${
                activeTab === 'details'
                  ? 'border-primary-dark text-primary-dark'
                  : 'border-transparent text-slate-600 hover:text-primary-dark'
              }`}
            >
              Details + Skills
            </button>
            <button
              onClick={() => setActiveTab('resume')}
              disabled={!canAccessRestrictedFeatures}
              className={`pb-4 font-semibold border-b-2 transition-colors ${
                activeTab === 'resume'
                  ? 'border-primary-dark text-primary-dark'
                  : 'border-transparent text-slate-600 hover:text-primary-dark'
              } ${!canAccessRestrictedFeatures ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Resume + ATS score {!canAccessRestrictedFeatures && '🔒'}
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              disabled={!canAccessRestrictedFeatures}
              className={`pb-4 font-semibold border-b-2 transition-colors ${
                activeTab === 'projects'
                  ? 'border-primary-dark text-primary-dark'
                  : 'border-transparent text-slate-600 hover:text-primary-dark'
              } ${!canAccessRestrictedFeatures ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Projects {!canAccessRestrictedFeatures && '🔒'}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'details' && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Personal Info */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-soft-lg p-8">
              <h3 className="text-xl font-semibold text-primary-dark mb-6">Personal Info</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600">Degree</p>
                  <p className="font-semibold text-slate-900">
                    {profile?.education?.degree || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Institution</p>
                  <p className="font-semibold text-slate-900">
                    {profile?.education?.institution || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Graduation Year</p>
                  <p className="font-semibold text-slate-900">
                    {profile?.education?.year || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">GitHub Status</p>
                  <p className="font-semibold text-slate-900">
                    {isGithubVerified ? '✓ Connected & Verified' : 'Not connected'}
                  </p>
                </div>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-soft-lg p-8">
              <h3 className="text-xl font-semibold text-primary-dark mb-6">Score Breakdown</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm font-semibold text-slate-700">Skills</p>
                    <p className="text-sm font-semibold text-slate-700">
                      {scoreCard?.skills || 0}/40
                    </p>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(scoreCard?.skills || 0) / 40 * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm font-semibold text-slate-700">Resume</p>
                    <p className="text-sm font-semibold text-slate-700">
                      {Math.min(scoreCard?.resume || 0, 30)}/30
                    </p>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${Math.min((scoreCard?.resume || 0), 30) / 30 * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm font-semibold text-slate-700">Projects</p>
                    <p className="text-sm font-semibold text-slate-700">
                      {scoreCard?.projects || 0}/30
                    </p>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${(scoreCard?.projects || 0) / 30 * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-lg font-bold text-primary-dark">
                    Total: {scoreCard?.total || 0} / 100
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resume' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-soft-lg p-8">
            {!canAccessRestrictedFeatures ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Feature Locked</h3>
                <p className="text-slate-600 mb-6">
                  Please complete GitHub verification to access Resume features
                </p>
                <button
                  onClick={handleConnectGithub}
                  className="px-6 py-2 bg-primary-dark text-white rounded-lg hover:bg-slate-800"
                >
                  Connect GitHub
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-semibold text-primary-dark mb-6">Resume + ATS Score</h3>
                
                {resumeScore ? (
                  <div className="space-y-6">
                    {/* Top Score Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white rounded-lg border border-slate-200 p-4">
                        <p className="text-xs font-medium text-slate-600 mb-1">ATS Score</p>
                        <p className="text-2xl font-bold text-primary-dark">{resumeScore.final_score || 0}/100</p>
                      </div>
                      <div className="bg-white rounded-lg border border-slate-200 p-4">
                        <p className="text-xs font-medium text-slate-600 mb-1">Section score</p>
                        <p className="text-2xl font-bold text-primary-dark">{resumeScore.dimension_scores?.structure || 0}/100</p>
                      </div>
                      <div className="bg-white rounded-lg border border-slate-200 p-4">
                        <p className="text-xs font-medium text-slate-600 mb-1">Keyword score</p>
                        <p className="text-2xl font-bold text-primary-dark">{resumeScore.dimension_scores?.market_demand || 0}/100</p>
                      </div>
                      <div className="bg-white rounded-lg border border-slate-200 p-4">
                        <p className="text-xs font-medium text-slate-600 mb-1">Format score</p>
                        <p className="text-2xl font-bold text-primary-dark">{resumeScore.dimension_scores?.evidence || 0}/100</p>
                      </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Left Column - Section Analysis */}
                      <div className="bg-white rounded-lg border border-slate-200 p-6">
                        <h4 className="font-semibold text-slate-900 mb-4">Section Analysis</h4>
                        <div className="space-y-3">
                          {resumeScore.section_presence && Object.entries(resumeScore.section_presence).map(([section, present]) => (
                            <div key={section} className="flex justify-between items-center">
                              <span className="text-sm capitalize text-slate-600">{section}</span>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${present ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {present ? 'Present' : 'Missing'}
                              </span>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-slate-500 mt-4 italic">Add missing sections to improve your ATS score</p>
                      </div>

                      {/* Middle Column - ATS Score Breakdown */}
                      <div className="bg-white rounded-lg border border-slate-200 p-6">
                        <h4 className="font-semibold text-slate-900 mb-4">ATS Score Breakdown</h4>
                        <div className="flex justify-center mb-4">
                          {/* Simple CSS Donut Chart */}
                          <div className="relative w-32 h-32">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#e2e8f0"
                                strokeWidth="3"
                              />
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#22c55e"
                                strokeWidth="3"
                                strokeDasharray={`${(resumeScore.dimension_scores?.structure || 0) / 100 * 100}, 100`}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-lg font-bold text-slate-900">{resumeScore.dimension_scores?.structure || 0}/100</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-sm text-slate-600">Section completeness: {resumeScore.dimension_scores?.structure || 0}/100</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span className="text-sm text-slate-600">Keyword density: {resumeScore.dimension_scores?.market_demand || 0}/100</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                            <span className="text-sm text-slate-600">Format score: {resumeScore.dimension_scores?.evidence || 0}/100</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Signal Strength */}
                      <div className="bg-white rounded-lg border border-slate-200 p-6">
                        <h4 className="font-semibold text-slate-900 mb-4">Signal Strength</h4>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-slate-600">Section completeness</span>
                              <span className="text-sm font-medium text-slate-900">
                                {resumeScore.dimension_scores?.structure || 0}/100
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div
                                className="bg-yellow-500 h-2 rounded-full"
                                style={{ width: `${(resumeScore.dimension_scores?.structure || 0) / 100 * 100}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Moderate</p>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-slate-600">Action keyword density</span>
                              <span className="text-sm font-medium text-slate-900">
                                {resumeScore.dimension_scores?.market_demand || 0}/100
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${(resumeScore.dimension_scores?.market_demand || 0) / 100 * 100}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Strong</p>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-slate-600">Format quality</span>
                              <span className="text-sm font-medium text-slate-900">
                                {resumeScore.dimension_scores?.evidence || 0}/100
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${(resumeScore.dimension_scores?.evidence || 0) / 100 * 100}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Strong</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Download Resume Button */}
                    <div className="text-center">
                      <a
                        href={profile?.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-3 bg-primary-dark text-white rounded-lg hover:bg-slate-800 font-semibold"
                      >
                        📄 Download Resume
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">📄</div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">No resume uploaded</h3>
                    <p className="text-slate-600 mb-6">Upload your resume to get ATS scoring and improve your profile</p>
                    <button
                      onClick={() => {
                        setShowEditModal(true);
                        setEditModalTab('resume');
                      }}
                      className="px-6 py-3 bg-primary-dark text-white rounded-lg hover:bg-slate-800 font-semibold"
                    >
                      Upload your resume
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-soft-lg p-8">
            {!canAccessRestrictedFeatures ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Feature Locked</h3>
                <p className="text-slate-600 mb-6">
                  Please complete GitHub verification to access Projects features
                </p>
                <button
                  onClick={handleConnectGithub}
                  className="px-6 py-2 bg-primary-dark text-white rounded-lg hover:bg-slate-800"
                >
                  Connect GitHub
                </button>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-primary-dark">Projects</h3>
                  <button
                    onClick={() => setShowProjectModal(true)}
                    className="px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-slate-800 font-semibold"
                  >
                    + Add project
                  </button>
                </div>

                {projects.length === 0 ? (
                  <p className="text-slate-600 text-center py-12">No projects added yet. Click the button above to add your first project!</p>
                ) : (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div key={project._id} className="bg-slate-50 rounded-lg border border-slate-200 p-6 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-primary-dark">{project.title}</h4>
                            <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">
                              {project.github_link}
                            </a>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary-dark">{project.project_score || 0}</div>
                            <p className="text-xs text-slate-500">Project Score</p>
                          </div>
                        </div>

                        <p className="text-slate-600 text-sm mb-3">{project.description}</p>

                        {/* Tech Stack */}
                        {project.tech_stack && project.tech_stack.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {project.tech_stack.map((tech, idx) => (
                              <span key={idx} className="px-3 py-1 bg-white border border-slate-300 text-slate-700 rounded-full text-xs font-medium">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Project Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
                          <div>
                            <p className="text-slate-500">Total Commits</p>
                            <p className="font-semibold text-slate-900">{project.total_commits || 0}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Your Commits</p>
                            <p className="font-semibold text-slate-900">{project.user_commits || 0}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Visibility</p>
                            <p className="font-semibold text-slate-900">{project.is_public ? 'Public' : 'Private'}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Status</p>
                            <p className={`font-semibold ${project.verified ? 'text-green-600' : 'text-yellow-600'}`}>
                              {project.verified ? '✓ Verified' : 'Pending'}
                            </p>
                          </div>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteProject(project._id)}
                          disabled={verifying}
                          className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-primary-dark">Edit Profile</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-500 hover:text-slate-700 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Tabs */}
              <div className="flex gap-4 border-b border-slate-200">
                <button
                  onClick={() => setEditModalTab('basic')}
                  className={`pb-4 px-4 font-semibold border-b-2 transition-colors ${
                    editModalTab === 'basic'
                      ? 'border-primary-dark text-primary-dark'
                      : 'border-transparent text-slate-600 hover:text-primary-dark'
                  }`}
                >
                  Basic Info
                </button>
                {canAccessRestrictedFeatures && (
                  <>
                    <button
                      onClick={() => setEditModalTab('skills')}
                      className={`pb-4 px-4 font-semibold border-b-2 transition-colors ${
                        editModalTab === 'skills'
                          ? 'border-primary-dark text-primary-dark'
                          : 'border-transparent text-slate-600 hover:text-primary-dark'
                      }`}
                    >
                      Skills
                    </button>
                    <button
                      onClick={() => setEditModalTab('resume')}
                      className={`pb-4 px-4 font-semibold border-b-2 transition-colors ${
                        editModalTab === 'resume'
                          ? 'border-primary-dark text-primary-dark'
                          : 'border-transparent text-slate-600 hover:text-primary-dark'
                      }`}
                    >
                      Resume
                    </button>
                  </>
                )}
                {!canAccessRestrictedFeatures && (
                  <>
                    <button className="pb-4 px-4 font-semibold text-slate-400 opacity-50 cursor-not-allowed">
                      Skills 🔒
                    </button>
                    <button className="pb-4 px-4 font-semibold text-slate-400 opacity-50 cursor-not-allowed">
                      Resume 🔒
                    </button>
                  </>
                )}
              </div>

              {/* Form Fields */}
              {editModalTab === 'basic' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={authUser?.name || ''}
                      disabled
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={authUser?.email || ''}
                      disabled
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-100"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Degree
                      </label>
                      <input
                        type="text"
                        value={editForm.education?.degree || ''}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            education: { ...editForm.education, degree: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
                        placeholder="B.Tech Computer Science"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Institution
                      </label>
                      <input
                        type="text"
                        value={editForm.education?.institution || ''}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            education: { ...editForm.education, institution: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
                        placeholder="MIT"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Graduation Year
                      </label>
                      <input
                        type="number"
                        value={editForm.education?.year || ''}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            education: { ...editForm.education, year: parseInt(e.target.value) },
                          })
                        }
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
                        placeholder="2024"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      About
                    </label>
                    <textarea
                      value={editForm.about}
                      onChange={(e) => setEditForm({ ...editForm, about: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
                      placeholder="Tell us about yourself..."
                      rows={4}
                      maxLength={500}
                    />
                    <p className="text-sm text-slate-500 mt-2">
                      {editForm.about.length}/500 characters
                    </p>
                  </div>
                </div>
              )}

              {editModalTab === 'skills' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Your Skills
                    </label>
                    <p className="text-sm text-slate-500 mb-3">
                      Type a skill and press Enter to add it. Skills used in your verified GitHub projects automatically receive bonus scoring.
                    </p>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSkill();
                          }
                        }}
                        className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
                        placeholder="e.g., React, Node.js, Python"
                      />
                      <button
                        onClick={handleAddSkill}
                        className="px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-slate-800"
                      >
                        Add
                      </button>
                    </div>
                    {editForm.skills && editForm.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {editForm.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
                          >
                            {typeof skill === 'object' ? skill.name : skill}
                            <button
                              onClick={() => handleRemoveSkill(idx)}
                              className="text-blue-700 hover:text-blue-900"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Skill Score Display */}
                  {scoreCard && (
                    <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-semibold text-slate-700">Skills Score</p>
                        <p className="text-sm font-semibold text-slate-700">
                          {scoreCard.skills || 0}/40
                        </p>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(scoreCard.skills || 0) / 40 * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        Scoring: declaration (20%) + resume mention (30%) + project usage (50%) per skill
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleSaveProfile}
                    disabled={verifying}
                    className="w-full px-6 py-3 bg-primary-dark text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 font-semibold"
                  >
                    {verifying ? 'Saving...' : 'Save + re-score'}
                  </button>
                </div>
              )}

              {editModalTab === 'resume' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Upload Resume
                    </label>
                    <p className="text-sm text-slate-500 mb-3">
                      Upload your latest resume in PDF format. It will be automatically scanned for ATS scoring.
                    </p>
                    
                    {profile?.resume_url ? (
                      <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 mb-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-semibold text-slate-900">Current Resume</p>
                            <p className="text-sm text-slate-600">
                              Uploaded {resumeScore?.meta?.scored_at ? new Date(resumeScore.meta.scored_at).toLocaleDateString() : 'recently'}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-4xl font-bold text-primary-dark">{resumeScore.final_score || 0}</div>
                            <p className="text-xs text-slate-500">/100</p>
                          </div>
                        </div>
                        <a
                          href={profile.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-slate-800 text-sm"
                        >
                          Download Resume
                        </a>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center mb-4">
                        <div className="text-4xl mb-4">📄</div>
                        <p className="text-slate-600 mb-4">Upload your resume</p>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleResumeUpload}
                          disabled={resumeUploading}
                          className="mx-auto"
                        />
                        <p className="text-xs text-slate-500 mt-2">
                          Supported format: PDF only. Max file size: 5MB.
                        </p>
                      </div>
                    )}

                    {/* Replace Resume Section */}
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                      <p className="font-semibold text-slate-900 mb-2">Replace resume</p>
                      <p className="text-sm text-slate-600 mb-4">
                        Upload a new PDF resume. It will be automatically scored by our ATS engine.
                      </p>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleResumeUpload}
                        disabled={resumeUploading}
                        className="mx-auto"
                      />
                      <p className="text-xs text-slate-500 mt-2">
                        Supported format: PDF only. Max file size: 5MB. Your resume will be re-scored immediately after upload.
                      </p>
                    </div>
                  </div>

                  {/* Resume Score Display */}
                  {resumeScore && (
                    <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-semibold text-slate-700">Resume Score</p>
                        <p className="text-sm font-semibold text-slate-700">
                          {scoreCard?.resume || 0}/30
                        </p>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(scoreCard?.resume || 0) / 30 * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!canAccessRestrictedFeatures && editModalTab !== 'basic' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ This section is locked until GitHub verification is complete.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6 flex justify-end gap-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-6 py-2 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={verifying}
                className="px-6 py-2 bg-primary-dark text-white rounded-lg hover:bg-slate-800 disabled:opacity-50"
              >
                {verifying ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-primary-dark">Add a project</h2>
              <button
                onClick={() => setShowProjectModal(false)}
                className="text-slate-500 hover:text-slate-700 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Project title
                </label>
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
                  placeholder="Project title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  GitHub repository URL
                </label>
                <input
                  type="url"
                  value={projectForm.github_link}
                  onChange={(e) => setProjectForm({ ...projectForm, github_link: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
                  placeholder="https://github.com/username/repo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Add tech stack (press Enter)
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={projectTechInput}
                    onChange={(e) => setProjectTechInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTechStack();
                      }
                    }}
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
                    placeholder="e.g., React, Node.js, MongoDB"
                  />
                  <button
                    onClick={handleAddTechStack}
                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
                  >
                    Add
                  </button>
                </div>
                {projectForm.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {projectForm.tech_stack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
                      >
                        {tech}
                        <button
                          onClick={() => handleRemoveTechStack(idx)}
                          className="text-blue-700 hover:text-blue-900"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Project description (max 500 chars)
                </label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
                  placeholder="Describe your project..."
                  rows={4}
                  maxLength={500}
                />
                <p className="text-sm text-slate-500 mt-2">
                  {projectForm.description.length}/500 characters
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6 flex justify-end gap-4">
              <button
                onClick={() => setShowProjectModal(false)}
                className="px-6 py-2 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProject}
                disabled={verifying || !projectForm.title || !projectForm.github_link || !projectForm.description}
                className="px-6 py-2 bg-primary-dark text-white rounded-lg hover:bg-slate-800 disabled:opacity-50"
              >
                {verifying ? 'Submitting...' : 'Submit and verify'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePageNew;
