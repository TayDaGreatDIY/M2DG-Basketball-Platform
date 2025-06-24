import React from 'react';

const AdvancedAnalyticsDashboard = ({ playerData }) => {
  // Mock analytics data
  const mockAnalytics = {
    performance: {
      averageScore: 18.5,
      shootingPercentage: 67.2,
      reboundsPerGame: 8.3,
      assistsPerGame: 4.7,
      winRate: 78.5
    },
    trends: [
      { month: 'Jan', score: 15.2, shooting: 62.1 },
      { month: 'Feb', score: 16.8, shooting: 64.3 },
      { month: 'Mar', score: 18.1, shooting: 66.7 },
      { month: 'Apr', score: 19.2, shooting: 68.9 },
      { month: 'May', score: 18.9, shooting: 67.8 },
      { month: 'Jun', score: 20.1, shooting: 71.2 }
    ],
    strengths: [
      { skill: 'Three-Point Shooting', rating: 92, improvement: '+5%' },
      { skill: 'Free Throws', rating: 88, improvement: '+3%' },
      { skill: 'Defensive Rebounds', rating: 85, improvement: '+8%' },
      { skill: 'Fast Break', rating: 79, improvement: '+12%' }
    ],
    improvements: [
      { skill: 'Ball Handling', rating: 65, focus: 'High Priority' },
      { skill: 'Post Moves', rating: 58, focus: 'Medium Priority' },
      { skill: 'Help Defense', rating: 71, focus: 'Low Priority' }
    ]
  };

  const StatCard = ({ title, value, subtitle, icon, color = 'orange' }) => (
    <div className={`bg-gradient-to-br from-${color}-500/10 to-${color}-600/10 border border-${color}-500/20 rounded-2xl p-6 backdrop-blur-md`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className={`text-${color}-400 text-xs font-medium px-2 py-1 rounded-full bg-${color}-500/20`}>
          {subtitle}
        </span>
      </div>
      <div className={`text-3xl font-bold text-${color}-400 mb-1`}>{value}</div>
      <div className="text-gray-300 text-sm">{title}</div>
    </div>
  );

  const SkillBar = ({ skill, rating, improvement, color = 'orange' }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-white font-medium">{skill}</span>
        <div className="flex items-center space-x-2">
          <span className="text-gray-300">{rating}%</span>
          {improvement && (
            <span className="text-green-400 text-sm">{improvement}</span>
          )}
        </div>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className={`bg-gradient-to-r from-${color}-500 to-${color}-600 h-2 rounded-full transition-all duration-1000`}
          style={{ width: `${rating}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Average Points"
          value={mockAnalytics.performance.averageScore}
          subtitle="per game"
          icon="🏀"
          color="orange"
        />
        <StatCard
          title="Shooting %"
          value={`${mockAnalytics.performance.shootingPercentage}%`}
          subtitle="field goal"
          icon="🎯"
          color="green"
        />
        <StatCard
          title="Rebounds"
          value={mockAnalytics.performance.reboundsPerGame}
          subtitle="per game"
          icon="💪"
          color="blue"
        />
        <StatCard
          title="Assists"
          value={mockAnalytics.performance.assistsPerGame}
          subtitle="per game"
          icon="🤝"
          color="purple"
        />
        <StatCard
          title="Win Rate"
          value={`${mockAnalytics.performance.winRate}%`}
          subtitle="overall"
          icon="🏆"
          color="yellow"
        />
      </div>

      {/* Performance Trends */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-6">Performance Trends</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scoring Trend */}
          <div>
            <h4 className="text-lg font-semibold text-orange-400 mb-4">Scoring Progress</h4>
            <div className="space-y-3">
              {mockAnalytics.trends.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-300">{month.month}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-white font-medium">{month.score} PPG</span>
                    <div className="w-24 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                        style={{ width: `${(month.score / 25) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shooting Trend */}
          <div>
            <h4 className="text-lg font-semibold text-green-400 mb-4">Shooting Accuracy</h4>
            <div className="space-y-3">
              {mockAnalytics.trends.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-300">{month.month}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-white font-medium">{month.shooting}%</span>
                    <div className="w-24 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full"
                        style={{ width: `${month.shooting}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Strengths */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-green-400 mb-6">Your Strengths 💪</h3>
          <div className="space-y-4">
            {mockAnalytics.strengths.map((strength, index) => (
              <SkillBar
                key={index}
                skill={strength.skill}
                rating={strength.rating}
                improvement={strength.improvement}
                color="green"
              />
            ))}
          </div>
        </div>

        {/* Areas for Improvement */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-red-400 mb-6">Focus Areas 🎯</h3>
          <div className="space-y-4">
            {mockAnalytics.improvements.map((improvement, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{improvement.skill}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-300">{improvement.rating}%</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      improvement.focus === 'High Priority' ? 'bg-red-500/30 text-red-300' :
                      improvement.focus === 'Medium Priority' ? 'bg-yellow-500/30 text-yellow-300' :
                      'bg-gray-500/30 text-gray-300'
                    }`}>
                      {improvement.focus}
                    </span>
                  </div>
                </div>
                <SkillBar
                  skill=""
                  rating={improvement.rating}
                  color="red"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6 backdrop-blur-md">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl">🤖</span>
          <h3 className="text-xl font-bold text-purple-400">AI Performance Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <span className="text-green-400 text-lg">✅</span>
                <div>
                  <div className="text-white font-medium">Excellent three-point consistency</div>
                  <div className="text-gray-300 text-sm">Your shooting from beyond the arc has improved 15% this month</div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <span className="text-blue-400 text-lg">💡</span>
                <div>
                  <div className="text-white font-medium">Peak performance window</div>
                  <div className="text-gray-300 text-sm">You perform best between 6-8 PM based on historical data</div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <span className="text-yellow-400 text-lg">⚠️</span>
                <div>
                  <div className="text-white font-medium">Stamina optimization needed</div>
                  <div className="text-gray-300 text-sm">Consider shorter, more frequent training sessions</div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <span className="text-purple-400 text-lg">🎯</span>
                <div>
                  <div className="text-white font-medium">Recommended focus</div>
                  <div className="text-gray-300 text-sm">Dedicate 20% more time to ball handling drills</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;