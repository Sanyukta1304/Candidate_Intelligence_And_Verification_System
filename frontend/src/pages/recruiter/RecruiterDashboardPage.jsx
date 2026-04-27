import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { recruiterService } from '../../api/recruiterService';
import { RecruiterStats } from '../../components/recruiter/RecruiterStats';
import { ActivityFeed } from '../../components/recruiter/ActivityFeed';
import { QuickLinks } from '../../components/recruiter/QuickLinks';
import { PrivateRoute } from '../../components/PrivateRoute';

/**
 * RecruiterDashboardPage
 * Main dashboard for recruiters with stats, activity, and quick links
 */
const RecruiterDashboardPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'recruiter') {
      loadDashboardData();
    }
  }, [isAuthenticated, user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch stats and activities in parallel
      const [statsData, activityData] = await Promise.all([
        recruiterService.getStats(),
        recruiterService.getActivity(10),
      ]);

      console.log('Stats:', statsData);
      console.log('Activity:', activityData);

      setStats(statsData?.data || statsData);
      setActivities(activityData?.data || activityData || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-dark">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-slate-600 mt-2">
            Here's your recruiter dashboard for today
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <RecruiterStats
          profilesViewed={stats?.profilesViewed || 0}
          profilesStarred={stats?.profilesStarred || 0}
          totalCandidates={stats?.totalCandidates || 0}
          githubVerified={stats?.githubVerified || 0}
          loading={loading}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Activity Feed */}
          <div className="lg:col-span-2">
            <ActivityFeed activities={activities} loading={loading} />
          </div>

          {/* Right Column - Quick Links */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-primary-dark">Quick Actions</h2>
              <QuickLinks />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboardPage;
