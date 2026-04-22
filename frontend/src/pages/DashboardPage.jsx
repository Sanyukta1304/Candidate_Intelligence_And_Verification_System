import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-soft-lg p-8 mb-8">
        <h1 className="text-3xl font-bold text-primary-dark mb-2">
          Welcome, {user?.name}!
        </h1>
        <p className="text-slate-600">
          You are logged in as a <span className="font-semibold capitalize">{user?.role}</span>
        </p>
      </div>

      {/* Role-Based Content */}
      {user?.role === 'candidate' && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Profile Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-soft-lg p-8">
            <h2 className="text-xl font-semibold text-primary-dark mb-4">Your Profile</h2>
            <p className="text-slate-600 mb-6">Build and verify your professional profile.</p>
            <button className="w-full bg-primary-dark text-white font-semibold py-3 rounded-lg hover:bg-slate-800 transition-colors">
              Edit Profile
            </button>
          </div>

          {/* Projects Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-soft-lg p-8">
            <h2 className="text-xl font-semibold text-primary-dark mb-4">Your Projects</h2>
            <p className="text-slate-600 mb-6">Showcase your best work and achievements.</p>
            <button className="w-full bg-primary-dark text-white font-semibold py-3 rounded-lg hover:bg-slate-800 transition-colors">
              Manage Projects
            </button>
          </div>
        </div>
      )}

      {user?.role === 'recruiter' && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Browse Candidates Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-soft-lg p-8">
            <h2 className="text-xl font-semibold text-primary-dark mb-4">Browse Candidates</h2>
            <p className="text-slate-600 mb-6">Find and shortlist qualified candidates.</p>
            <button className="w-full bg-primary-dark text-white font-semibold py-3 rounded-lg hover:bg-slate-800 transition-colors">
              View Candidates
            </button>
          </div>

          {/* Shortlist Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-soft-lg p-8">
            <h2 className="text-xl font-semibold text-primary-dark mb-4">Your Shortlist</h2>
            <p className="text-slate-600 mb-6">Manage your shortlisted candidates.</p>
            <button className="w-full bg-primary-dark text-white font-semibold py-3 rounded-lg hover:bg-slate-800 transition-colors">
              View Shortlist
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
