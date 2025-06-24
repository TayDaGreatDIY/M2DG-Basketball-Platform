import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    upcomingBookings: 0,
    activeTournaments: 0,
    myTeams: 0,
    challengesReceived: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch various data for dashboard
      const [bookings, tournaments, teams, challenges] = await Promise.all([
        api.getMyBookings(),
        api.getTournaments(),
        api.getTeams(),
        api.getChallenges()
      ]);

      setStats({
        upcomingBookings: bookings.data.length,
        activeTournaments: tournaments.data.filter(t => t.status === 'active').length,
        myTeams: teams.data.filter(t => t.members.includes(user?.id)).length,
        challengesReceived: challenges.data.filter(c => c.challenged_user === user?.id && c.status === 'open').length
      });

      // Mock recent activity for now
      setRecentActivity([
        { id: 1, type: 'booking', message: 'Court booking confirmed for Downtown Court', time: '2 hours ago' },
        { id: 2, type: 'tournament', message: 'Registered for Summer Basketball Tournament', time: '1 day ago' },
        { id: 3, type: 'challenge', message: 'New challenge received from @player123', time: '2 days ago' },
      ]);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏀</div>
          <div className="text-xl text-gray-600">Loading your basketball dashboard...</div>
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      title: 'Book a Court',
      description: 'Reserve your favorite basketball court',
      icon: '🏀',
      link: '/courts',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      title: 'Join Tournament',
      description: 'Compete in upcoming tournaments',
      icon: '🏆',
      link: '/tournaments',
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      title: 'Create Challenge',
      description: 'Challenge other players to a game',
      icon: '⚔️',
      link: '/challenges',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Manage Teams',
      description: 'Create or join basketball teams',
      icon: '👥',
      link: '/teams',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Find Coach',
      description: 'Book sessions with professional coaches',
      icon: '🎯',
      link: '/coaches',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Live Scoring',
      description: 'Score your games in real-time',
      icon: '📊',
      link: '/scoring',
      color: 'bg-indigo-500 hover:bg-indigo-600'
    },
    {
      title: 'Leaderboards',
      description: 'See where you rank in the community',
      icon: '🏆',
      link: '/leaderboards',
      color: 'bg-yellow-500 hover:bg-yellow-600'
    },
    {
      title: 'Game History',
      description: 'Track your basketball journey',
      icon: '📈',
      link: '/game-history',
      color: 'bg-pink-500 hover:bg-pink-600'
    },
    {
      title: 'Social Hub',
      description: 'Connect with fellow players',
      icon: '💬',
      link: '/social',
      color: 'bg-teal-500 hover:bg-teal-600'
    },
    {
      title: 'Community Forums',
      description: 'Join basketball discussions',
      icon: '💭',
      link: '/forums',
      color: 'bg-cyan-500 hover:bg-cyan-600'
    },
    {
      title: 'Advanced Analytics',
      description: 'Deep performance insights',
      icon: '📊',
      link: '/analytics',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'Progress Tracking',
      description: 'Monitor your improvement',
      icon: '📈',
      link: '/progress',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'AI Recommendations',
      description: 'Personalized training suggestions',
      icon: '🤖',
      link: '/recommendations',
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      title: 'Achievements',
      description: 'Unlock badges and milestones',
      icon: '🏅',
      link: '/achievements',
      color: 'bg-yellow-600 hover:bg-yellow-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.full_name || user?.username}! 🏀
          </h1>
          <p className="mt-2 text-orange-100">
            Ready to manage your basketball life? Here's your command center.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="text-3xl text-orange-500">📅</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.upcomingBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="text-3xl text-red-500">🏆</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Tournaments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeTournaments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="text-3xl text-green-500">👥</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">My Teams</p>
                <p className="text-2xl font-bold text-gray-900">{stats.myTeams}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="text-3xl text-blue-500">⚔️</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Challenges</p>
                <p className="text-2xl font-bold text-gray-900">{stats.challengesReceived}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Manage Your Basketball Life
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className={`${action.color} text-white p-6 rounded-lg shadow-md transition duration-300 transform hover:scale-105`}
                >
                  <div className="flex items-center mb-3">
                    <div className="text-3xl mr-3">{action.icon}</div>
                    <h3 className="text-xl font-semibold">{action.title}</h3>
                  </div>
                  <p className="text-sm opacity-90">{action.description}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="bg-white rounded-lg shadow-md">
              {recentActivity.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <div className="text-4xl mb-2">📝</div>
                  <p>No recent activity</p>
                  <p className="text-sm">Start booking courts or joining tournaments!</p>
                </div>
              )}
            </div>

            {/* Quick Profile Card */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Profile</h3>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">{user?.full_name || user?.username}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
              <Link
                to="/profile"
                className="text-orange-600 hover:text-orange-700 text-sm font-medium"
              >
                View & Edit Profile →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;