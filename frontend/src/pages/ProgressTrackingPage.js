import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProgressTrackingPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('3_months');
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock progress data (in real app, this would come from API)
  const mockProgressData = {
    overview: {
      overall_improvement: 18.5,
      skill_improvements: {
        shooting: 22,
        defense: 15,
        passing: 8,
        rebounding: 12,
        conditioning: 25
      },
      milestones_achieved: 7,
      goals_completed: 12,
      current_streak: 8
    },
    goals: [
      {
        id: 1,
        title: 'Improve Free Throw Percentage to 85%',
        current_value: 87.3,
        target_value: 85,
        progress: 100,
        status: 'completed',
        category: 'shooting',
        deadline: '2024-06-30',
        created_date: '2024-05-01'
      },
      {
        id: 2,
        title: 'Play 20 Games This Month',
        current_value: 14,
        target_value: 20,
        progress: 70,
        status: 'in_progress',
        category: 'activity',
        deadline: '2024-06-30',
        created_date: '2024-06-01'
      },
      {
        id: 3,
        title: 'Win 15 Challenges',
        current_value: 8,
        target_value: 15,
        progress: 53,
        status: 'in_progress',
        category: 'competition',
        deadline: '2024-07-15',
        created_date: '2024-06-01'
      },
      {
        id: 4,
        title: 'Improve Defense Rating to 85',
        current_value: 78,
        target_value: 85,
        progress: 71,
        status: 'in_progress',
        category: 'defense',
        deadline: '2024-08-01',
        created_date: '2024-05-15'
      }
    ],
    milestones: [
      {
        id: 1,
        title: 'First Tournament Win',
        description: 'Won your first tournament championship',
        date_achieved: '2024-06-15',
        category: 'achievement',
        icon: '🏆'
      },
      {
        id: 2,
        title: 'Shooting Specialist',
        description: 'Achieved 90%+ shooting in 5 consecutive games',
        date_achieved: '2024-06-10',
        category: 'skill',
        icon: '🎯'
      },
      {
        id: 3,
        title: '100 Games Played',
        description: 'Reached the milestone of 100 games played',
        date_achieved: '2024-06-05',
        category: 'activity',
        icon: '💯'
      }
    ],
    skill_progression: {
      shooting: [
        { month: 'Jan', value: 65 },
        { month: 'Feb', value: 68 },
        { month: 'Mar', value: 72 },
        { month: 'Apr', value: 78 },
        { month: 'May', value: 85 },
        { month: 'Jun', value: 87 }
      ],
      defense: [
        { month: 'Jan', value: 63 },
        { month: 'Feb', value: 65 },
        { month: 'Mar', value: 68 },
        { month: 'Apr', value: 70 },
        { month: 'May', value: 75 },
        { month: 'Jun', value: 78 }
      ],
      overall: [
        { month: 'Jan', value: 69 },
        { month: 'Feb', value: 72 },
        { month: 'Mar', value: 76 },
        { month: 'Apr', value: 80 },
        { month: 'May', value: 84 },
        { month: 'Jun', value: 87 }
      ]
    },
    workout_tracking: [
      { date: '2024-06-23', type: 'Shooting Practice', duration: 60, performance: 92 },
      { date: '2024-06-22', type: 'Defensive Drills', duration: 45, performance: 78 },
      { date: '2024-06-21', type: 'Conditioning', duration: 90, performance: 88 },
      { date: '2024-06-20', type: 'Team Practice', duration: 120, performance: 85 },
      { date: '2024-06-19', type: 'Free Throws', duration: 30, performance: 95 }
    ]
  };

  useEffect(() => {
    // Simulate loading progress data
    setTimeout(() => {
      setProgressData(mockProgressData);
      setLoading(false);
    }, 1200);
  }, [timeRange]);

  const getProgressColor = (progress) => {
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 70) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'shooting': return '🎯';
      case 'defense': return '🛡️';
      case 'activity': return '🏃';
      case 'competition': return '⚔️';
      default: return '🏀';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📈</div>
          <div className="text-xl text-gray-600">Loading your progress data...</div>
          <div className="mt-4 w-64 bg-gray-200 rounded-full h-2 mx-auto">
            <div className="bg-orange-600 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
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
              <h1 className="text-3xl font-bold mb-2">📈 Progress Tracking</h1>
              <p className="text-orange-100">
                Monitor your basketball improvement journey and achieve your goals
              </p>
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium"
            >
              <option value="1_month">Last Month</option>
              <option value="3_months">Last 3 Months</option>
              <option value="6_months">Last 6 Months</option>
              <option value="1_year">Last Year</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              +{progressData.overview.overall_improvement}%
            </div>
            <div className="text-sm text-gray-600">Overall Improvement</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {progressData.overview.milestones_achieved}
            </div>
            <div className="text-sm text-gray-600">Milestones Achieved</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {progressData.overview.goals_completed}
            </div>
            <div className="text-sm text-gray-600">Goals Completed</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {progressData.overview.current_streak}
            </div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              +{progressData.overview.skill_improvements.shooting}%
            </div>
            <div className="text-sm text-gray-600">Best Skill Gain</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('goals')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'goals'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Goals ({progressData.goals.filter(g => g.status === 'in_progress').length} active)
              </button>
              <button
                onClick={() => setActiveTab('milestones')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'milestones'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Milestones
              </button>
              <button
                onClick={() => setActiveTab('workouts')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'workouts'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Workout Log
              </button>
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Skill Improvements */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Skill Improvements (Last 3 Months)</h3>
              <div className="space-y-4">
                {Object.entries(progressData.overview.skill_improvements).map(([skill, improvement]) => (
                  <div key={skill} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{getCategoryIcon(skill)}</span>
                      <span className="capitalize font-medium text-gray-900 w-24">{skill}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="text-green-600 font-bold mr-4">+{improvement}%</div>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${Math.min(improvement * 4, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill Progression Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Skill Progression Over Time</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(progressData.skill_progression).map(([skill, data]) => (
                  <div key={skill} className="text-center">
                    <h4 className="capitalize font-medium text-gray-900 mb-4">{skill}</h4>
                    <div className="space-y-2">
                      {data.map((point, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{point.month}</span>
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-orange-500 h-2 rounded-full"
                                style={{ width: `${point.value}%` }}
                              ></div>
                            </div>
                            <span className="font-medium w-8">{point.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Your Basketball Goals</h3>
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium">
                Add New Goal
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {progressData.goals.map((goal) => (
                <div key={goal.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{getCategoryIcon(goal.category)}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                            {goal.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>{goal.current_value}/{goal.target_value}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${getProgressColor(goal.progress)}`}
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-center mt-1 text-sm font-medium text-gray-700">
                        {goal.progress}% Complete
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Created:</span>
                        <span>{new Date(goal.created_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Deadline:</span>
                        <span>{new Date(goal.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 px-6 py-3">
                    <div className="flex space-x-2">
                      <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                        Update Progress
                      </button>
                      <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                        Edit Goal
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Milestones Tab */}
        {activeTab === 'milestones' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Achievement Milestones</h3>
            <div className="space-y-4">
              {progressData.milestones.map((milestone) => (
                <div key={milestone.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <div className="text-4xl mr-4">{milestone.icon}</div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">{milestone.title}</h4>
                      <p className="text-gray-600 mb-2">{milestone.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>Achieved on {new Date(milestone.date_achieved).toLocaleDateString()}</span>
                        <span className="mx-2">•</span>
                        <span className="capitalize">{milestone.category}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        Completed
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Workout Log Tab */}
        {activeTab === 'workouts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Workout & Practice Log</h3>
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium">
                Log New Workout
              </button>
            </div>

            <div className="space-y-4">
              {progressData.workout_tracking.map((workout, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-2xl mr-4">💪</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{workout.type}</h4>
                        <p className="text-gray-600">{workout.date} • {workout.duration} minutes</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 mb-1">
                        {workout.performance}/100
                      </div>
                      <div className={`text-sm font-medium ${
                        workout.performance >= 90 ? 'text-green-600' :
                        workout.performance >= 80 ? 'text-blue-600' :
                        workout.performance >= 70 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {workout.performance >= 90 ? 'Excellent' :
                         workout.performance >= 80 ? 'Great' :
                         workout.performance >= 70 ? 'Good' : 'Needs Work'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressTrackingPage;