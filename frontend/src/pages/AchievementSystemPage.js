import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AchievementSystemPage = () => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('earned');
  const [achievements, setAchievements] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock achievements data (in real app, this would come from API)
  const mockAchievements = {
    earned: [
      {
        id: 1,
        title: 'First Victory',
        description: 'Win your first basketball game',
        icon: '🏆',
        category: 'milestones',
        rarity: 'common',
        points: 100,
        date_earned: '2024-05-15',
        progress: 100
      },
      {
        id: 2,
        title: 'Sharp Shooter',
        description: 'Score 90%+ field goals in a single game',
        icon: '🎯',
        category: 'performance',
        rarity: 'rare',
        points: 300,
        date_earned: '2024-06-10',
        progress: 100
      },
      {
        id: 3,
        title: 'Tournament Champion',
        description: 'Win a basketball tournament',
        icon: '👑',
        category: 'competition',
        rarity: 'epic',
        points: 500,
        date_earned: '2024-06-15',
        progress: 100
      },
      {
        id: 4,
        title: 'Team Player',
        description: 'Join your first basketball team',
        icon: '👥',
        category: 'social',
        rarity: 'common',
        points: 150,
        date_earned: '2024-05-20',
        progress: 100
      },
      {
        id: 5,
        title: 'Challenge Accepted',
        description: 'Accept and complete 10 player challenges',
        icon: '⚔️',
        category: 'challenges',
        rarity: 'uncommon',
        points: 250,
        date_earned: '2024-06-08',
        progress: 100
      },
      {
        id: 6,
        title: 'Court Booker',
        description: 'Book 25 basketball courts',
        icon: '📅',
        category: 'activity',
        rarity: 'uncommon',
        points: 200,
        date_earned: '2024-06-12',
        progress: 100
      }
    ],
    available: [
      {
        id: 7,
        title: 'Triple Double Master',
        description: 'Achieve a triple-double in any stat category',
        icon: '💎',
        category: 'performance',
        rarity: 'legendary',
        points: 1000,
        progress: 67,
        requirements: 'Double digits in 3 statistical categories in one game',
        hint: 'Focus on rebounds and assists alongside scoring'
      },
      {
        id: 8,
        title: 'Winning Streak',
        description: 'Win 10 games in a row',
        icon: '🔥',
        category: 'performance',
        rarity: 'rare',
        points: 400,
        progress: 80,
        requirements: '10 consecutive wins',
        hint: 'You\'re at 8 wins! Keep the momentum going!'
      },
      {
        id: 9,
        title: 'Community Leader',
        description: 'Create 5 forum posts that receive 10+ likes each',
        icon: '📢',
        category: 'social',
        rarity: 'uncommon',
        points: 300,
        progress: 20,
        requirements: '5 popular forum posts',
        hint: 'Share valuable basketball tips and insights'
      },
      {
        id: 10,
        title: 'Perfect Coach Rating',
        description: 'Maintain a 5.0 star coaching rating for 10 sessions',
        icon: '⭐',
        category: 'coaching',
        rarity: 'epic',
        points: 600,
        progress: 0,
        requirements: 'Become a coach and maintain perfect rating',
        hint: 'Sign up as a coach and deliver excellent training sessions'
      },
      {
        id: 11,
        title: 'Century Club',
        description: 'Play 100 total basketball games',
        icon: '💯',
        category: 'milestones',
        rarity: 'rare',
        points: 500,
        progress: 72,
        requirements: '100 games played',
        hint: 'You\'ve played 72 games. Keep going!'
      },
      {
        id: 12,
        title: 'Equipment Collector',
        description: 'Purchase 5 different types of basketball equipment',
        icon: '🛒',
        category: 'collection',
        rarity: 'uncommon',
        points: 250,
        progress: 40,
        requirements: '5 different equipment purchases',
        hint: 'Check out the equipment recommendations'
      }
    ],
    seasonal: [
      {
        id: 13,
        title: 'Summer Slam Champion',
        description: 'Win the Summer Tournament Championship 2024',
        icon: '☀️',
        category: 'seasonal',
        rarity: 'legendary',
        points: 1500,
        progress: 45,
        deadline: '2024-08-31',
        requirements: 'Win the summer tournament',
        hint: 'Tournament registration is still open!'
      },
      {
        id: 14,
        title: 'June Warrior',
        description: 'Play 30 games during June 2024',
        icon: '🗓️',
        category: 'seasonal',
        rarity: 'uncommon',
        points: 300,
        progress: 47,
        deadline: '2024-06-30',
        requirements: '30 games in June',
        hint: 'You\'ve played 14 games this month'
      }
    ]
  };

  const categories = [
    { id: 'earned', name: 'Earned', count: mockAchievements.earned.length },
    { id: 'available', name: 'Available', count: mockAchievements.available.length },
    { id: 'seasonal', name: 'Seasonal', count: mockAchievements.seasonal.length }
  ];

  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    uncommon: 'from-green-400 to-green-600', 
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-600'
  };

  const rarityTextColors = {
    common: 'text-gray-700',
    uncommon: 'text-green-700',
    rare: 'text-blue-700',
    epic: 'text-purple-700',
    legendary: 'text-orange-700'
  };

  useEffect(() => {
    // Simulate loading achievements
    setTimeout(() => {
      setAchievements(mockAchievements);
      setLoading(false);
    }, 1000);
  }, []);

  const getTotalPoints = () => {
    return achievements.earned.reduce((total, achievement) => total + achievement.points, 0);
  };

  const getProgressColor = (progress) => {
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 70) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏆</div>
          <div className="text-xl text-gray-600">Loading your achievements...</div>
          <div className="mt-4 w-64 bg-gray-200 rounded-full h-2 mx-auto">
            <div className="bg-yellow-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">🏆 Achievement System</h1>
            <p className="text-yellow-100 mb-4">
              Unlock badges, earn points, and celebrate your basketball milestones
            </p>
            <div className="inline-flex items-center bg-white bg-opacity-20 rounded-lg px-4 py-2">
              <span className="text-2xl mr-2">⭐</span>
              <span className="text-lg font-bold">{getTotalPoints()} Achievement Points</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Achievement Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{achievements.earned.length}</div>
            <div className="text-sm text-gray-600">Earned Achievements</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{getTotalPoints()}</div>
            <div className="text-sm text-gray-600">Total Points</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {achievements.earned.filter(a => a.rarity === 'rare' || a.rarity === 'epic' || a.rarity === 'legendary').length}
            </div>
            <div className="text-sm text-gray-600">Rare+ Achievements</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {Math.round((achievements.earned.length / (achievements.earned.length + achievements.available.length + achievements.seasonal.length)) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Completion Rate</div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeCategory === category.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements[activeCategory].map((achievement) => (
            <div
              key={achievement.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-lg ${
                achievement.progress === 100 ? 'ring-2 ring-yellow-400' : ''
              }`}
            >
              {/* Achievement Header with Rarity Gradient */}
              <div className={`h-24 bg-gradient-to-r ${rarityColors[achievement.rarity]} flex items-center justify-center relative`}>
                <div className="text-5xl">{achievement.icon}</div>
                {achievement.progress === 100 && (
                  <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-bold">
                    EARNED
                  </div>
                )}
                {achievement.deadline && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    SEASONAL
                  </div>
                )}
              </div>

              <div className="p-6">
                {/* Achievement Info */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{achievement.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium uppercase ${rarityTextColors[achievement.rarity]}`}>
                      {achievement.rarity}
                    </span>
                    <span className="text-sm font-bold text-orange-600">
                      {achievement.points} pts
                    </span>
                  </div>
                </div>

                {/* Progress Bar for Available/Seasonal Achievements */}
                {achievement.progress < 100 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{achievement.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getProgressColor(achievement.progress)}`}
                        style={{ width: `${achievement.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Requirements/Date Earned */}
                {achievement.date_earned ? (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Earned:</span> {new Date(achievement.date_earned).toLocaleDateString()}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {achievement.requirements && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Requirements:</span> {achievement.requirements}
                      </div>
                    )}
                    {achievement.hint && (
                      <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                        <span className="font-medium">💡 Hint:</span> {achievement.hint}
                      </div>
                    )}
                    {achievement.deadline && (
                      <div className="text-sm text-red-600">
                        <span className="font-medium">Deadline:</span> {new Date(achievement.deadline).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                )}

                {/* Action Button */}
                {achievement.progress < 100 && (
                  <div className="mt-4">
                    <button className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                      Work on This
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Achievement Categories Legend */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Achievement Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <h4 className="font-medium text-gray-900">Performance</h4>
              <p className="text-sm text-gray-600">Game-based achievements</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🏆</div>
              <h4 className="font-medium text-gray-900">Competition</h4>
              <p className="text-sm text-gray-600">Tournament & challenge wins</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">👥</div>
              <h4 className="font-medium text-gray-900">Social</h4>
              <p className="text-sm text-gray-600">Community interaction</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📈</div>
              <h4 className="font-medium text-gray-900">Milestones</h4>
              <p className="text-sm text-gray-600">Major accomplishments</p>
            </div>
          </div>
        </div>

        {/* Rarity System */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Rarity System</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(rarityColors).map(([rarity, gradient]) => (
              <div key={rarity} className="text-center">
                <div className={`h-16 w-16 mx-auto mb-2 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center`}>
                  <span className="text-white font-bold text-sm">{rarity.charAt(0).toUpperCase()}</span>
                </div>
                <div className={`capitalize font-medium ${rarityTextColors[rarity]}`}>{rarity}</div>
                <div className="text-xs text-gray-500">
                  {rarity === 'common' ? '50-100 pts' :
                   rarity === 'uncommon' ? '150-300 pts' :
                   rarity === 'rare' ? '400-600 pts' :
                   rarity === 'epic' ? '700-900 pts' : '1000+ pts'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementSystemPage;