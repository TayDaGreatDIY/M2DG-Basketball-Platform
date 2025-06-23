import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-orange-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="text-white text-2xl font-bold">
                🏀 M2DG
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-white hover:text-orange-200 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/courts"
                  className="text-white hover:text-orange-200 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Courts
                </Link>
                <Link
                  to="/tournaments"
                  className="text-white hover:text-orange-200 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Tournaments
                </Link>
                <Link
                  to="/teams"
                  className="text-white hover:text-orange-200 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Teams
                </Link>
                <Link
                  to="/profile"
                  className="text-white hover:text-orange-200 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-orange-700 hover:bg-orange-800 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-orange-200 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-orange-700 hover:bg-orange-800 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;