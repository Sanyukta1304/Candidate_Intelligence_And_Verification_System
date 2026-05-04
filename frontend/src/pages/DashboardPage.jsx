import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome Section */}
      <div className="bg-white-primary rounded-card border border-slate-300 shadow-soft-lg p-4 mb-8">
        <h1 className="heading-2 text-primary-navy mb-2">
          Welcome, {user?.name}!
        </h1>
        <p className="text-body text-slate-grey">
          You are logged in as a <span className="font-bold capitalize text-primary-teal">{user?.role}</span>
        </p>
      </div>

      {/* Role-Based Content */}
      {user?.role === 'candidate' && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Profile Card */}
          <div className="bg-white-primary rounded-card border border-slate-300 shadow-soft-lg p-4">
            <h2 className="heading-4 text-primary-navy mb-4">Your Profile</h2>
            <p className="text-body text-slate-grey mb-6">Build and verify your professional profile.</p>
            <button className="w-full bg-primary-teal text-white-primary font-semibold py-2.5 rounded-button hover:bg-teal-600 transition-colors text-body">
              Edit Profile
            </button>
          </div>

          {/* Projects Card */}
          <div className="bg-white-primary rounded-card border border-slate-300 shadow-soft-lg p-4">
            <h2 className="heading-4 text-primary-navy mb-4">Your Projects</h2>
            <p className="text-body text-slate-grey mb-6">Showcase your best work and achievements.</p>
            <button className="w-full bg-primary-teal text-white-primary font-semibold py-2.5 rounded-button hover:bg-teal-600 transition-colors text-body">
              Manage Projects
            </button>
          </div>
        </div>
      )}

      {user?.role === 'recruiter' && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Browse Candidates Card */}
          <div className="bg-white-primary rounded-card border border-slate-300 shadow-soft-lg p-4">
            <h2 className="heading-4 text-primary-navy mb-4">Browse Candidates</h2>
            <p className="text-body text-slate-grey mb-6">Find and shortlist qualified candidates.</p>
            <button className="w-full bg-primary-teal text-white-primary font-semibold py-2.5 rounded-button hover:bg-teal-600 transition-colors text-body">
              View Candidates
            </button>
          </div>

          {/* Shortlist Card */}
          <div className="bg-white-primary rounded-card border border-slate-300 shadow-soft-lg p-4">
            <h2 className="heading-4 text-primary-navy mb-4">Your Shortlist</h2>
            <p className="text-body text-slate-grey mb-6">Manage your shortlisted candidates.</p>
            <button className="w-full bg-primary-teal text-white-primary font-semibold py-2.5 rounded-button hover:bg-teal-600 transition-colors text-body">
              View Shortlist
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
