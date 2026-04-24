// AboutPage.jsx

import React from 'react';

export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-20">
        {/* Small Label */}
        <p className="text-sm tracking-[0.2em] uppercase text-slate-500 mb-6">
          About This Project
        </p>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl font-semibold text-black leading-tight mb-8">
          A data driven candidate verification platform.
        </h1>

        {/* Description */}
        <p className="text-lg text-slate-600 leading-relaxed max-w-4xl mb-14">
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
    <div className="bg-[#F1F5F9] rounded-2xl p-8">
      <h2 className="text-4xl font-semibold text-black mb-2">100</h2>
      <p className="text-slate-600">Max credibility score</p>
    </div>

    {/* Card 2 */}
    <div className="bg-[#F1F5F9] rounded-2xl p-8">
      <h2 className="text-4xl font-semibold text-black mb-2">3</h2>
      <p className="text-slate-600">Scoring dimensions</p>
    </div>
  </div>
</div>

        {/* Scoring Section */}
        <div>
          <h2 className="text-2xl font-semibold text-black mb-8">
            How scoring works
          </h2>

          

<div className="space-y-6">
  {/* Skills */}
  <div className="bg-[#F5F5F5] rounded-2xl px-6 py-5 flex items-center gap-5">
    <div className="w-14 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>

    <div>
      <h3 className="text-xl font-semibold text-black">
        Skills — 40%
      </h3>
      <p className="text-slate-600 text-sm mt-1">
        Based on declared skills, evidence from projects, and keyword matching
      </p>
    </div>
  </div>

  {/* Resume */}
  <div className="bg-[#F5F5F5] rounded-2xl px-6 py-5 flex items-center gap-5">
    <div className="w-14 h-2 rounded-full bg-emerald-500 flex-shrink-0"></div>

    <div>
      <h3 className="text-xl font-semibold text-black">
        Resume — 30%
      </h3>
      <p className="text-slate-600 text-sm mt-1">
        ATS parsing, section completeness, keyword density, and formatting quality
      </p>
    </div>
  </div>

  {/* Projects */}
  <div className="bg-[#F5F5F5] rounded-2xl px-6 py-5 flex items-center gap-5">
    <div className="w-14 h-2 rounded-full bg-violet-500 flex-shrink-0"></div>

    <div>
      <h3 className="text-xl font-semibold text-black">
        Projects — 30%
      </h3>
      <p className="text-slate-600 text-sm mt-1">
        GitHub verification, commit activity, documentation, and repo visibility
      </p>
    </div>
  </div>
</div>
        </div>
      </div>
    </div>
  );
};