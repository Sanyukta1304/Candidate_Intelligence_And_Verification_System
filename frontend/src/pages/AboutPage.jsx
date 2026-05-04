// AboutPage.jsx

import React from 'react';
import { Footer } from '../components/Footer';

export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-grey-mild flex flex-col">
      <div className="flex-grow">
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-20">
        {/* Small Label */}
        <p className="text-label tracking-wider uppercase text-slate-grey mb-6">
          About This Project
        </p>

        {/* Main Heading */}
        <h1 className="heading-1 md:text-5xl font-bold text-primary-navy leading-tight mb-8">
          A data driven candidate verification platform.
        </h1>

        {/* Description */}
        <p className="text-body text-slate-grey leading-relaxed max-w-4xl mb-14">
          CredVerify is a dual-role platform designed to bridge the gap between
          candidates and recruiters through verified credentials and transparent
          scoring. Candidates showcase their skills through GitHub projects and
          optimized resumes, while recruiters discover talent based on
          credibility metrics instead of guesswork.
        </p>

        {/* Stats Cards */}
        <div className="flex justify-center">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl w-full">
    {/* Card 1 */}
    <div className="bg-white-primary rounded-card p-4 border border-slate-300 shadow-soft">
      <h2 className="text-4xl font-bold text-primary-navy mb-2">100</h2>
      <p className="text-body text-slate-grey">Max credibility score</p>
    </div>

    {/* Card 2 */}
    <div className="bg-white-primary rounded-card p-4 border border-slate-300 shadow-soft">
      <h2 className="text-4xl font-bold text-primary-navy mb-2">3</h2>
      <p className="text-body text-slate-grey">Scoring dimensions</p>
    </div>
  </div>
</div>

        {/* Scoring Section */}
        <div>
          <h2 className="heading-2 text-primary-navy mb-8">
            How scoring works
          </h2>

          

<div className="space-y-6">
  {/* Skills */}
  <div className="bg-white-primary rounded-card px-4 py-4 flex items-center gap-5 border border-slate-300 shadow-soft">
    <div className="w-14 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>

    <div>
      <h3 className="heading-4 text-primary-navy">
        Skills — 40%
      </h3>
      <p className="text-caption text-slate-grey mt-1">
        Based on declared skills, evidence from projects, and keyword matching
      </p>
    </div>
  </div>

  {/* Resume */}
  <div className="bg-white-primary rounded-card px-4 py-4 flex items-center gap-5 border border-slate-300 shadow-soft">
    <div className="w-14 h-2 rounded-full bg-emerald-500 flex-shrink-0"></div>

    <div>
      <h3 className="heading-4 text-primary-navy">
        Resume — 30%
      </h3>
      <p className="text-caption text-slate-grey mt-1">
        ATS parsing, section completeness, keyword density, and formatting quality
      </p>
    </div>
  </div>

  {/* Projects */}
  <div className="bg-white-primary rounded-card px-4 py-4 flex items-center gap-5 border border-slate-300 shadow-soft">
    <div className="w-14 h-2 rounded-full bg-violet-500 flex-shrink-0"></div>

    <div>
      <h3 className="heading-4 text-primary-navy">
        Projects — 30%
      </h3>
      <p className="text-caption text-slate-grey mt-1">
        GitHub verification, commit activity, documentation, and repo visibility
      </p>
    </div>
  </div>
</div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};