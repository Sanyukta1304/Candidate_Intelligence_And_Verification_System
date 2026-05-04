import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { recruiterService } from '../../api/recruiterService';
import { CandidateCard } from '../../components/recruiter/CandidateCard';
import { Card } from '../../components/UI';
import { Footer } from '../../components/Footer';

/**
 * StarredCandidatesPage
 * Display grid of starred/saved candidates
 */
const StarredCandidatesPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [starredCandidates, setStarredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'recruiter') {
      loadStarredCandidates();
    }
  }, [isAuthenticated, user]);

  const loadStarredCandidates = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await recruiterService.getStarredCandidates();
      setStarredCandidates(response?.data || response || []);
    } catch (err) {
      console.error('Failed to load starred candidates:', err);
      setError('Failed to load starred candidates');
    } finally {
      setLoading(false);
    }
  };

  const handleStarToggle = async (candidateId) => {
    try {
      await recruiterService.unstarCandidate(candidateId);
      setStarredCandidates((prev) =>
        prev.filter((c) => (c._id || c.id) !== candidateId)
      );
    } catch (err) {
      console.error('Failed to unstar candidate:', err);
      setError('Failed to update candidate');
    }
  };

  if (!isAuthenticated || user?.role !== 'recruiter') {
    return (
      <div className="p-6">
        <p className="text-slate-600">Access denied. This page is for recruiters only.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-dark">⭐ Starred Candidates</h1>
          <p className="text-slate-600 mt-2">Your saved talent pool</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, idx) => (
              <Card key={idx} className="p-6 animate-pulse">
                <div className="h-16 bg-slate-200 rounded-full mb-4 w-16"></div>
                <div className="h-4 bg-slate-200 rounded mb-2 w-32"></div>
                <div className="h-3 bg-slate-100 rounded w-24"></div>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && starredCandidates.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-4xl mb-4">⭐</p>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No starred candidates yet
            </h3>
            <p className="text-slate-600">
              Start searching for candidates and star your favorites to build your talent pool.
            </p>
          </Card>
        )}

        {/* Grid of Candidates */}
        {!loading && starredCandidates.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {starredCandidates.map((candidate, idx) => (
              <div key={idx}>
                <CandidateCard
                  candidate={candidate}
                  isStarred={true}
                  onStarToggle={handleStarToggle}
                />
              </div>
            ))}
          </div>
        )}

        {/* Count Summary */}
        {!loading && starredCandidates.length > 0 && (
          <div className="mt-8 text-center text-slate-600 text-sm">
            Total: {starredCandidates.length} candidate{starredCandidates.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default StarredCandidatesPage;
