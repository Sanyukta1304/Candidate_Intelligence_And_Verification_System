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

  const getDashboardLink = () => {
    if (user?.role === 'recruiter') {
      return '/recruiter/dashboard';
    }
    return '/dashboard';
  };

  return (
    <nav className="bg-white shadow-soft sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <div className="text-2xl font-bold text-primary-dark">
              CredVerify
            </div>
          </Link>

          {/* Center Navigation (for authenticated users) */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-6">
              <Link
                to={getDashboardLink()}
                className="text-slate-700 hover:text-primary-dark font-medium transition-colors"
              >
                Dashboard
              </Link>
              {user?.role === 'recruiter' ? (
                <>
                  <Link
                    to="/recruiter/search"
                    className="text-slate-700 hover:text-primary-dark font-medium transition-colors"
                  >
                    Search
                  </Link>
                  <Link
                    to="/recruiter/starred"
                    className="text-slate-700 hover:text-primary-dark font-medium transition-colors"
                  >
                    Starred
                  </Link>
                  <Link
                    to="/recruiter/profile"
                    className="text-slate-700 hover:text-primary-dark font-medium transition-colors"
                  >
                    Profile
                  </Link>
                </>
              ) : (
                <Link
                  to="/profile"
                  className="text-slate-700 hover:text-primary-dark font-medium transition-colors"
                >
                  Profile
                </Link>
              )}
            </div>
          )}

          {/* Right side buttons */}
          <div className="flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2 text-slate-700 font-medium hover:text-primary-dark transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-primary-dark text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-slate-700 font-medium">{user?.name}</span>
                  <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-full capitalize">
                    {user?.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-slate-700 font-medium hover:text-primary-dark transition-colors"
                >
                  Log out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
