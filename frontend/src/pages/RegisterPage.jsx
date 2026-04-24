import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../api/authService';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, setAuthError, error } = useAuth();
  const [loading, setLoading] = useState(false);

  // auto-select role from landing page buttons
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') || 'candidate';

  const [role, setRole] = useState(defaultRole);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setAuthError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register(
        formData.name,
        formData.email,
        formData.password,
        role
      );

      register(response.user, response.token);

      // role based redirect
      const dashboardRoute =
        response.user.role === 'candidate'
          ? '/candidate/profile'
          : '/recruiter/dashboard';

      navigate(dashboardRoute);
    } catch (err) {
      setAuthError(
        err.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-semibold text-black mb-3">
              Create your account
            </h1>

            <p className="text-slate-600">
              Already have one?{' '}
              <Link
                to="/login"
                className="text-blue-600 font-medium hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full name"
              required
              className="w-full px-5 py-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full px-5 py-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Password */}
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min. 8 characters"
              required
              className="w-full px-5 py-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Confirm Password */}
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              required
              className="w-full px-5 py-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Role Selection */}
            <div className="pt-2">
              <p className="text-black font-medium mb-4">I am a</p>

              <div className="grid grid-cols-2 gap-4">
                {/* Candidate */}
                <button
                  type="button"
                  onClick={() => setRole('candidate')}
                  className={`py-4 rounded-2xl border font-medium text-lg transition ${
                    role === 'candidate'
                      ? 'border-blue-500 bg-blue-50 text-black'
                      : 'border-slate-200 bg-white text-black'
                  }`}
                >
                  Candidate
                </button>

                {/* Recruiter */}
                <button
                  type="button"
                  onClick={() => setRole('recruiter')}
                  className={`py-4 rounded-2xl border font-medium text-lg transition ${
                    role === 'recruiter'
                      ? 'border-blue-500 bg-blue-50 text-black'
                      : 'border-slate-200 bg-white text-black'
                  }`}
                >
                  Recruiter
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-4 bg-black text-white rounded-2xl font-semibold text-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};