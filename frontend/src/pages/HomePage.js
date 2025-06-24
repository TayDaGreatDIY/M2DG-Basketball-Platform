import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: '🏀',
      title: 'Smart Court Booking',
      description: 'AI-powered court recommendations with real-time availability and instant RFID access codes.',
      color: 'from-orange-400 to-red-500'
    },
    {
      icon: '🏆',
      title: 'Tournament System',
      description: 'Advanced bracket management with live scoring, analytics, and championship tracking.',
      color: 'from-blue-400 to-purple-500'
    },
    {
      icon: '👥',
      title: 'Team Management',
      description: 'Create teams, manage rosters, track performance with detailed analytics and insights.',
      color: 'from-green-400 to-teal-500'
    },
    {
      icon: '📊',
      title: 'Performance Analytics',
      description: 'AI-powered insights, performance tracking, and personalized coaching recommendations.',
      color: 'from-purple-400 to-pink-500'
    },
    {
      icon: '💬',
      title: 'Social Features',
      description: 'Connect with players, real-time messaging, community forums, and achievement sharing.',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: '🎯',
      title: 'Challenge System',
      description: 'Player vs player challenges, skill-based matchmaking, and competitive leaderboards.',
      color: 'from-indigo-400 to-blue-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative pt-16 pb-32 flex content-center items-center justify-center min-h-screen overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-red-500/20 to-pink-500/20"></div>
          <div className="absolute inset-0">
            {/* Floating basketballs animation */}
            <div className="absolute top-20 left-10 text-4xl animate-bounce opacity-20">🏀</div>
            <div className="absolute top-40 right-20 text-3xl animate-pulse opacity-30">🏀</div>
            <div className="absolute bottom-40 left-20 text-5xl animate-bounce opacity-25" style={{animationDelay: '1s'}}>🏀</div>
            <div className="absolute bottom-20 right-10 text-2xl animate-pulse opacity-20" style={{animationDelay: '2s'}}>🏀</div>
          </div>
        </div>
        
        <div className="container relative mx-auto px-4 z-10">
          <div className="items-center justify-center flex flex-wrap">
            <div className="w-full lg:w-10/12 px-4 ml-auto mr-auto text-center">
              <div className="transform transition-all duration-1000 ease-out">
                <h1 className="text-white font-bold text-6xl md:text-7xl mb-8 leading-tight">
                  <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                    M2DG Basketball
                  </span>
                  <br />
                  <span className="text-4xl md:text-5xl text-white/90">Platform</span>
                </h1>
                <p className="mt-6 text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
                  The ultimate AI-powered basketball ecosystem. Book courts, create tournaments, 
                  manage teams, track performance, and connect with players worldwide. Experience 
                  basketball like never before with advanced analytics and personalized coaching.
                </p>
                
                <div className="mt-12 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                  {isAuthenticated ? (
                    <Link
                      to="/dashboard"
                      className="group bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-10 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-orange-500/25"
                    >
                      <span className="flex items-center justify-center">
                        Go to Dashboard
                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/register"
                        className="group bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-10 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-orange-500/25"
                      >
                        <span className="flex items-center justify-center">
                          Start Playing Now
                          <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </span>
                      </Link>
                      <Link
                        to="/guest"
                        className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold py-4 px-10 rounded-2xl text-lg border-2 border-white/30 hover:border-white/50 transition-all duration-300 transform hover:scale-105"
                      >
                        Explore as Guest
                      </Link>
                    </>
                  )}
                </div>

                {/* Admin Demo Link - Prominent */}
                <div className="mt-8">
                  <Link
                    to="/admin-demo"
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg border-2 border-yellow-400"
                  >
                    <span>🔧</span>
                    <span>VIEW ALL PREMIUM FEATURES (Admin Demo)</span>
                    <span>🎯</span>
                  </Link>
                  <p className="text-center text-gray-300 text-sm mt-2">No login required • See $100+ worth of premium features</p>
                </div>

                {/* Stats */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400">10,000+</div>
                    <div className="text-gray-300">Active Players</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-400">500+</div>
                    <div className="text-gray-300">Courts Available</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pink-400">1,200+</div>
                    <div className="text-gray-300">Tournaments Hosted</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-transparent to-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center text-center mb-20">
            <div className="w-full lg:w-8/12 px-4">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-6">
                Everything You Need
              </h2>
              <p className="text-xl leading-relaxed text-gray-300 max-w-3xl mx-auto">
                A comprehensive basketball platform powered by AI and designed for the modern player. 
                From casual games to professional tournaments, we've got you covered.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-orange-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-orange-600/20 via-red-500/20 to-pink-500/20 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center text-center">
            <div className="w-full lg:w-8/12 px-4">
              <h2 className="text-5xl font-bold text-white mb-6">
                Ready to <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Dominate</span> the Court?
              </h2>
              <p className="text-xl leading-relaxed mt-6 mb-12 text-gray-300 max-w-3xl mx-auto">
                Join thousands of basketball players who are already using M2DG to organize games, 
                find opponents, track performance, and take their skills to the next level with AI-powered insights.
              </p>
              {!isAuthenticated && (
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <Link
                    to="/register"
                    className="group bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-10 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-orange-500/25"
                  >
                    <span className="flex items-center justify-center">
                      Join the Elite
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </Link>
                  <Link
                    to="/guest"
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold py-4 px-10 rounded-2xl text-lg border-2 border-white/30 hover:border-white/50 transition-all duration-300"
                  >
                    See It in Action
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;