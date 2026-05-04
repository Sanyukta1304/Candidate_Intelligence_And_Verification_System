import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Footer } from '../components/Footer';

export const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleRoleRedirect = (role) => {
    navigate(`/register?role=${role}`);
  };

  return (
    <div className="min-h-screen bg-white-primary">
      {/* HERO SECTION */}
      <section className="bg-grey-mild border-b border-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-block px-5 py-2 rounded-full bg-teal-light text-primary-teal text-caption font-bold mb-8">
              Candidate Intelligence Platform
            </div>

            {/* Heading */}
            <h1 className="text-heading-1 md:text-5xl font-bold text-primary-navy leading-tight mb-6">
              Beyond the CV.
              <br />
              Data-Driven Talent Verification.
            </h1>

            {/* Subtext */}
            <p className="text-body text-slate-grey max-w-3xl mx-auto leading-relaxed mb-10">
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
                  className="px-10 py-4 bg-primary-teal text-white-primary rounded-button font-semibold hover:bg-teal-600 transition text-caption"
                >
                  I am a candidate →
                </button>

                {/* Recruiter Button */}
                <button
                  onClick={() => handleRoleRedirect('recruiter')}
                  className="px-10 py-4 border border-primary-teal text-primary-teal rounded-button font-semibold hover:bg-teal-light transition text-caption"
                >
                  I am a recruiter →
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-white-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-label text-slate-grey mb-12 uppercase tracking-wider">
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
                className="bg-white-primary rounded-card p-4 border border-slate-300 text-center shadow-soft"
              >
                <h2 className="text-2xl font-bold text-primary-teal mb-6">
                  {item.number}
                </h2>

                <h3 className="heading-4 text-primary-navy mb-3">
                  {item.title}
                </h3>

                <p className="text-caption text-slate-grey leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOWER SPLIT SECTION */}
      <section className="bg-grey-mild border-y border-slate-300">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2">
          {/* Left Side */}
          <div className="p-12 border-r border-slate-300">
            <p className="text-label text-primary-teal font-bold mb-5 uppercase tracking-wider">
              For Candidates
            </p>

            <h2 className="heading-3 text-primary-navy mb-4">
              Prove what you can build
            </h2>

            <p className="text-body text-slate-grey leading-relaxed mb-8 max-w-lg">
              Showcase your skills through verified GitHub projects and get
              scored on real contributions. Stand out with credibility, not
              just keywords.
            </p>

            {!isAuthenticated && (
              <button
                onClick={() => handleRoleRedirect('candidate')}
                className="inline-block px-8 py-4 border border-primary-teal text-primary-teal rounded-button font-semibold hover:bg-teal-light transition text-caption"
              >
                Create candidate profile →
              </button>
            )}
          </div>

          {/* Right Side */}
          <div className="p-12">
            <p className="text-label text-primary-teal font-bold mb-5 uppercase tracking-wider">
              For Recruiters
            </p>

            <h2 className="heading-3 text-primary-navy mb-4">
              Find verified talent instantly
            </h2>

            <p className="text-body text-slate-grey leading-relaxed mb-8 max-w-lg">
              Search candidates by credibility score, filter by verified GitHub
              profiles, and discover developers who can actually deliver.
            </p>

            {!isAuthenticated && (
              <button
                onClick={() => handleRoleRedirect('recruiter')}
                className="inline-block px-8 py-4 border border-primary-teal text-primary-teal rounded-button font-semibold hover:bg-teal-light transition text-caption"
              >
                Access recruiter dashboard →
              </button>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};