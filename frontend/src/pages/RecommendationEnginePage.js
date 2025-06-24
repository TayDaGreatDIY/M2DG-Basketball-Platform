import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const RecommendationEnginePage = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState(null);
  const [activeCategory, setActiveCategory] = useState('personalized');
  const [loading, setLoading] = useState(true);

  // Mock AI recommendations (in real app, this would come from AI/ML backend)
  const mockRecommendations = {
    personalized: [
      {
        id: 1,
        type: 'skill_improvement',
        title: 'Focus on Defensive Positioning',
        description: 'Your defense rating (78) has room for improvement. Practice defensive slides and help defense.',
        priority: 'high',
        confidence: 92,
        estimated_impact: '+8 points in defense rating',
        actions: [
          'Join defensive drills workshop',
          'Practice 1-on-1 defense with faster players',
          'Watch film on NBA defensive techniques'
        ],
        timeframe: '2-3 weeks',
        icon: '🛡️'
      },
      {
        id: 2,
        type: 'practice_session',
        title: 'Work on Three-Point Consistency',
        description: 'You shoot 42% from three but struggle from the top of the key. Focus on form and follow-through.',
        priority: 'medium',
        confidence: 87,
        estimated_impact: '+5% three-point percentage',
        actions: [
          'Daily 100 three-pointers from top of key',
          'Record shooting form for analysis',
          'Practice catch-and-shoot situations'
        ],
        timeframe: '3-4 weeks',
        icon: '🎯'
      },
      {
        id: 3,
        type: 'opponent_matchup',
        title: 'Prepare for ShotCaller Rematch',
        description: 'Based on your previous loss, focus on perimeter defense and controlling pace.',
        priority: 'medium',
        confidence: 85,
        estimated_impact: '65% win probability',
        actions: [
          'Practice staying with quick guards',
          'Work on shot clock awareness',
          'Study ShotCaller\'s favorite moves'
        ],
        timeframe: 'Before next game',
        icon: '⚔️'
      }
    ],
    training: [
      {
        id: 4,
        type: 'workout_plan',
        title: 'Strength & Conditioning Program',
        description: 'Tailored workout to improve your stamina and reduce injury risk.',
        priority: 'high',
        confidence: 95,
        estimated_impact: '+10 stamina, -20% injury risk',
        schedule: [
          'Monday: Lower body strength',
          'Wednesday: Upper body & core',
          'Friday: Plyometrics & agility',
          'Saturday: Basketball conditioning'
        ],
        duration: '6 weeks',
        icon: '💪'
      },
      {
        id: 5,
        type: 'skill_drill',
        title: 'Ball Handling Intensive',
        description: 'Improve your passing accuracy and ball security under pressure.',
        priority: 'medium',
        confidence: 88,
        estimated_impact: '+12% in passing accuracy',
        drills: [
          'Two-ball dribbling routine',
          'Pressure passing drills',
          'Cone weaving with crossovers',
          'Full-court ball handling'
        ],
        frequency: '3x per week, 30 minutes',
        icon: '🏀'
      }
    ],
    opponents: [
      {
        id: 6,
        type: 'player_matchup',
        name: 'CourtMaster',
        win_probability: 75,
        last_result: 'win',
        key_advantages: ['Speed advantage', 'Better three-point shooting'],
        watch_out_for: ['Strong post moves', 'Excellent rebounding'],
        strategy: 'Keep the game uptempo, force them to guard the perimeter',
        icon: '⭐'
      },
      {
        id: 7,
        type: 'player_matchup',
        name: 'DunkLegend',
        win_probability: 68,
        last_result: 'win',
        key_advantages: ['Better conditioning', 'Superior ball handling'],
        watch_out_for: ['Explosive finishing', 'Physical play in the paint'],
        strategy: 'Keep them away from the basket, use quickness to create shots',
        icon: '💪'
      },
      {
        id: 8,
        type: 'player_matchup',
        name: 'ShotCaller',
        win_probability: 45,
        last_result: 'loss',
        key_advantages: ['Better defense', 'Height advantage'],
        watch_out_for: ['Excellent shooting', 'Basketball IQ'],
        strategy: 'Contest every shot, control the pace, attack early in shot clock',
        icon: '🎯'
      }
    ],
    equipment: [
      {
        id: 9,
        type: 'gear_recommendation',
        title: 'Basketball Shoes for Better Court Grip',
        description: 'Based on your playing style and court preferences, these would improve your performance.',
        items: [
          'Nike Air Jordan XXXVI - Excellent traction for outdoor courts',
          'Adidas Dame 8 - Great for quick cuts and lateral movement',
          'Under Armour Curry 9 - Perfect for shooters and guards'
        ],
        reasoning: 'Your agility metrics suggest you need better grip for defensive slides',
        icon: '👟'
      },
      {
        id: 10,
        type: 'training_gear',
        title: 'Training Equipment Suggestions',
        description: 'Tools to accelerate your skill development based on your improvement goals.',
        items: [
          'Shooting machine for consistent practice',
          'Agility ladder for footwork',
          'Resistance bands for strength training',
          'Basketball rebounder for solo practice'
        ],
        reasoning: 'Focused on your weakest areas: defense and three-point consistency',
        icon: '🎯'
      }
    ]
  };

  useEffect(() => {
    // Simulate AI processing recommendations
    setTimeout(() => {
      setRecommendations(mockRecommendations);
      setLoading(false);
    }, 2000);
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 80) return 'text-blue-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getWinProbabilityColor = (probability) => {
    if (probability >= 70) return 'text-green-600 bg-green-50';
    if (probability >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🤖</div>
          <div className="text-xl text-gray-600">AI is analyzing your performance...</div>
          <div className="text-sm text-gray-500 mt-2">Generating personalized recommendations</div>
          <div className="mt-4 w-64 bg-gray-200 rounded-full h-2 mx-auto">
            <div className="bg-gradient-to-r from-orange-600 to-purple-600 h-2 rounded-full animate-pulse" style={{width: '80%'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 via-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">🤖 AI Recommendation Engine</h1>
            <p className="text-purple-100">
              Personalized recommendations powered by machine learning to elevate your game
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8 border border-purple-200">
          <div className="flex items-center mb-4">
            <span className="text-3xl mr-3">🧠</span>
            <h2 className="text-xl font-bold text-gray-900">AI Analysis Summary</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">87%</div>
              <div className="text-sm text-gray-600">Performance Potential</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">5</div>
              <div className="text-sm text-gray-600">High Priority Areas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">92%</div>
              <div className="text-sm text-gray-600">Recommendation Accuracy</div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveCategory('personalized')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeCategory === 'personalized'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Personalized
              </button>
              <button
                onClick={() => setActiveCategory('training')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeCategory === 'training'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Training Plans
              </button>
              <button
                onClick={() => setActiveCategory('opponents')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeCategory === 'opponents'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Opponent Analysis
              </button>
              <button
                onClick={() => setActiveCategory('equipment')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeCategory === 'equipment'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Equipment
              </button>
            </nav>
          </div>
        </div>

        {/* Personalized Recommendations */}
        {activeCategory === 'personalized' && (
          <div className="space-y-6">
            {recommendations.personalized.map((rec) => (
              <div key={rec.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-3xl mr-4">{rec.icon}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{rec.title}</h3>
                        <p className="text-gray-600">{rec.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                        {rec.priority.toUpperCase()} PRIORITY
                      </span>
                      <div className={`text-sm font-medium mt-1 ${getConfidenceColor(rec.confidence)}`}>
                        {rec.confidence}% confidence
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">Expected Impact: <span className="font-medium text-green-600">{rec.estimated_impact}</span></div>
                    <div className="text-sm text-gray-600">Timeframe: <span className="font-medium">{rec.timeframe}</span></div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Recommended Actions:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {rec.actions.map((action, index) => (
                        <li key={index}>{action}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex space-x-4">
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                      Start Training
                    </button>
                    <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Training Plans */}
        {activeCategory === 'training' && (
          <div className="space-y-6">
            {recommendations.training.map((plan) => (
              <div key={plan.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-3xl mr-4">{plan.icon}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{plan.title}</h3>
                        <p className="text-gray-600">{plan.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(plan.priority)}`}>
                        {plan.priority.toUpperCase()} PRIORITY
                      </span>
                      <div className={`text-sm font-medium mt-1 ${getConfidenceColor(plan.confidence)}`}>
                        {plan.confidence}% confidence
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">Expected Impact: <span className="font-medium text-green-600">{plan.estimated_impact}</span></div>
                    {plan.duration && (
                      <div className="text-sm text-gray-600">Duration: <span className="font-medium">{plan.duration}</span></div>
                    )}
                    {plan.frequency && (
                      <div className="text-sm text-gray-600">Frequency: <span className="font-medium">{plan.frequency}</span></div>
                    )}
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {plan.schedule ? 'Weekly Schedule:' : 'Training Drills:'}
                    </h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {(plan.schedule || plan.drills).map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex space-x-4">
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                      Start Program
                    </button>
                    <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium">
                      Customize Plan
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Opponent Analysis */}
        {activeCategory === 'opponents' && (
          <div className="space-y-6">
            {recommendations.opponents.map((opponent) => (
              <div key={opponent.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-3xl mr-4">{opponent.icon}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">vs {opponent.name}</h3>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-gray-600">Last Result: 
                            <span className={`ml-1 font-medium ${
                              opponent.last_result === 'win' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {opponent.last_result.toUpperCase()}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-lg font-bold ${getWinProbabilityColor(opponent.win_probability)}`}>
                      {opponent.win_probability}% Win Probability
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h4 className="font-medium text-green-700 mb-2">✅ Your Advantages:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {opponent.key_advantages.map((advantage, index) => (
                          <li key={index}>• {advantage}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-red-700 mb-2">⚠️ Watch Out For:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {opponent.watch_out_for.map((threat, index) => (
                          <li key={index}>• {threat}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">🎯 Recommended Strategy:</h4>
                    <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                      {opponent.strategy}
                    </p>
                  </div>

                  <div className="flex space-x-4">
                    <Link
                      to="/challenges"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      Challenge {opponent.name}
                    </Link>
                    <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium">
                      View Full Analysis
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Equipment Recommendations */}
        {activeCategory === 'equipment' && (
          <div className="space-y-6">
            {recommendations.equipment.map((equipment) => (
              <div key={equipment.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <span className="text-3xl mr-4">{equipment.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{equipment.title}</h3>
                      <p className="text-gray-600 mb-4">{equipment.description}</p>
                      
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Recommendations:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                          {equipment.items.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <h4 className="font-medium text-yellow-800 mb-1">💡 Why These Recommendations?</h4>
                        <p className="text-sm text-yellow-700">{equipment.reasoning}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                      Shop Now
                    </button>
                    <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium">
                      Save for Later
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI Insights Footer */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🔬 How Our AI Works</h3>
            <p className="text-gray-600 mb-4">
              Our recommendation engine analyzes your gameplay data, performance metrics, and playing patterns 
              to provide personalized suggestions that have helped players improve by an average of 23%.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-medium text-purple-600">📊 Data Analysis</div>
                <div className="text-gray-600">Performance metrics & game statistics</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-blue-600">🧠 Machine Learning</div>
                <div className="text-gray-600">Pattern recognition & predictive modeling</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-green-600">🎯 Personalization</div>
                <div className="text-gray-600">Tailored recommendations for your style</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationEnginePage;