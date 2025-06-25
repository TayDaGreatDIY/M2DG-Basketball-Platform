import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const MentalHealthPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [therapists, setTherapists] = useState([]);
  const [motivationalVideos, setMotivationalVideos] = useState([]);
  const [mindsetResources, setMindsetResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMentalHealthData();
  }, []);

  const fetchMentalHealthData = async () => {
    try {
      // Fetch therapists, videos, and resources
      const [therapistsRes, videosRes, resourcesRes] = await Promise.all([
        api.getTherapists(),
        api.getMotivationalContent(),
        api.getMindsetResources()
      ]);

      setTherapists(therapistsRes.data || mockTherapists);
      setMotivationalVideos(videosRes.data || mockVideos);
      setMindsetResources(resourcesRes.data || mockResources);
    } catch (error) {
      console.error('Failed to fetch mental health data:', error);
      // Use mock data
      setTherapists(mockTherapists);
      setMotivationalVideos(mockVideos);
      setMindsetResources(mockResources);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for therapists
  const mockTherapists = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      title: 'Licensed Clinical Psychologist',
      specialties: ['Sports Psychology', 'Performance Anxiety', 'Team Dynamics'],
      license: 'CA PSY 12345',
      verified: true,
      rating: 4.9,
      rate: 150,
      insurance: ['Aetna', 'Blue Cross', 'Cigna'],
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
      bio: 'Specializing in sports psychology with 10+ years helping athletes overcome mental barriers and achieve peak performance.',
      availability: 'Available today'
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      title: 'Licensed Marriage & Family Therapist',
      specialties: ['Stress Management', 'Goal Setting', 'Mindfulness'],
      license: 'CA LMFT 67890',
      verified: true,
      rating: 4.8,
      rate: 120,
      insurance: ['Kaiser', 'UnitedHealth', 'Anthem'],
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
      bio: 'Helping athletes develop mental resilience and healthy coping strategies for competitive sports.',
      availability: 'Available tomorrow'
    }
  ];

  // Mock motivational content
  const mockVideos = [
    {
      id: '1',
      title: 'Mental Toughness in Basketball',
      speaker: 'Kobe Bryant',
      duration: '12:34',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      category: 'Motivation',
      views: '2.1M'
    },
    {
      id: '2',
      title: 'Overcoming Failure - TEDTalk',
      speaker: 'Michael Jordan',
      duration: '18:22',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      category: 'Mindset',
      views: '1.8M'
    },
    {
      id: '3',
      title: 'Building Confidence on the Court',
      speaker: 'Serena Williams',
      duration: '15:45',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      category: 'Confidence',
      views: '950K'
    }
  ];

  // Mock mindset resources
  const mockResources = [
    {
      id: '1',
      title: 'Mindset: The New Psychology of Success',
      author: 'Carol S. Dweck',
      type: 'Book',
      rating: 4.7,
      description: 'Explores the power of mindset in achieving success and overcoming challenges.',
      link: '#',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300'
    },
    {
      id: '2',
      title: 'The Champion\'s Mind',
      author: 'Jim Afremow',
      type: 'Book',
      rating: 4.8,
      description: 'Mental training strategies for athletic excellence and peak performance.',
      link: '#',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300'
    },
    {
      id: '3',
      title: 'Meditation for Athletes',
      author: 'Various',
      type: 'Course',
      rating: 4.6,
      description: 'Guided meditation sessions designed specifically for basketball players.',
      link: '#',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300'
    }
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '🧠' },
    { id: 'therapists', name: 'Find Therapist', icon: '👨‍⚕️' },
    { id: 'motivation', name: 'Motivation Hub', icon: '🎥' },
    { id: 'mindset', name: 'Mindset Resources', icon: '📚' },
    { id: 'community', name: 'Community Stories', icon: '💬' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <LoadingSpinner size="xl" color="purple" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">🧠 Mental Health & Wellness</h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">
            Strengthen your mind, elevate your game. Connect with licensed therapists, 
            access motivational content, and build mental resilience for peak basketball performance.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-purple-500 text-white shadow-lg scale-105'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-12">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-md">
                <div className="text-4xl mb-4">👨‍⚕️</div>
                <h3 className="text-xl font-bold text-white mb-2">Licensed Therapists</h3>
                <p className="text-gray-300 mb-4">Connect with verified mental health professionals specializing in sports psychology.</p>
                <button 
                  onClick={() => setActiveTab('therapists')}
                  className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-xl transition-colors"
                >
                  Find Therapist
                </button>
              </div>

              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-md">
                <div className="text-4xl mb-4">🎥</div>
                <h3 className="text-xl font-bold text-white mb-2">Motivation Hub</h3>
                <p className="text-gray-300 mb-4">Access inspiring content from basketball legends, TED talks, and motivational speakers.</p>
                <button 
                  onClick={() => setActiveTab('motivation')}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl transition-colors"
                >
                  Watch Now
                </button>
              </div>

              <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 border border-green-500/30 rounded-2xl p-6 backdrop-blur-md">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-bold text-white mb-2">Mindset Resources</h3>
                <p className="text-gray-300 mb-4">Explore books, courses, and tools for developing mental strength and positive mindset.</p>
                <button 
                  onClick={() => setActiveTab('mindset')}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-xl transition-colors"
                >
                  Explore
                </button>
              </div>
            </div>

            {/* Featured Content */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">Why Mental Health Matters in Basketball</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <ul className="space-y-4 text-gray-300">
                    <li className="flex items-start space-x-3">
                      <span className="text-green-400 mt-1">✓</span>
                      <span><strong className="text-white">Improved Performance:</strong> Mental clarity leads to better decision-making on the court</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-green-400 mt-1">✓</span>
                      <span><strong className="text-white">Stress Management:</strong> Handle pressure situations and competitive stress effectively</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-green-400 mt-1">✓</span>
                      <span><strong className="text-white">Team Dynamics:</strong> Better communication and relationships with teammates</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-green-400 mt-1">✓</span>
                      <span><strong className="text-white">Resilience:</strong> Bounce back from setbacks and maintain motivation</span>
                    </li>
                  </ul>
                </div>
                <div className="text-center">
                  <img 
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500" 
                    alt="Mental wellness" 
                    className="rounded-xl mx-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'therapists' && (
          <div className="space-y-8">
            {/* Therapist Registration CTA */}
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-md text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Are you a licensed therapist?</h2>
              <p className="text-gray-300 mb-6">Join our platform to help basketball players achieve mental wellness and peak performance.</p>
              <Link 
                to="/therapist-registration"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Register as Therapist
              </Link>
            </div>

            {/* Therapist List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {therapists.map((therapist) => (
                <div key={therapist.id} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <img 
                      src={therapist.image} 
                      alt={therapist.name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-bold text-white">{therapist.name}</h3>
                        {therapist.verified && (
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">✓ Verified</span>
                        )}
                      </div>
                      <p className="text-purple-300 font-medium mb-2">{therapist.title}</p>
                      <p className="text-gray-300 text-sm mb-3">{therapist.bio}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="text-sm">
                          <span className="text-gray-400">Specialties:</span>
                          <span className="text-white ml-2">{therapist.specialties.join(', ')}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-400">License:</span>
                          <span className="text-white ml-2">{therapist.license}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-400">Rate:</span>
                          <span className="text-green-400 ml-2 font-bold">${therapist.rate}/session</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-400">Insurance:</span>
                          <span className="text-white ml-2">{therapist.insurance.join(', ')}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="flex text-yellow-400">
                            {'★'.repeat(Math.floor(therapist.rating))}
                          </div>
                          <span className="text-gray-300 text-sm">{therapist.rating}</span>
                        </div>
                        <span className="text-green-400 text-sm">{therapist.availability}</span>
                      </div>

                      <div className="mt-4 flex space-x-3">
                        <button className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-xl transition-colors">
                          Book Session
                        </button>
                        <button className="bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-4 rounded-xl transition-colors">
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'motivation' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">🎥 Motivation Hub</h2>
              <p className="text-gray-300">Get inspired by basketball legends, motivational speakers, and transformative TED talks</p>
            </div>

            {/* Video Categories */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {['All', 'Motivation', 'Mindset', 'Confidence', 'Success'].map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 bg-white/10 hover:bg-purple-500 text-white rounded-xl transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Video Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {motivationalVideos.map((video) => (
                <div key={video.id} className="bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                  <div className="relative">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <button className="bg-purple-500 hover:bg-purple-600 text-white rounded-full p-4">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 5v10l8-5-8-5z"/>
                        </svg>
                      </button>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-sm px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-bold mb-2">{video.title}</h3>
                    <p className="text-purple-300 text-sm mb-2">{video.speaker}</p>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>{video.category}</span>
                      <span>{video.views} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'mindset' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">📚 Mindset Resources</h2>
              <p className="text-gray-300">Develop mental strength with curated books, courses, and tools for peak performance</p>
            </div>

            {/* Resource Categories */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {['All', 'Books', 'Courses', 'Meditation', 'Tools'].map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 bg-white/10 hover:bg-green-500 text-white rounded-xl transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mindsetResources.map((resource) => (
                <div key={resource.id} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <img 
                    src={resource.image} 
                    alt={resource.title}
                    className="w-full h-32 object-cover rounded-xl mb-4"
                  />
                  <div className="mb-2">
                    <span className="bg-green-500/30 text-green-300 text-xs px-2 py-1 rounded-full">
                      {resource.type}
                    </span>
                  </div>
                  <h3 className="text-white font-bold mb-2">{resource.title}</h3>
                  <p className="text-green-300 text-sm mb-2">by {resource.author}</p>
                  <p className="text-gray-300 text-sm mb-4">{resource.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                      <div className="flex text-yellow-400">
                        {'★'.repeat(Math.floor(resource.rating))}
                      </div>
                      <span className="text-gray-300 text-sm">{resource.rating}</span>
                    </div>
                  </div>

                  <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-xl transition-colors">
                    Access Resource
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'community' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">💬 Community Stories</h2>
              <p className="text-gray-300">Share and discover inspirational stories from fellow basketball players</p>
            </div>

            {/* Share Story CTA */}
            {isAuthenticated && (
              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl p-6 backdrop-blur-md text-center">
                <h3 className="text-xl font-bold text-white mb-4">Share Your Inspirational Story</h3>
                <p className="text-gray-300 mb-6">Help motivate other players by sharing your journey, breakthrough moments, or positive experiences.</p>
                <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105">
                  Share Story
                </button>
              </div>
            )}

            {/* Coming Soon */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-12 border border-white/10 text-center">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-white mb-4">Community Stories Coming Soon!</h3>
              <p className="text-gray-300 max-w-2xl mx-auto">
                We're building an amazing community platform where players can share their inspirational stories, 
                motivational posts, and positive experiences. Level up your account to unlock video posting and more features!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentalHealthPage;