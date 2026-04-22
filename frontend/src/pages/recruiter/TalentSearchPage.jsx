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
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [minScore, setMinScore] = useState(0);
  const [topOnly, setTopOnly] = useState(false);
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

      const requestFilters = {
        ...filters,
        roles: filters.roles || selectedRoles,
        minScore: filters.minScore !== undefined ? filters.minScore : minScore,
        topOnly: filters.topOnly !== undefined ? filters.topOnly : topOnly,
        search: filters.search || searchQuery,
      };

      const response = await recruiterService.getCandidates(requestFilters);
      setCandidates(response?.data || response || []);
    } catch (err) {
      console.error('Failed to search candidates:', err);
      setError('Failed to load candidates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (roles) => {
    setSelectedRoles(roles);
    searchCandidates({ roles });
  };

  const handleMinScoreChange = (score) => {
    setMinScore(score);
    searchCandidates({ minScore: score });
  };

  const handleTopOnlyChange = (isTop) => {
    setTopOnly(isTop);
    searchCandidates({ topOnly: isTop });
  };

  const handleReset = () => {
    setSelectedRoles([]);
    setMinScore(0);
    setTopOnly(false);
    setSearchQuery('');
    searchCandidates({
      roles: [],
      minScore: 0,
      topOnly: false,
      search: '',
    });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    searchCandidates({ search: query });
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
          <p className="text-slate-600 mt-2">Find and filter talented candidates</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by name, skills, or university..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent"
          />
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
              selectedRoles={selectedRoles}
              minScore={minScore}
              topOnly={topOnly}
              onRoleChange={handleRoleChange}
              onMinScoreChange={handleMinScoreChange}
              onTopOnlyChange={handleTopOnlyChange}
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
