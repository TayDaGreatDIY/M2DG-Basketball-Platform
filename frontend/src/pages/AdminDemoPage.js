import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TournamentBracket from '../components/TournamentBracket';
import AdvancedAnalyticsDashboard from '../components/AdvancedAnalyticsDashboard';
import AICoachingSystem from '../components/AICoachingSystem';
import NotificationCenter from '../components/NotificationCenter';
import { SocialSharing, SocialConnect } from '../components/SocialSharing';
import PaymentForm from '../components/PaymentForm';
import StripeProvider from '../components/StripeProvider';
import InstallPrompt from '../components/InstallPrompt';

const AdminDemoPage = () => {
  const [activeDemo, setActiveDemo] = useState('dashboard');

  // Mock user data for demos
  const mockUser = {
    id: 'demo-user-123',
    username: 'DemoPlayer',
    email: 'demo@m2dgbasketball.com',
    level: 3,
    points: 1250,
    achievements: 12
  };

  const mockPlayerData = {
    averageScore: 18.5,
    gamesPlayed: 23,
    winRate: 78.5,
    recentPerformance: [15, 18, 22, 16, 19, 24, 18]
  };

  const mockAchievement = {
    title: 'Court Master',
    description: 'Booked 10 basketball courts',
    rarity: 'epic'
  };

  const demoSections = [
    { id: 'dashboard', name: '🏀 Enhanced Dashboard', icon: '📊' },
    { id: 'payments', name: '💳 Stripe Payments', icon: '💰' },
    { id: 'ai-coach', name: '🤖 AI Coaching', icon: '🧠' },
    { id: 'analytics', name: '📈 Advanced Analytics', icon: '📊' },
    { id: 'tournaments', name: '🏆 Tournament Brackets', icon: '🏅' },
    { id: 'notifications', name: '📧 Email Notifications', icon: '✉️' },
    { id: 'social', name: '📱 Social Sharing', icon: '🔗' },
    { id: 'video', name: '🎥 Video Analysis', icon: '📹' },
    { id: 'mental-health', name: '🧠 Mental Health', icon: '👨‍⚕️' },
    { id: 'gamification', name: '🎮 Gamification', icon: '🏆' },
    { id: 'pwa', name: '📱 PWA Features', icon: '💾' }
  ];

  const renderDemoContent = () => {
    switch (activeDemo) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">🏀 Enhanced Dashboard Demo</h2>
              <p className="text-gray-300">Experience the premium gamified dashboard with XP, levels, and achievements</p>
            </div>
            
            {/* Level Progress */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Level 3 Progress</span>
                <span className="text-orange-400 font-bold">250/500 XP</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full w-1/2"></div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-2xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Court Bookings</p>
                    <p className="text-3xl font-bold">8</p>
                  </div>
                  <div className="text-4xl opacity-80">🏀</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-6 rounded-2xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Tournaments</p>
                    <p className="text-3xl font-bold">3</p>
                  </div>
                  <div className="text-4xl opacity-80">🏆</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-teal-500 p-6 rounded-2xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Teams</p>
                    <p className="text-3xl font-bold">2</p>
                  </div>
                  <div className="text-4xl opacity-80">👥</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-6 rounded-2xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Challenges</p>
                    <p className="text-3xl font-bold">5</p>
                  </div>
                  <div className="text-4xl opacity-80">⚡</div>
                </div>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {[
                { name: 'Book Court', icon: '🏀', color: 'from-orange-500 to-red-500' },
                { name: 'Tournaments', icon: '🏆', color: 'from-blue-500 to-purple-500' },
                { name: 'Find Team', icon: '👥', color: 'from-green-500 to-teal-500' },
                { name: 'Challenges', icon: '⚡', color: 'from-yellow-500 to-orange-500' },
                { name: 'AI Coach', icon: '🤖', color: 'from-purple-500 to-pink-500' },
                { name: 'Analytics', icon: '📊', color: 'from-cyan-500 to-blue-500' },
                { name: 'Social', icon: '💬', color: 'from-teal-500 to-green-500' }
              ].map((action, index) => (
                <div
                  key={index}
                  className={`group bg-gradient-to-br ${action.color} p-6 rounded-2xl text-white text-center hover:scale-105 transition-all duration-300 shadow-lg cursor-pointer`}
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{action.icon}</div>
                  <div className="text-sm font-medium">{action.name}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'payments':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">💳 Stripe Payment Demo</h2>
              <p className="text-gray-300">Secure payment processing for court bookings and tournaments</p>
            </div>
            <StripeProvider>
              <PaymentForm
                amount={25.00}
                description="Downtown Basketball Court - 2 Hour Booking"
                onSuccess={() => alert('Payment successful! 🎉')}
                onError={() => alert('Payment demo completed')}
                courtId="demo-court-1"
                bookingData={{ date: '2024-01-15', time_slot: '6:00 PM' }}
              />
            </StripeProvider>
          </div>
        );

      case 'ai-coach':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">🤖 AI Coaching Demo</h2>
              <p className="text-gray-300">Powered by Google Gemini AI for personalized basketball coaching</p>
            </div>
            <AICoachingSystem playerData={mockPlayerData} />
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">📈 Advanced Analytics Demo</h2>
              <p className="text-gray-300">AI-powered insights and performance tracking</p>
            </div>
            <AdvancedAnalyticsDashboard playerData={mockPlayerData} />
          </div>
        );

      case 'tournaments':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">🏆 Tournament Brackets Demo</h2>
              <p className="text-gray-300">Advanced bracket management with live scoring</p>
            </div>
            <TournamentBracket tournament={{ name: 'Summer Basketball Championship' }} />
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">📧 Email Notifications Demo</h2>
              <p className="text-gray-300">SendGrid integration for booking confirmations and alerts</p>
            </div>
            <NotificationCenter />
          </div>
        );

      case 'social':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">📱 Social Sharing Demo</h2>
              <p className="text-gray-300">Share achievements across social media platforms</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SocialSharing content={mockAchievement} type="achievement" />
              <SocialConnect />
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">🎥 Video Analysis Demo</h2>
              <p className="text-gray-300">AI-powered game footage analysis</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-2xl font-bold text-white mb-4">Video Analysis Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-3xl mb-2">🎯</div>
                  <h4 className="text-white font-bold">Shot Analysis</h4>
                  <p className="text-gray-300 text-sm">Form, accuracy, improvement tips</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-3xl mb-2">🏃‍♂️</div>
                  <h4 className="text-white font-bold">Movement Tracking</h4>
                  <p className="text-gray-300 text-sm">Court positioning and speed</p>
                </div>
              </div>
              <Link 
                to="/video-analysis"
                className="inline-block mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-xl hover:scale-105 transition-all"
              >
                Try Video Analysis
              </Link>
            </div>
          </div>
        );

      case 'mental-health':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">🧠 Mental Health Demo</h2>
              <p className="text-gray-300">Basketball wellness platform with licensed therapists and motivational content</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-4">👨‍⚕️ Licensed Therapists</h3>
                <p className="text-gray-300 mb-4">Connect with verified mental health professionals specializing in sports psychology</p>
                <Link 
                  to="/mental-health"
                  className="inline-block bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-xl transition-colors"
                >
                  Explore Mental Health
                </Link>
              </div>
              <div className="bg-white/5 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-4">🎥 Motivation Hub</h3>
                <p className="text-gray-300 mb-4">Access inspiring content from basketball legends and motivational speakers</p>
                <Link 
                  to="/therapist-registration"
                  className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-xl transition-colors"
                >
                  Register as Therapist
                </Link>
              </div>
            </div>
          </div>
        );

      case 'gamification':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">🎮 Gamification Demo</h2>
              <p className="text-gray-300">XP system, achievements, and progress tracking</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Court Master', icon: '🏀', rarity: 'common', progress: 100 },
                { name: 'Tournament Warrior', icon: '🏆', rarity: 'rare', progress: 75 },
                { name: 'Social Butterfly', icon: '👥', rarity: 'epic', progress: 60 }
              ].map((achievement, index) => (
                <div key={index} className="p-6 bg-white/5 rounded-xl">
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
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'pwa':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">📱 PWA Features Demo</h2>
              <p className="text-gray-300">Progressive Web App capabilities</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-4">📥 Install App</h3>
                <p className="text-gray-300 mb-4">Install M2DG Basketball as a native app on your device</p>
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-xl">
                  Install App
                </button>
              </div>
              <div className="bg-white/5 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-4">⚡ Offline Support</h3>
                <p className="text-gray-300 mb-4">Access basketball features even without internet</p>
                <div className="text-green-400">✅ Enabled</div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-orange-500 to-red-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">🔧 M2DG Admin Demo - ALL PREMIUM FEATURES</h1>
            <p className="text-red-100">No login required • View all $100+ worth of premium features</p>
          </div>
          <Link 
            to="/"
            className="bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-4 rounded-xl transition-all"
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {demoSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveDemo(section.id)}
                className={`p-4 rounded-xl font-medium transition-all duration-300 ${
                  activeDemo === section.id
                    ? 'bg-orange-500 text-white shadow-lg scale-105'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <div className="text-2xl mb-2">{section.icon}</div>
                <div className="text-sm">{section.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="min-h-96">
          {renderDemoContent()}
        </div>

        {/* Footer Info */}
        <div className="mt-12 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">🎉 Premium Features Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="text-orange-400 font-bold mb-2">✅ Implemented & Working:</h4>
              <ul className="space-y-1 text-gray-300">
                <li>• 💳 Stripe Payment Integration</li>
                <li>• 🤖 Google Gemini AI Coaching</li>
                <li>• 📧 SendGrid Email Notifications</li>
                <li>• 🏆 Advanced Tournament Brackets</li>
                <li>• 📊 Performance Analytics</li>
              </ul>
            </div>
            <div>
              <h4 className="text-green-400 font-bold mb-2">🚀 Premium UI Features:</h4>
              <ul className="space-y-1 text-gray-300">
                <li>• 🎨 Glass Morphism Design</li>
                <li>• 📱 Progressive Web App</li>
                <li>• 🎮 Gamification System</li>
                <li>• 📱 Social Media Sharing</li>
                <li>• 🎥 Video Analysis System</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <InstallPrompt />
    </div>
  );
};

export default AdminDemoPage;