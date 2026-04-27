// Navbar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-medium text-black">
            CredVerify
          </Link>

          {/* Public Navbar */}
          {!isAuthenticated ? (
            <div className="flex items-center gap-8">
              <Link
                to="/about"
                className="text-slate-700 font-medium hover:text-black transition"
              >
                About
              </Link>

              <Link
                to="/login"
                className="text-slate-700 font-medium hover:text-black transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-7 py-3 bg-black text-white rounded-2xl font-medium hover:opacity-90 transition"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-end gap-8 w-full">
              {/* All Authenticated Navigation Items */}
              <Link
                to="/dashboard"
                className="text-slate-700 hover:text-black font-medium transition"
              >
                Dashboard
              </Link>

              {user?.role === 'recruiter' && (
                <>
                  <Link
                    to="/recruiter/search"
                    className="text-slate-700 hover:text-black font-medium transition"
                  >
                    Search
                  </Link>

                  <Link
                    to="/recruiter/starred"
                    className="text-slate-700 hover:text-black font-medium transition"
                  >
                    Starred
                  </Link>
                </>
              )}

              {user?.role === 'candidate' && (
                <Link
                  to="/notifications"
                  className="text-slate-700 hover:text-black font-medium transition"
                >
                  Notifications
                </Link>
              )}

              <Link
                to={user?.role === 'recruiter' ? '/recruiter/profile' : '/profile'}
                className="text-slate-700 hover:text-black font-medium transition"
              >
                Profile
              </Link>

              {/* Circular Profile Avatar */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white font-semibold text-sm cursor-pointer hover:bg-blue-600 transition">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="text-slate-700 hover:text-black font-medium transition"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};