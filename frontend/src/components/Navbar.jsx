// Navbar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-primary-navy border-b border-slate-300 sticky top-0 z-50 shadow-soft" style={{ backgroundColor: 'var(--color-navbar-bg)', borderBottomColor: 'var(--color-border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-heading-3 font-bold text-white-primary flex-shrink-0">
            CredVerify
          </Link>

          {/* Public Navbar */}
          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/about"
                className="nav-item text-white-primary hover:text-primary-teal transition"
              >
                About
              </Link>

              <Link
                to="/login"
                className="nav-item text-white-primary hover:text-primary-teal transition"
              >
                Login
              </Link>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="theme-toggle-btn"
                aria-label="Toggle theme"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? '🌙' : '☀️'}
              </button>

              <Link
                to="/register"
                className="px-6 py-2.5 bg-primary-teal text-white-primary rounded-button font-semibold hover:bg-teal-600 transition text-navbar"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-end gap-2 w-full">
              {/* All Authenticated Navigation Items */}
              <Link
                to="/dashboard"
                className="nav-item text-white-primary hover:text-primary-teal transition"
              >
                Dashboard
              </Link>

              {user?.role === 'recruiter' && (
                <>
                  <Link
                    to="/recruiter/search"
                    className="nav-item text-white-primary hover:text-primary-teal transition"
                  >
                    Search
                  </Link>

                  <Link
                    to="/recruiter/starred"
                    className="nav-item text-white-primary hover:text-primary-teal transition"
                  >
                    Starred
                  </Link>
                </>
              )}

              {user?.role === 'candidate' && (
                <Link
                  to="/notifications"
                  className="nav-item text-white-primary hover:text-primary-teal transition"
                >
                  Notifications
                </Link>
              )}

              <Link
                to={user?.role === 'recruiter' ? '/recruiter/profile' : '/profile'}
                className="nav-item text-white-primary hover:text-primary-teal transition"
              >
                Profile
              </Link>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="theme-toggle-btn"
                aria-label="Toggle theme"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? '🌙' : '☀️'}
              </button>

              {/* Circular Profile Avatar */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-teal text-white-primary font-semibold text-sm cursor-pointer hover:bg-teal-600 transition flex-shrink-0">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="nav-item text-white-primary hover:text-primary-teal transition"
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