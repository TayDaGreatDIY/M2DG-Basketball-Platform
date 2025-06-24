import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import LoadingSpinner from './LoadingSpinner';

const AICoachingSystem = ({ playerData }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [activeTab, setActiveTab] = useState('recommendations');

  useEffect(() => {
    generateRecommendations();
  }, [playerData]);

  const generateRecommendations = async () => {
    setIsGenerating(true);
    try {
      const response = await api.getAIRecommendations(playerData);
      setRecommendations(response.data);
    } catch (error) {
      console.error('Failed to generate AI recommendations:', error);
      // Fallback to mock data if API fails
      setRecommendations([
        {
          id: 1,
          type: 'skill_improvement',
          title: 'Improve Ball Handling',
          description: 'Based on your recent games, focus on dribbling drills to improve your ball control.',
          priority: 'high',
          exercises: ['Cone weaving', 'Two-ball dribbling', 'Stationary pound dribbles'],
          expectedImprovement: '15-20% improvement in 2 weeks'
        },
        {
          id: 2,
          type: 'strategy',
          title: 'Optimize Shot Selection',
          description: 'You\'re taking too many contested 3-pointers. Focus on higher percentage shots.',
          priority: 'medium',
          exercises: ['Mid-range shooting', 'Catch and shoot drills', 'Shot chart analysis'],
          expectedImprovement: '8-12% shooting improvement'
        },
        {
          id: 3,
          type: 'fitness',
          title: 'Enhance Stamina',
          description: 'Your performance drops in the 4th quarter. Improve cardiovascular endurance.',
          priority: 'high',
          exercises: ['Interval running', 'Court sprints', 'Plyometric training'],
          expectedImprovement: '25% stamina increase in 3 weeks'
        }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { role: 'user', content: inputMessage, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    try {
      const response = await api.chatWithAICoach({
        message: inputMessage,
        playerData,
        chatHistory: chatMessages
      });

      const aiMessage = { 
        role: 'assistant', 
        content: response.data.message, 
        timestamp: new Date() 
      };
      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to chat with AI coach:', error);
      // Fallback response
      const aiMessage = { 
        role: 'assistant', 
        content: 'I\'m here to help you improve your basketball skills! Ask me about shooting, dribbling, defense, or any specific techniques you\'d like to work on.', 
        timestamp: new Date() 
      };
      setChatMessages(prev => [...prev, aiMessage]);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 border-red-500/50 text-red-300';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300';
      case 'low': return 'bg-green-500/20 border-green-500/50 text-green-300';
      default: return 'bg-gray-500/20 border-gray-500/50 text-gray-300';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'skill_improvement': return '🎯';
      case 'strategy': return '🧠';
      case 'fitness': return '💪';
      case 'mental': return '🧘';
      default: return '🏀';
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🤖</span>
          <h2 className="text-2xl font-bold text-white">AI Basketball Coach</h2>
        </div>
        <button
          onClick={generateRecommendations}
          disabled={isGenerating}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
        >
          {isGenerating ? 'Analyzing...' : 'Refresh Analysis'}
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
            activeTab === 'recommendations'
              ? 'bg-purple-500 text-white shadow-lg'
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`}
        >
          🎯 Recommendations
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
            activeTab === 'chat'
              ? 'bg-purple-500 text-white shadow-lg'
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`}
        >
          💬 Ask Coach
        </button>
      </div>

      {/* Content */}
      {activeTab === 'recommendations' ? (
        <div className="space-y-6">
          {isGenerating ? (
            <div className="text-center py-12">
              <LoadingSpinner size="lg" color="purple" />
              <p className="text-gray-300 mt-4">AI analyzing your performance...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div key={rec.id} className={`p-6 rounded-xl border-2 ${getPriorityColor(rec.priority)}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getTypeIcon(rec.type)}</span>
                      <h3 className="text-lg font-bold text-white">{rec.title}</h3>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                      {rec.priority} priority
                    </span>
                  </div>
                  
                  <p className="text-gray-300 mb-4">{rec.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-white font-medium mb-2">Recommended Exercises:</h4>
                    <ul className="space-y-1">
                      {rec.exercises.map((exercise, index) => (
                        <li key={index} className="text-gray-300 text-sm flex items-center space-x-2">
                          <span className="text-orange-400">•</span>
                          <span>{exercise}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">📈</span>
                      <span className="text-green-300 text-sm font-medium">Expected: {rec.expectedImprovement}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Chat Messages */}
          <div className="bg-white/5 rounded-xl p-4 h-96 overflow-y-auto space-y-4">
            {chatMessages.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-white font-bold mb-2">Ask Your AI Coach</h3>
                <p className="text-gray-300 text-sm">Get personalized basketball advice and training tips!</p>
              </div>
            ) : (
              chatMessages.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-orange-500 text-white'
                      : 'bg-white/10 text-gray-200'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Chat Input */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about shooting, dribbling, defense..."
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AICoachingSystem;