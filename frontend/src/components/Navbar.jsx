<<<<<<< HEAD
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
    <nav className="bg-white shadow-soft sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <div className="text-2xl font-bold text-primary-dark">
              CredVerify
            </div>
          </Link>
=======
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? "text-black font-semibold" : "text-gray-500";

  const getDashboardLink = () => {
    if (user?.role === 'recruiter') {
      return '/recruiter/dashboard';
    }
    return '/dashboard';
  };

  return (
    <div className="flex justify-between items-center px-10 py-4 border-b bg-white">

<<<<<<< HEAD
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
>>>>>>> 57a1e520ceaf0e759720d82a067372c2c675ec15

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
<<<<<<< HEAD
      </div>
    </nav>
  );
};
=======
=======
      <h1 className="text-lg font-semibold">CredVerify</h1>

      <div className="flex gap-8">
        <Link to="/dashboard" className={isActive("/dashboard")}>Dashboard</Link>
        <Link to="/profile" className={isActive("/profile")}>Profile</Link>
        <Link to="/notifications" className={isActive("/notifications")}>
          Notifications <span className="text-red-500 text-sm">(3)</span>
        </Link>
>>>>>>> 996b755ed1bb6a11233e04b926a21af9f6d3bb42
      </div>

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full">
          JD
        </div>
        <button className="text-gray-600">Logout</button>
      </div>

    </div>
  );
};

export default Navbar;
>>>>>>> 57a1e520ceaf0e759720d82a067372c2c675ec15
