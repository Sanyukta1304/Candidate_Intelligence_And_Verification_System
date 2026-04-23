import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../api/authService';

<<<<<<< HEAD
export const LoginPage = () => {
=======
const LoginPage = () => {
>>>>>>> 57a1e520ceaf0e759720d82a067372c2c675ec15
  const navigate = useNavigate();
  const { login, setAuthError, error } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login(formData.email, formData.password);
      login(response.user, response.token);
      navigate('/dashboard');
    } catch (err) {
      setAuthError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = () => {
    // Redirect to backend GitHub OAuth endpoint
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/github`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-light px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-soft-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary-dark mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-500">
              Sign in to your CredVerify account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-primary-dark text-white font-semibold py-3 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">or</span>
            </div>
          </div>

          {/* GitHub Button */}
          <button
            type="button"
            onClick={handleGithubLogin}
            className="w-full border border-slate-200 text-slate-700 font-semibold py-3 rounded-lg hover:bg-primary-light transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.544 2.914 1.194.092-.929.35-1.544.636-1.9-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.817c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.138 18.192 20 14.438 20 10.017 20 4.484 15.522 0 10 0z" clipRule="evenodd" />
            </svg>
            Continue with GitHub
          </button>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-slate-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-dark font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
<<<<<<< HEAD
=======

export default LoginPage;
>>>>>>> 57a1e520ceaf0e759720d82a067372c2c675ec15
