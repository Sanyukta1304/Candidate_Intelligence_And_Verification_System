import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { recruiterService } from '../../api/recruiterService';
import { FilterBar } from '../../components/recruiter/FilterBar';
import { ResultsTable } from '../../components/recruiter/ResultsTable';

/**
 * TalentSearchPage
 * Search and filter candidates with advanced filtering options
 */
const TalentSearchPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter state
  const [skill, setSkill] = useState('');
  const [minScore, setMinScore] = useState(0);
  const [sortBy, setSortBy] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      searchCandidates();
    }
  }, [isAuthenticated]);

  const searchCandidates = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Build request params matching backend API
      const requestParams = {
        ...(filters.skill || skill ? { skill: filters.skill || skill } : {}),
        ...(filters.minScore !== undefined ? { minScore: filters.minScore } : minScore > 0 ? { minScore } : {}),
        ...(filters.sortBy || sortBy ? { sortBy: filters.sortBy || sortBy } : {}),
      };

      const response = await recruiterService.getCandidates(requestParams);
      setCandidates(response?.data || response || []);
    } catch (err) {
      console.error('Failed to search candidates:', err);
      setError('Failed to load candidates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkillChange = (newSkill) => {
    setSkill(newSkill);
    searchCandidates({ skill: newSkill });
  };

  const handleMinScoreChange = (score) => {
    setMinScore(score);
    searchCandidates({ minScore: score });
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    searchCandidates({ sortBy: newSortBy });
  };

  const handleReset = () => {
    setSkill('');
    setMinScore(0);
    setSortBy('desc');
    setSearchQuery('');
    searchCandidates({
      skill: '',
      minScore: 0,
      sortBy: 'desc',
    });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Note: Backend doesn't have name search via this endpoint,
    // but we can filter client-side if needed
  };

  if (!isAuthenticated || user?.role !== 'recruiter') {
    return (
      <div className="p-6">
        <p className="text-slate-600">Access denied. This page is for recruiters only.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-dark">Search Candidates</h1>
          <p className="text-slate-600 mt-2">Find and filter talented candidates by skill and score</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <FilterBar
              skill={skill}
              minScore={minScore}
              sortBy={sortBy}
              onSkillChange={handleSkillChange}
              onMinScoreChange={handleMinScoreChange}
              onSortChange={handleSortChange}
              onReset={handleReset}
            />
          </div>

          {/* Main - Results Table */}
          <div className="lg:col-span-3">
            <ResultsTable candidates={candidates} loading={loading} />
            {!loading && candidates.length > 0 && (
              <div className="mt-4 text-sm text-slate-600 text-center">
                Showing {candidates.length} candidate{candidates.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentSearchPage;
