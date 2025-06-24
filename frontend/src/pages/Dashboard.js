import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import InstallPrompt from '../components/InstallPrompt';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    upcomingBookings: 0,
    activeTournaments: 0,
    myTeams: 0,
    challengesReceived: 0,
    totalPoints: 0,
    currentLevel: 1,
    achievements: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [achievements, setAchievements] = useState([]);
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

      // Calculate gamification stats
      const totalPoints = 1250; // Mock data - would come from backend
      const currentLevel = Math.floor(totalPoints / 500) + 1;
      
      setStats({
        upcomingBookings: bookings.data.length,
        activeTournaments: tournaments.data.filter(t => t.status === 'active').length,
        myTeams: teams.data.filter(t => t.members.includes(user?.id)).length,
        challengesReceived: challenges.data.filter(c => c.challenged_user === user?.id && c.status === 'open').length,
        totalPoints,
        currentLevel,
        achievements: 12
      });

      // Enhanced recent activity
      setRecentActivity([
        { id: 1, type: 'booking', icon: '🏀', message: 'Court booking confirmed for Downtown Court', time: '2 hours ago' },
        { id: 2, type: 'tournament', icon: '🏆', message: 'Registered for Summer Basketball Tournament', time: '1 day ago' },
        { id: 3, type: 'challenge', icon: '⚡', message: 'New challenge received from @player123', time: '2 days ago' },
        { id: 4, type: 'achievement', icon: '🎖️', message: 'Earned "Court Master" achievement', time: '3 days ago' },
        { id: 5, type: 'level', icon: '🆙', message: 'Level up! Now Level 3', time: '1 week ago' },
      ]);

      // Recent achievements
      setAchievements([
        { id: 1, name: 'Court Master', description: 'Booked 10 courts', icon: '🏀', rarity: 'common', progress: 100 },
        { id: 2, name: 'Tournament Warrior', description: 'Won 3 tournaments', icon: '🏆', rarity: 'rare', progress: 75 },
        { id: 3, name: 'Social Butterfly', description: 'Made 25 friends', icon: '👥', rarity: 'epic', progress: 60 },
      ]);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { name: 'Book Court', icon: '🏀', path: '/courts', color: 'from-orange-500 to-red-500' },
    { name: 'Join Tournament', icon: '🏆', path: '/tournaments', color: 'from-blue-500 to-purple-500' },
    { name: 'Find Team', icon: '👥', path: '/teams', color: 'from-green-500 to-teal-500' },
    { name: 'View Challenges', icon: '⚡', path: '/challenges', color: 'from-yellow-500 to-orange-500' },
    { name: 'Find Coach', icon: '👨‍🏫', path: '/coaches', color: 'from-purple-500 to-pink-500' },
    { name: 'Game Scoring', icon: '📊', path: '/scoring', color: 'from-indigo-500 to-blue-500' },
    { name: 'Leaderboards', icon: '🏅', path: '/leaderboards', color: 'from-red-500 to-pink-500' },
    { name: 'Social Hub', icon: '💬', path: '/social', color: 'from-teal-500 to-green-500' },
    { name: 'Game History', icon: '📋', path: '/history', color: 'from-gray-500 to-gray-600' },
    { name: 'Analytics', icon: '📈', path: '/analytics', color: 'from-cyan-500 to-blue-500' },
    { name: 'Progress Track', icon: '🎯', path: '/progress', color: 'from-rose-500 to-red-500' },
    { name: 'Achievements', icon: '🏆', path: '/achievements', color: 'from-amber-500 to-orange-500' },
    { name: 'Recommendations', icon: '🤖', path: '/recommendations', color: 'from-violet-500 to-purple-500' },
    { name: 'Community', icon: '🌐', path: '/community', color: 'from-emerald-500 to-teal-500' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 flex items-center justify-center">
        <LoadingSpinner size="xl" color="orange" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white">
                Welcome back, <span className="text-orange-400">{user?.username || 'Player'}</span>!
              </h1>
              <p className="text-gray-300 mt-2">Ready to dominate the court today?</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-400">Level {stats.currentLevel}</div>
              <div className="text-sm text-gray-300">{stats.totalPoints} XP</div>
            </div>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="mb-8 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium">Level {stats.currentLevel} Progress</span>
            <span className="text-orange-400 font-bold">{stats.totalPoints % 500}/500 XP</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(stats.totalPoints % 500) / 500 * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Upcoming Bookings" value={stats.upcomingBookings} icon="🏀" color="from-orange-500 to-red-500" />
          <StatCard title="Active Tournaments" value={stats.activeTournaments} icon="🏆" color="from-blue-500 to-purple-500" />
          <StatCard title="My Teams" value={stats.myTeams} icon="👥" color="from-green-500 to-teal-500" />
          <StatCard title="Challenges" value={stats.challengesReceived} icon="⚡" color="from-yellow-500 to-orange-500" />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.path}
                className={`group bg-gradient-to-br ${action.color} p-6 rounded-2xl text-white text-center hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl`}
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{action.icon}</div>
                <div className="text-sm font-medium">{action.name}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                  <div className="text-2xl">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.message}</p>
                    <p className="text-gray-400 text-xs">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Recent Achievements</h3>
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{achievement.icon}</span>
                      <span className="text-white font-medium">{achievement.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        achievement.rarity === 'common' ? 'bg-gray-600 text-gray-200' :
                        achievement.rarity === 'rare' ? 'bg-blue-600 text-blue-200' :
                        'bg-purple-600 text-purple-200'
                      }`}>
                        {achievement.rarity}
                      </span>
                    </div>
                    <span className="text-orange-400 text-sm">{achievement.progress}%</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{achievement.description}</p>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <InstallPrompt />
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className={`bg-gradient-to-br ${color} p-6 rounded-2xl text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white/80 text-sm">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <div className="text-4xl opacity-80">{icon}</div>
    </div>
  </div>
);

export default Dashboard;