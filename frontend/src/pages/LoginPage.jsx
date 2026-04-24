import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../api/authService';

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

      // role based redirect
      const dashboardRoute =
        response.user.role === 'candidate'
          ? '/candidate/profile'
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
    <div className="min-h-screen bg-[#F4F7FB] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-semibold text-black mb-3">
              Welcome back
            </h1>

            <p className="text-slate-600">
              New here?{' '}
              <Link
                to="/register"
                className="text-blue-600 font-medium hover:underline"
              >
                Create an account
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
              placeholder="Password"
              required
              className="w-full px-5 py-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Forgot Password */}
            <div className="flex justify-end -mt-1">
              <Link
                to="/forgot-password"
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-4 bg-black text-white rounded-2xl font-semibold text-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Log in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};