import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleRoleRedirect = (role) => {
    navigate(`/register?role=${role}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="bg-[#F4F7FB] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-block px-5 py-2 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mb-8">
              Candidate Intelligence Platform
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-6xl font-bold text-black leading-tight mb-6">
              Beyond the CV.
              <br />
              Data-Driven Talent Verification.
            </h1>

            {/* Subtext */}
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed mb-10">
              A platform that scores candidates based on verified skills,
              GitHub contributions, and ATS-optimized resumes. Connect talent
              with recruiters through trust and transparency.
            </p>

            {/* CTA Buttons */}
            {!isAuthenticated && (
              <div className="flex flex-wrap justify-center gap-4">
                {/* Candidate Button */}
                <button
                  onClick={() => handleRoleRedirect('candidate')}
                  className="px-10 py-4 bg-black text-white rounded-2xl font-semibold hover:opacity-90 transition"
                >
                  I am a candidate →
                </button>

                {/* Recruiter Button */}
                <button
                  onClick={() => handleRoleRedirect('recruiter')}
                  className="px-10 py-4 border border-slate-300 text-black rounded-2xl font-semibold hover:bg-white transition"
                >
                  I am a recruiter →
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm tracking-[0.2em] text-slate-500 mb-12 uppercase">
            How It Works
          </p>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                number: '01',
                title: 'Build profile',
                desc:
                  'Create your candidate account and add your basic information',
              },
              {
                number: '02',
                title: 'Link GitHub',
                desc:
                  'Verify your GitHub account to unlock full scoring features',
              },
              {
                number: '03',
                title: 'Submit projects',
                desc:
                  'Add your projects for automated scoring and verification',
              },
              {
                number: '04',
                title: 'Get scored',
                desc:
                  'Receive your credibility score and get discovered by recruiters',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-[#F7F9FC] rounded-2xl p-8 border border-slate-100 text-center"
              >
                <h2 className="text-4xl font-semibold text-black mb-6">
                  {item.number}
                </h2>

                <h3 className="text-lg font-semibold text-black mb-3">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOWER SPLIT SECTION */}
      <section className="bg-[#F4F7FB] border-y border-slate-200">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2">
          {/* Left Side */}
          <div className="p-12 border-r border-slate-200">
            <p className="text-sm uppercase tracking-wider text-blue-600 font-medium mb-5">
              For Candidates
            </p>

            <h2 className="text-3xl font-semibold text-black mb-4">
              Prove what you can build
            </h2>

            <p className="text-slate-600 leading-relaxed mb-8 max-w-lg">
              Showcase your skills through verified GitHub projects and get
              scored on real contributions. Stand out with credibility, not
              just keywords.
            </p>

            {!isAuthenticated && (
              <button
                onClick={() => handleRoleRedirect('candidate')}
                className="inline-block px-8 py-4 border border-slate-300 rounded-2xl font-medium hover:bg-white transition"
              >
                Create candidate profile →
              </button>
            )}
          </div>

          {/* Right Side */}
          <div className="p-12">
            <p className="text-sm uppercase tracking-wider text-green-600 font-medium mb-5">
              For Recruiters
            </p>

            <h2 className="text-3xl font-semibold text-black mb-4">
              Find verified talent instantly
            </h2>

            <p className="text-slate-600 leading-relaxed mb-8 max-w-lg">
              Search candidates by credibility score, filter by verified GitHub
              profiles, and discover developers who can actually deliver.
            </p>

            {!isAuthenticated && (
              <button
                onClick={() => handleRoleRedirect('recruiter')}
                className="inline-block px-8 py-4 border border-slate-300 rounded-2xl font-medium hover:bg-white transition"
              >
                Access recruiter dashboard →
              </button>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#F7F9FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center items-center">
          <div className="text-slate-600 text-sm">
            © 2026 CredVerify. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};