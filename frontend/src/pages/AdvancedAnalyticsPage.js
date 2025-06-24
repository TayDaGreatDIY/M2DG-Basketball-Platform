import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AdvancedAnalyticsPage = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('last_30_days');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock analytics data (in real app, this would come from API)
  const mockAnalytics = {
    performance: {
      overall_rating: 87.5,
      improvement_trend: '+12%',
      skill_breakdown: {
        shooting: 92,
        defense: 78,
        passing: 85,
        rebounding: 82,
        conditioning: 88
      },
      recent_games: [
        { date: '2024-06-23', performance: 94, opponent: 'CourtMaster' },
        { date: '2024-06-22', performance: 72, opponent: 'ShotCaller' },
        { date: '2024-06-21', performance: 89, opponent: 'Team Thunder' },
        { date: '2024-06-20', performance: 96, opponent: 'DunkLegend' },
        { date: '2024-06-19', performance: 81, opponent: 'FastBreak' }
      ]
    },
    shooting: {
      field_goal_percentage: 68.4,
      three_point_percentage: 42.1,
      free_throw_percentage: 87.3,
      shot_chart: {
        paint: { attempts: 45, made: 32, percentage: 71.1 },
        mid_range: { attempts: 28, made: 17, percentage: 60.7 },
        three_point: { attempts: 38, made: 16, percentage: 42.1 },
        free_throw: { attempts: 23, made: 20, percentage: 87.0 }
      },
      hot_zones: ['Left Corner 3', 'Paint', 'Right Elbow'],
      cold_zones: ['Top of Key 3', 'Right Wing']
    },
    physical: {
      games_played: 24,
      minutes_per_game: 32.5,
      stamina_rating: 85,
      injury_risk: 'Low',
      fitness_trends: [
        { week: 'Week 1', stamina: 78, speed: 82, strength: 80 },
        { week: 'Week 2', stamina: 81, speed: 84, strength: 82 },
        { week: 'Week 3', stamina: 83, speed: 85, strength: 84 },
        { week: 'Week 4', stamina: 85, speed: 87, strength: 85 }
      ]
    },
    mental: {
      focus_score: 91,
      pressure_performance: 88,
      leadership_rating: 76,
      clutch_factor: 94,
      game_iq: 89
    }
  };

  useEffect(() => {
    // Simulate loading analytics data
    setTimeout(() => {
      setAnalyticsData(mockAnalytics);
      setLoading(false);
    }, 1500);
  }, [timeRange]);

  const getSkillColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getPerformanceColor = (score) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <div className="text-xl text-gray-600">Analyzing your basketball performance...</div>
          <div className="mt-4 w-64 bg-gray-200 rounded-full h-2 mx-auto">
            <div className="bg-orange-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">📊 Advanced Analytics</h1>
              <p className="text-orange-100">
                Deep insights into your basketball performance and improvement areas
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium"
              >
                <option value="last_7_days">Last 7 Days</option>
                <option value="last_30_days">Last 30 Days</option>
                <option value="last_3_months">Last 3 Months</option>
                <option value="all_time">All Time</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {analyticsData.performance.overall_rating}
            </div>
            <div className="text-sm text-gray-600 mb-1">Overall Rating</div>
            <div className="text-green-600 text-sm font-medium">
              {analyticsData.performance.improvement_trend}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {analyticsData.shooting.field_goal_percentage}%
            </div>
            <div className="text-sm text-gray-600">Field Goal %</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {analyticsData.mental.clutch_factor}
            </div>
            <div className="text-sm text-gray-600">Clutch Factor</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {analyticsData.physical.games_played}
            </div>
            <div className="text-sm text-gray-600">Games Played</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Skill Breakdown */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Skill Breakdown</h3>
            <div className="space-y-4">
              {Object.entries(analyticsData.performance.skill_breakdown).map(([skill, score]) => (
                <div key={skill} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="capitalize font-medium text-gray-900 w-24">{skill}</span>
                    <div className="ml-4 flex-1 bg-gray-200 rounded-full h-3 w-48">
                      <div
                        className={`h-3 rounded-full ${getPerformanceColor(score)}`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className={`ml-4 px-2 py-1 rounded-full text-sm font-medium ${getSkillColor(score)}`}>
                    {score}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Performance Trend */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Performance Trend</h3>
            <div className="space-y-3">
              {analyticsData.performance.recent_games.map((game, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{game.date}</div>
                    <div className="text-sm text-gray-600">vs {game.opponent}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        className={`h-2 rounded-full ${getPerformanceColor(game.performance)}`}
                        style={{ width: `${game.performance}%` }}
                      ></div>
                    </div>
                    <span className="font-bold text-gray-900">{game.performance}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shooting Analytics */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Shooting Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {Object.entries(analyticsData.shooting.shot_chart).map(([zone, data]) => (
              <div key={zone} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900 capitalize mb-2">
                  {zone.replace('_', ' ')}
                </div>
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {data.percentage}%
                </div>
                <div className="text-sm text-gray-600">
                  {data.made}/{data.attempts}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">🔥 Hot Zones</h4>
              <div className="space-y-2">
                {analyticsData.shooting.hot_zones.map((zone, index) => (
                  <span key={index} className="inline-block bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full mr-2 mb-2">
                    {zone}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">🧊 Cold Zones</h4>
              <div className="space-y-2">
                {analyticsData.shooting.cold_zones.map((zone, index) => (
                  <span key={index} className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mr-2 mb-2">
                    {zone}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Physical & Mental Analytics */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Physical Performance */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Physical Performance</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Stamina Rating</span>
                <span className="font-bold text-green-600">{analyticsData.physical.stamina_rating}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Minutes/Game</span>
                <span className="font-bold">{analyticsData.physical.minutes_per_game}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Injury Risk</span>
                <span className="font-bold text-green-600">{analyticsData.physical.injury_risk}</span>
              </div>
            </div>

            <h4 className="font-medium text-gray-900 mb-3">Fitness Trends</h4>
            <div className="space-y-2">
              {analyticsData.physical.fitness_trends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{trend.week}</span>
                  <div className="flex space-x-4">
                    <span>Stamina: {trend.stamina}</span>
                    <span>Speed: {trend.speed}</span>
                    <span>Strength: {trend.strength}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mental Performance */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Mental Performance</h3>
            <div className="space-y-4">
              {Object.entries(analyticsData.mental).map(([metric, score]) => (
                <div key={metric} className="flex items-center justify-between">
                  <span className="capitalize text-gray-600">{metric.replace('_', ' ')}</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        className={`h-2 rounded-full ${getPerformanceColor(score)}`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                    <span className="font-bold text-gray-900 w-8">{score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">🤖</span>
            AI Performance Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-green-700 mb-2">💪 Strengths</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Excellent shooting from the paint (71.1%)</li>
                <li>• Outstanding clutch performance (94/100)</li>
                <li>• Strong mental focus and game IQ</li>
                <li>• Consistent improvement trend (+12%)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-orange-700 mb-2">🎯 Areas for Improvement</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Defense could use more attention (78/100)</li>
                <li>• Three-point shooting from top of key</li>
                <li>• Leadership skills development</li>
                <li>• Rebounding positioning</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalyticsPage;