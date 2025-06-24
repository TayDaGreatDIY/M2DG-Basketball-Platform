import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const LeaderboardsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overall');
  const [timeFilter, setTimeFilter] = useState('all_time');
  const [loading, setLoading] = useState(true);

  // Mock leaderboard data (in real app, this would come from API)
  const [leaderboards, setLeaderboards] = useState({
    overall: [
      { id: 1, username: 'BasketballKing', rank: 1, points: 2450, wins: 45, losses: 12, winRate: 78.9, avatar: '🏀' },
      { id: 2, username: 'CourtMaster', rank: 2, points: 2380, wins: 42, losses: 15, winRate: 73.7, avatar: '⭐' },
      { id: 3, username: 'ShotCaller', rank: 3, points: 2250, wins: 38, losses: 18, winRate: 67.9, avatar: '🎯' },
      { id: 4, username: 'DunkLegend', rank: 4, points: 2180, wins: 35, losses: 20, winRate: 63.6, avatar: '💪' },
      { id: 5, username: 'ThreePointer', rank: 5, points: 2120, wins: 33, losses: 22, winRate: 60.0, avatar: '🚀' },
      { id: 6, username: 'FastBreak', rank: 6, points: 2050, wins: 31, losses: 24, winRate: 56.4, avatar: '⚡' },
      { id: 7, username: 'DefenseFirst', rank: 7, points: 1980, wins: 29, losses: 26, winRate: 52.7, avatar: '🛡️' },
      { id: 8, username: 'ClutchPlayer', rank: 8, points: 1920, wins: 27, losses: 28, winRate: 49.1, avatar: '🔥' },
    ],
    weekly: [
      { id: 1, username: 'HotStreak', rank: 1, points: 450, wins: 8, losses: 1, winRate: 88.9, avatar: '🔥' },
      { id: 2, username: 'WeekendWarrior', rank: 2, points: 420, wins: 7, losses: 2, winRate: 77.8, avatar: '⚔️' },
      { id: 3, username: 'BasketballKing', rank: 3, points: 380, wins: 6, losses: 3, winRate: 66.7, avatar: '🏀' },
    ],
    monthly: [
      { id: 1, username: 'ConsistentWins', rank: 1, points: 1250, wins: 22, losses: 6, winRate: 78.6, avatar: '📈' },
      { id: 2, username: 'MonthlyMVP', rank: 2, points: 1180, wins: 20, losses: 8, winRate: 71.4, avatar: '🏆' },
      { id: 3, username: 'SteadyClimber', rank: 3, points: 1120, wins: 18, losses: 10, winRate: 64.3, avatar: '🎯' },
    ]
  });

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const getCurrentUserRank = () => {
    const currentBoard = leaderboards[activeTab];
    const userIndex = currentBoard.findIndex(player => player.username === user?.username);
    return userIndex >= 0 ? userIndex + 1 : null;
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return { icon: '🥇', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (rank === 2) return { icon: '🥈', color: 'text-gray-600', bg: 'bg-gray-50' };
    if (rank === 3) return { icon: '🥉', color: 'text-amber-600', bg: 'bg-amber-50' };
    return { icon: '🏅', color: 'text-blue-600', bg: 'bg-blue-50' };
  };

  const getStatColor = (winRate) => {
    if (winRate >= 70) return 'text-green-600';
    if (winRate >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏆</div>
          <div className="text-xl text-gray-600">Loading leaderboards...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">🏆 Leaderboards</h1>
            <p className="text-orange-100">
              See where you rank among the basketball community
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User's Current Rank Card */}
        {getCurrentUserRank() && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-orange-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-3xl mr-4">👤</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Your Current Rank</h3>
                  <p className="text-gray-600">You're doing great! Keep climbing!</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-orange-600">#{getCurrentUserRank()}</div>
                <div className="text-sm text-gray-500">in {activeTab} rankings</div>
              </div>
            </div>
          </div>
        )}

        {/* Time Filter Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overall')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overall'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Overall Rankings
              </button>
              <button
                onClick={() => setActiveTab('weekly')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'weekly'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => setActiveTab('monthly')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'monthly'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                This Month
              </button>
            </nav>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="text-2xl mr-2">🏆</span>
              {activeTab === 'overall' && 'Overall Rankings'}
              {activeTab === 'weekly' && 'Weekly Champions'}
              {activeTab === 'monthly' && 'Monthly Leaders'}
            </h3>
          </div>

          <div className="divide-y divide-gray-200">
            {leaderboards[activeTab].map((player, index) => {
              const badge = getRankBadge(player.rank);
              const isCurrentUser = player.username === user?.username;
              
              return (
                <div
                  key={player.id}
                  className={`p-6 hover:bg-gray-50 transition duration-200 ${
                    isCurrentUser ? 'bg-orange-50 border-l-4 border-orange-600' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Rank Badge */}
                      <div className={`${badge.bg} ${badge.color} rounded-full p-3 text-center min-w-0`}>
                        <div className="text-xl">{badge.icon}</div>
                        <div className="text-sm font-bold">#{player.rank}</div>
                      </div>

                      {/* Player Info */}
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{player.avatar}</div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-lg font-semibold text-gray-900">
                              {player.username}
                            </h4>
                            {isCurrentUser && (
                              <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
                                You
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600">
                            {player.points.toLocaleString()} points • {player.wins}W-{player.losses}L
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="text-right">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500">Points</div>
                          <div className="font-bold text-lg">{player.points.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Games</div>
                          <div className="font-medium">{player.wins + player.losses}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Win Rate</div>
                          <div className={`font-bold ${getStatColor(player.winRate)}`}>
                            {player.winRate}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievement Categories */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Top Scorer</h3>
            <p className="text-gray-600 mb-4">Highest points in a single game</p>
            <div className="text-2xl font-bold text-orange-600">BasketballKing</div>
            <div className="text-sm text-gray-500">84 points</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">🔥</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Win Streak</h3>
            <p className="text-gray-600 mb-4">Longest winning streak</p>
            <div className="text-2xl font-bold text-green-600">HotStreak</div>
            <div className="text-sm text-gray-500">12 games</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Most Active</h3>
            <p className="text-gray-600 mb-4">Most games played this month</p>
            <div className="text-2xl font-bold text-blue-600">CourtMaster</div>
            <div className="text-sm text-gray-500">67 games</div>
          </div>
        </div>

        {/* Ranking System Info */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 How Rankings Work</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Point System</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Win a game: +50 points</li>
                <li>• Complete a challenge: +25 points</li>
                <li>• Tournament participation: +10 points</li>
                <li>• Tournament win: +100 points</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Ranking Factors</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Total points earned</li>
                <li>• Win/loss ratio</li>
                <li>• Activity level</li>
                <li>• Tournament performance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardsPage;