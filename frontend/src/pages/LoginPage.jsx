import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../api/authService';
import { Footer } from '../components/Footer';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, setAuthError, error } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    setLoading(true);

    try {
      const response = await authService.login(
        formData.email,
        formData.password
      );

      login(response.user, response.token);

      // role based redirect - direct to dashboard, not profile
      const dashboardRoute =
        response.user.role === 'candidate'
          ? '/candidate/dashboard'
          : '/recruiter/dashboard';

      navigate(dashboardRoute);
    } catch (err) {
      setAuthError(
        err.message || 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-grey-mild flex flex-col">
      <div className="flex-grow flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        {/* Card */}
        <div className="bg-white-primary border border-slate-300 rounded-card p-4 shadow-soft">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="heading-2 text-primary-navy mb-3">
              Welcome back
            </h1>

            <p className="text-body text-slate-grey">
              New here?{' '}
              <Link
                to="/register"
                className="text-primary-teal font-bold hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-button border border-status-error bg-status-error">
              <p className="text-caption text-status-error-text">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full px-2.5 py-2.5 border border-slate-300 rounded-input focus:outline-none focus:ring-2 focus:ring-primary-teal focus:border-transparent text-caption"
            />

            {/* Password */}
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full px-2.5 py-2.5 border border-slate-300 rounded-input focus:outline-none focus:ring-2 focus:ring-primary-teal focus:border-transparent text-caption"
            />

            {/* Forgot Password */}
            <div className="flex justify-end -mt-1">
              <Link
                to="/forgot-password"
                className="text-primary-teal text-caption font-bold hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 bg-primary-teal text-white-primary rounded-button font-semibold text-body hover:bg-teal-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Log in'}
            </button>
          </form>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};