import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 shadow-2xl backdrop-blur-md border-b border-orange-400/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="text-white text-2xl font-bold tracking-tight transform group-hover:scale-105 transition-all duration-200">
                🏀 <span className="bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">M2DG</span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/courts">Courts</NavLink>
                <NavLink to="/tournaments">Tournaments</NavLink>
                <NavLink to="/teams">Teams</NavLink>
                <NavLink to="/leaderboards">Rankings</NavLink>
                <NavLink to="/social">Social</NavLink>
                <NavLink to="/mental-health">Wellness</NavLink>
                <NavLink to="/profile">Profile</NavLink>
                <button
                  onClick={handleLogout}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 border border-white/20"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <Link
                  to="/register"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 border border-white/20"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-orange-200 p-2 rounded-md transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-orange-600/95 backdrop-blur-md border-t border-orange-400/20">
          <div className="px-4 py-3 space-y-2">
            {isAuthenticated ? (
              <>
                <MobileNavLink to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</MobileNavLink>
                <MobileNavLink to="/courts" onClick={() => setIsMobileMenuOpen(false)}>Courts</MobileNavLink>
                <MobileNavLink to="/tournaments" onClick={() => setIsMobileMenuOpen(false)}>Tournaments</MobileNavLink>
                <MobileNavLink to="/teams" onClick={() => setIsMobileMenuOpen(false)}>Teams</MobileNavLink>
                <MobileNavLink to="/leaderboards" onClick={() => setIsMobileMenuOpen(false)}>Rankings</MobileNavLink>
                <MobileNavLink to="/social" onClick={() => setIsMobileMenuOpen(false)}>Social</MobileNavLink>
                <MobileNavLink to="/mental-health" onClick={() => setIsMobileMenuOpen(false)}>Wellness</MobileNavLink>
                <MobileNavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)}>Profile</MobileNavLink>
                <button
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="w-full text-left text-white hover:text-orange-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <MobileNavLink to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</MobileNavLink>
                <MobileNavLink to="/register" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</MobileNavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 backdrop-blur-sm border border-transparent hover:border-white/20"
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block text-white hover:text-orange-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
  >
    {children}
  </Link>
);

export default Navbar;